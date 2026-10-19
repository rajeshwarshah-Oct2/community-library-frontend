export const initialUsers = [
  {
    id: "user-1",
    name: "Rahul Sharma",
    email: "rahul@college.edu",
    building: "Block A - 302"
  },
  {
    id: "user-2",
    name: "Priya Patel",
    email: "priya@college.edu",
    building: "Block B - 104"
  }
];

export const initialItems = [
  {
    id: "item-1",
    name: "Electric Drill Machine",
    category: "Tools",
    condition: "Good",
    description: "18V cordless drill with battery charger and basic drill bits. Great for assembling furniture.",
    maxDays: 5,
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    ownerId: "user-1",
    ownerName: "Rahul Sharma",
    building: "Block A - 302",
    availability: "Available"
  },
  {
    id: "item-2",
    name: "Projector",
    category: "Electronics",
    condition: "Like New",
    description: "1080p LED projector with HDMI and USB support. Perfect for movie nights in the common room.",
    maxDays: 3,
    imageUrl: "https://images.unsplash.com/photo-1768502171609-a51a20ea027a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    ownerId: "user-2",
    ownerName: "Priya Patel",
    building: "Block B - 104",
    availability: "Available"
  },
  {
    id: "item-4",
    name: "Air Fryer",
    category: "Kitchen",
    condition: "Excellent",
    description: "4L capacity digital air fryer for quick snacks and hostel cooking.",
    maxDays: 4,
    imageUrl: "https://apollo.olx.in/v1/files/opltu8gap05q1-IN/image;s=300x600;q=60;f=webp",
    ownerId: "user-2",
    ownerName: "Priya Patel",
    building: "Block B - 104",
    availability: "Borrowed"
  }
];
export const initialRequests = [
  {
    id: "req-1",
    itemId: "item-4",
    itemName: "Air Fryer",
    itemImage: "https://apollo.olx.in/v1/files/opltu8gap05q1-IN/image;s=300x600;q=60;f=webp",
    borrowerId: "user-1",
    borrowerName: "Rahul Sharma",
    ownerId: "user-2",
    ownerName: "Priya Patel",
    startDate: "2026-06-01",
    endDate: "2026-06-05",
    status: "Approved",
    rating: null,
    comment: ""
  }
];