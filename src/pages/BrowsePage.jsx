import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { apiGetItems, apiGetLoggedInUser } from "../services/api";

export default function BrowsePage() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [selectedBuilding, setSelectedBuilding] = useState("All");

  const user = apiGetLoggedInUser();

  useEffect(() => {
    const loadItems = async () => {
      const data = await apiGetItems();
      setItems(data);
    };
    loadItems();
  }, []);

  const categories = ["All", "Tools", "Electronics", "Sports", "Kitchen", "Other"];
  const buildings = ["All", ...new Set(items.map((i) => i.building))];

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesAvailability = selectedAvailability === "All" || item.availability === selectedAvailability;
    const matchesBuilding = selectedBuilding === "All" || item.building === selectedBuilding;

    return matchesSearch && matchesCategory && matchesAvailability && matchesBuilding;
  });

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "var(--text-main)", marginBottom: "6px" }}>
          Browse Community Items
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Find tools, electronics, and equipment available to borrow from your neighbors.
        </p>
      </div>

      <div style={{
        backgroundColor: "#ffffff",
        padding: "20px",
        borderRadius: "14px",
        border: "1px solid var(--border-color)",
        marginBottom: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}>
        <div style={{ position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search by item name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 42px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", backgroundColor: "#fff" }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>Availability</label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", backgroundColor: "#fff" }}
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>Building / Block</label>
            <select
              value={selectedBuilding}
              onChange={(e) => setSelectedBuilding(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)", fontSize: "14px", backgroundColor: "#fff" }}
            >
              {buildings.map((bldg) => (
                <option key={bldg} value={bldg}>{bldg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>No items found matching your filters.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px"
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "1px solid var(--border-color)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}
              className="hover-card"
            >
              <div style={{ position: "relative" }}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "contain",
                    backgroundColor: "#f8fafc"
                  }}
                />
                <span style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  backgroundColor: item.availability === "Available" ? "#d1fae5" : "#fef3c7",
                  color: item.availability === "Available" ? "#065f46" : "#b45309",
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "20px"
                }}>
                  {item.availability}
                </span>
              </div>

              <div style={{ padding: "18px", display: "flex", flexDirection: "column", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--primary-color)", backgroundColor: "#ccfbf1", padding: "3px 8px", borderRadius: "6px" }}>
                    {item.category}
                  </span>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Condition: {item.condition}</span>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>{item.name}</h3>

                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <MapPin size={14} /> {item.ownerName} ({item.building})
                </p>

                <p style={{ fontSize: "13px", color: "var(--text-main)", marginBottom: "16px", flex: 1 }}>
                  {item.description.length > 90 ? item.description.substring(0, 90) + "..." : item.description}
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--border-color)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Calendar size={14} /> Max {item.maxDays} days
                  </span>

                  {item.ownerId === user?.id ? (
                    <Link
                      to="/my-listings"
                      style={{
                        backgroundColor: "#f1f5f9",
                        color: "var(--text-main)",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      My Item (Manage)
                    </Link>
                  ) : (
                    <Link
                      to={`/item/${item.id}`}
                      style={{
                        backgroundColor: "var(--primary-color)",
                        color: "#ffffff",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: 600,
                        textDecoration: "none"
                      }}
                    >
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}