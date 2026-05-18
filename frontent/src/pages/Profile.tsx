import React, { useEffect, useState, useCallback, type FormEvent } from "react";
import type { TAddress, TUser } from "../types";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";
import { getProfile } from "../services/profileService";
import Navbar from "../components/NavBar";

const initialForm: TAddress = {
  name: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

export default function Profile() {
  const [profile, setProfile] = useState<TUser | null>(null);
  const [addresses, setAddresses] = useState<TAddress[]>([]);
  const [form, setForm] = useState<TAddress>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const payload = {
    name: form.name,
    city: form.city,
    state: form.state,
    pincode: form.pincode,
    isDefault: !!form.isDefault, // Force it to be a strict boolean
  };

  // LOAD PROFILE & ADDRESSES
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profileData, addressData] = await Promise.all([
        getProfile(),
        getAddresses(),
      ]);
      setProfile(profileData);
      setAddresses(addressData);
    } catch (err) {
      console.error("Failed to fetch profile data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // HANDLE INPUT
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // SUBMIT (CREATE OR UPDATE)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateAddress(editingId, payload);
      } else {
        await createAddress(form);
      }
      resetForm();
      const updatedAddresses = await getAddresses();
      setAddresses(updatedAddresses);
    } catch (err) {
      alert("Error saving address. Please try again.");
    }
  };

  // DELETE
  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await deleteAddress(id);
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // EDIT
  const handleEdit = (address: TAddress) => {
    setEditingId(address.id || null);
    setForm({ ...address }); // Spread to avoid reference issues
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading profile...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Navbar />
      <h1>Profile Page</h1>

      {/* USER DETAILS */}
      <section style={sectionStyle}>
        <h2>User Details</h2>
        <p><strong>Name:</strong> {profile?.name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
      </section>

      {/* ADDRESS FORM */}
      <section style={sectionStyle}>
        <h2>{editingId ? "Edit Address" : "Add New Address"}</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
          <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
          <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
          
          <label style={{ cursor: "pointer" }}>
            <input type="checkbox" name="isDefault" checked={form.isDefault ?? false} onChange={handleChange} />
            {" "}Set as Default Address
          </label>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ flex: 1 }}>
              {editingId ? "Update" : "Save"} Address
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} style={{ flex: 1 }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* ADDRESS LIST */}
      <section>
        <h2>My Addresses</h2>
        {addresses.length === 0 ? (
          <p>No addresses saved yet.</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr.id} style={addressCardStyle}>
              <div>
                <strong>{addr.name}</strong> {addr.isDefault && <small>(Default)</small>}
                <p>{addr.city}, {addr.state} - {addr.pincode}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleEdit(addr)}>Edit</button>
                <button onClick={() => handleDelete(addr.id)} style={{ color: "red" }}>Delete</button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

// Minimal Styles
const sectionStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "20px",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  maxWidth: "400px",
};

const addressCardStyle: React.CSSProperties = {
  border: "1px solid #eee",
  padding: "15px",
  borderRadius: "5px",
  marginBottom: "10px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
