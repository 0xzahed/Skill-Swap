import React, { useState, useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { updateProfile } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaCalendar,
  FaCamera,
} from "react-icons/fa";
import { motion } from "framer-motion";

const MyProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  // Handle image upload to Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);
    uploadData.append("upload_preset", "skillswap_profile");
    uploadData.append("cloud_name", "dcpdxybut");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dcpdxybut/image/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, photoURL: data.secure_url }));
        
        // Immediately update Firebase profile with new photo
        await updateProfile(user, {
          photoURL: data.secure_url,
        });
        
        // Update context
        setUser({ ...user, photoURL: data.secure_url });
        
        toast.success("Photo uploaded and saved successfully!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image!");
    } finally {
      setUploading(false);
    }
  };

  // Handle save profile update
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(user, {
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });
      
      // Force reload user data
      const updatedUser = {
        ...user,
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      };
      
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  //handle cancel
  const handleCancel = () => {
    setFormData({
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200 py-12 px-4">
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-base-content mb-2">
            My Profile
          </h1>
          <p className="text-base-content/70">
            Manage your account information
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1"
          >
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
                    <img
                      src={
                        formData.photoURL ||
                        user.photoURL ||
                        "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover bg-base-100"
                    />
                  </div>
                  {isEditing && (
                    <label
                      htmlFor="photo-upload"
                      className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-3 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    >
                      {uploading ? (
                        <div className="animate-spin">⏳</div>
                      ) : (
                        <FaCamera className="text-lg" />
                      )}
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  )}
                  {!isEditing && (
                    <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-3 shadow-lg">
                      <FaUser className="text-lg" />
                    </div>
                  )}
                </div>

                <h2 className="text-xl font-bold text-base-content mb-1">
                  {user.displayName || "Anonymous User"}
                </h2>
                <p className="text-base-content/70 text-sm mb-3 flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  Verified Account
                </p>

                <div className="w-full mt-4 pt-4 border-t border-base-300">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-base-content/70">Member Since</span>
                    <span className="font-semibold text-base-content flex items-center gap-1">
                      <FaCalendar className="text-primary" />
                      {new Date(user.metadata.creationTime).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-base-content/70">Last Sign In</span>
                    <span className="font-semibold text-base-content">
                      {new Date(
                        user.metadata.lastSignInTime
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Information Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-base-100 rounded-2xl shadow-xl p-6 border border-base-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-base-content">
                  Account Details
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-primary btn-sm gap-2"
                  >
                    <FaEdit />
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-base-200 p-5 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FaUser className="text-primary text-lg" />
                      </div>
                      <div>
                        <p className="text-base-content/70 text-xs uppercase tracking-wide">
                          Full Name
                        </p>
                        <p className="text-base-content font-semibold text-lg">
                          {user.displayName || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-base-200 p-5 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-primary text-lg" />
                      </div>
                      <div>
                        <p className="text-base-content/70 text-xs uppercase tracking-wide">
                          Email Address
                        </p>
                        <p className="text-base-content font-semibold text-lg break-all">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-base-content mb-2 block">
                      Full Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-4 text-primary" />
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="input input-bordered w-full pl-12 h-12 border-base-300 bg-base-100 text-base-content focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary flex-1 gap-2"
                    >
                      <FaSave />
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn btn-outline border-base-300 flex-1 gap-2"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
