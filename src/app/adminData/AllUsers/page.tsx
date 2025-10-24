"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarAdmin from "../NavbarAdmin/page";

// Define User Type (Instead of importing User Model)
interface User {
  firstname: string;
  lastname: string;
  email: string;
  profilepic: string;
}

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/adminData/getAllUsers");
        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError(data.message || "Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);
  // Handle checkbox selection
  const handleCheckboxChange = (email: string) => {
    setSelectedUsers((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  // Handle delete function
  const handleDelete = async () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to delete.");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete selected users?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("../../api/adminData/deleteUsers", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: selectedUsers }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Selected users deleted successfully!");
        setUsers(users.filter((user) => !selectedUsers.includes(user.email)));
        setSelectedUsers([]); // Reset selection
      } else {
        alert("Failed to delete users: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Failed to delete users. Please try again.");
    }
  };

  // Handle update function
  const handleUpdate = () => {
    if (selectedUsers.length === 0) {
      alert("Please select at least one user to update.");
      return;
    }
    router.push(`UpdateUsers?emails=${selectedUsers.join(",")}`);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div>
      <NavbarAdmin />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">All Registered Users</h1>

        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Select</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Profile Pic</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange(user.email)}
                    checked={selectedUsers.includes(user.email)}
                  />
                </td>
                <td className="border px-4 py-2">
                  {user.firstname} {user.lastname}
                </td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">
                  <img
                    src={user.profilepic || "/default-profile.png"}
                    alt="Profile"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Selected Users
          </button>

          <button
            onClick={() => router.push("ProfileAdmin")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to Admin Profile
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update Selected Users
          </button>
        </div>
      </div>
    </div>
  );
}
