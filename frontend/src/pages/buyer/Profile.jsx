import React from "react";
import { useAuth } from "../../store/AuthContext.jsx";

const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      <div className="text-sm text-ink/70 space-y-2">
        <div>Name: {user?.name}</div>
        <div>Role: {user?.role}</div>
      </div>
    </div>
  );
};

export default Profile;
