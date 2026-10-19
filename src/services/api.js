const API_ORIGIN = "https://community-library-backend.onrender.com";
const API_BASE_URL = `${API_ORIGIN}/api`;

const resolveImageUrl = (url) => {
    if (!url) return url;

    if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
        return url;
    }

    return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

const toStoredImagePath = (url) => {
    if (url?.startsWith(`${API_ORIGIN}/uploads/`)) {
        return url.slice(API_ORIGIN.length);
    }

    return url;
};

export const apiUploadImage = async (file) => {
    if (!file) {
        throw new Error("Please select an image.");
    }

    const formData = new FormData();
    formData.append("file", file);

    let response;

    try {
        response = await fetch(`${API_BASE_URL}/images/upload`, {
            method: "POST",
            body: formData
        });
    } catch {
        throw new Error(
            "Cannot connect to the backend. Make sure Spring Boot is running."
        );
    }

    const responseText = await response.text();
    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, `Image upload failed (${response.status}).`)
        );
    }

    if (!data?.imageUrl) {
        throw new Error("The backend did not return an image URL.");
    }

    return data.imageUrl;
};


const getErrorMessage = (data, fallback) => {
    if (typeof data === "string" && data.trim()) {
        return data;
    }

    return data?.message || fallback;
};

const apiRequest = async (endpoint, options = {}) => {
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json"
            }
        });
    } catch {
        throw new Error(
            "Cannot connect to the backend. Make sure Spring Boot is running."
        );
    }

    const responseText = await response.text();
    let data = null;

    if (responseText) {
        try {
            data = JSON.parse(responseText);
        } catch {
            data = responseText;
        }
    }

    if (!response.ok) {
        throw new Error(
            getErrorMessage(data, `Request failed (${response.status}).`)
        );
    }

    return data;
};

const normalizeUser = (user) => ({
    id: String(user.id),
    name: user.name,
    email: user.email,
    building: user.building
});

const normalizeItem = (item) => ({
    ...item,
    id: String(item.id),
    ownerId: String(item.ownerId),
    imageUrl: resolveImageUrl(item.imageUrl)
});

const normalizeRequest = (request) => ({
    ...request,
    id: String(request.id),
    itemId: String(request.itemId),
    borrowerId: String(request.borrowerId),
    ownerId: String(request.ownerId),
    itemImage: resolveImageUrl(request.itemImage)
});

const toNumericId = (id) => {
    const numericId = Number(id);

    if (!Number.isSafeInteger(numericId) || numericId <= 0) {
        throw new Error("Invalid ID. Please log in again and retry.");
    }

    return numericId;
};

const saveLoggedInUser = (user) => {
    const normalizedUser = normalizeUser(user);

    localStorage.setItem(
        "logged_in_user",
        JSON.stringify(normalizedUser)
    );

    return normalizedUser;
};

export const apiLogin = async (email, password) => {
    try {
        const user = await apiRequest("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        return {
            success: true,
            user: saveLoggedInUser(user)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const apiRegister = async (userData) => {
    try {
        const user = await apiRequest("/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                password: userData.password,
                building: userData.building
            })
        });

        return {
            success: true,
            user: saveLoggedInUser(user)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const apiGetLoggedInUser = () => {
    const savedUser = localStorage.getItem("logged_in_user");

    if (!savedUser) {
        return null;
    }

    try {
        const user = JSON.parse(savedUser);

        if (
            !user ||
            !Number.isSafeInteger(Number(user.id)) ||
            Number(user.id) <= 0
        ) {
            localStorage.removeItem("logged_in_user");
            return null;
        }

        return normalizeUser(user);
    } catch {
        localStorage.removeItem("logged_in_user");
        return null;
    }
};

export const apiLogout = () => {
    localStorage.removeItem("logged_in_user");
};

export const apiGetItems = async () => {
    const items = await apiRequest("/items");

    if (!Array.isArray(items)) {
        throw new Error("Invalid items response from the backend.");
    }

    return items.map(normalizeItem);
};

export const apiCreateItem = async (itemData) => {
    try {
        const user = apiGetLoggedInUser();

        if (!user) {
            throw new Error("Please log in before listing an item.");
        }

        const item = await apiRequest("/items", {
            method: "POST",
            body: JSON.stringify({
                ...itemData,
                ownerId: toNumericId(user.id),
                ownerName: user.name,
                building: user.building
            })
        });

        return {
            success: true,
            item: normalizeItem(item)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const apiUpdateItem = async (updatedItem) => {
    try {
        const item = await apiRequest(
            `/items/${toNumericId(updatedItem.id)}`,
            {
                method: "PUT",
                body: JSON.stringify({
                    name: updatedItem.name,
                    category: updatedItem.category,
                    condition: updatedItem.condition,
                    description: updatedItem.description,
                    maxDays: updatedItem.maxDays,
                    imageUrl: toStoredImagePath(updatedItem.imageUrl)
                })
            }
        );

        return {
            success: true,
            item: normalizeItem(item)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const apiDeleteItem = async (itemId, reason) => {
    if (!reason || !reason.trim()) {
        throw new Error("Please enter a reason for deleting this item.");
    }

    const result = await apiRequest(
        `/items/${toNumericId(itemId)}`,
        {
            method: "DELETE",
            body: JSON.stringify({ reason: reason.trim() })
        }
    );

    return result;
};

export const apiToggleItemAvailability = async (itemId) => {
    const item = await apiRequest(
        `/items/${toNumericId(itemId)}/availability`,
        { method: "PUT" }
    );

    return {
        success: true,
        item: normalizeItem(item)
    };
};

export const apiGetRequests = async () => {
    const requests = await apiRequest("/requests");

    if (!Array.isArray(requests)) {
        throw new Error("Invalid borrow requests response from the backend.");
    }

    return requests.map(normalizeRequest);
};

export const apiCreateRequest = async (requestData) => {
    try {
        const user = apiGetLoggedInUser();

        if (!user) {
            throw new Error("Please log in before requesting an item.");
        }

        const request = await apiRequest("/requests", {
            method: "POST",
            body: JSON.stringify({
                itemId: toNumericId(requestData.itemId),
                borrowerId: toNumericId(user.id),
                borrowerName: user.name,
                startDate: requestData.startDate,
                endDate: requestData.endDate
            })
        });

        return {
            success: true,
            request: normalizeRequest(request)
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
};

export const apiUpdateRequestStatus = async (requestId, status) => {
    await apiRequest(
        `/requests/${toNumericId(requestId)}/status?status=${encodeURIComponent(status)}`,
        { method: "PUT" }
    );

    return { success: true };
};

export const apiSubmitReturn = async (requestId, rating, comment) => {
    await apiRequest(
        `/requests/${toNumericId(requestId)}/return`,
        {
            method: "PUT",
            body: JSON.stringify({ rating, comment })
        }
    );

    return { success: true };
};

export const apiConfirmReturnByOwner = async (requestId) => {
    await apiRequest(
        `/requests/${toNumericId(requestId)}/confirm-return`,
        { method: "PUT" }
    );

    return { success: true };
};
