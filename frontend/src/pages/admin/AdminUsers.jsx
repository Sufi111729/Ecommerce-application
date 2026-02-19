import React, { useState } from "react";
import { banUser } from "../../api/adminApi.js";

const AdminUsers = () => {
  const [userId, setUserId] = useState("");

  const handleBan = async () => {
    if (!userId) return;
    await banUser(userId);
    alert("User banned");
  };

  return (
    <div className="bg-white border border-ink/10 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="flex gap-2">
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          className="rounded border-ink/20"
        />
        <button onClick={handleBan} className="bg-rose-600 text-white px-4 py-2 rounded">
          Ban User
        </button>
      </div>
    </div>
  );
};

export default AdminUsers;
