import React, { useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const MyProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl font-semibold">Please login to view profile</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);

    updateProfile(user, formData)
      .then(() => {
        setUser({ ...user, ...formData });
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile");
      })
      .finally(() => setLoading(false));
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">My Profile</h1>

        <div className="flex justify-center mb-6">
          <img
            src={formData.photoURL || user.photoURL || "https://i.postimg.cc/5y8zTvMg/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-500"
          />
        </div>

        {!isEditing ? (
          <div className="space-y-4 text-center">
            <p><strong>Name:</strong> {user.displayName || "Not provided"}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <input
              type="url"
              name="photoURL"
              value={formData.photoURL}
              onChange={handleChange}
              placeholder="Photo URL"
              className="w-full px-3 py-2 border rounded text-sm"
            />
            <div className="flex justify-between">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
