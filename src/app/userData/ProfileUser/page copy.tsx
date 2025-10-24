"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SaleProduct from "./component/SaleProduct/page";
import BillRecord from "./component/BillRecord/page";

export default function ProfileAdmin(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeView, setActiveView] = useState<"dashboard" | "sale" | "bill">("dashboard");

  const router = useRouter();

  // Authentication Check
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "User" }),
        });

        const data = await response.json();

        if (data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setErrorMessage(data.message || "Invalid token");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setErrorMessage("Failed to fetch admin data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/userData/LoginUser");
    }
  }, [isAuthenticated, loading, router]);

  // ✅ Logout Function
  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userType");
    router.push("/userData/LoginUser");

    try {
      const response = await fetch("../../api/auth/logout", { method: "GET" });
      const data = await response.json();
      if (!data.success) {
        console.error("Error logging out:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Render Loading or Error State
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium text-lg">
          Authenticating user, please wait...
        </p>
      </div>
    );

  if (errorMessage)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-red-600 text-lg font-semibold">
          Error: {errorMessage}
        </h2>
      </div>
    );

  if (!isAuthenticated)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-gray-700 text-lg font-medium">
          Please log in to continue
        </h2>
      </div>
    );

  // Conditional Rendering for Dashboard, SaleProduct, and BillRecord
  return (
    <div className="flex flex-col">
    
      {/* Header */}
      <div className="flex justify-end p-4">
        <button
          className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 
                    focus:ring-blue-300 font-medium rounded-lg text-sm px-5 
                    py-2.5 dark:bg-red-600 dark:hover:bg-red-700 
                    focus:outline-none dark:focus:ring-red-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {activeView === "dashboard" && (
          <>
            <button
              type="button"
              onClick={() => setActiveView("sale")}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                         focus:ring-blue-300 font-medium rounded-lg text-sm px-5 
                         py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
                         focus:outline-none dark:focus:ring-blue-800"
            >
              Sale Product
            </button>

            <button
              type="button"
              onClick={() => setActiveView("bill")}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                         focus:ring-blue-300 font-medium rounded-lg text-sm px-5 
                         py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
                         focus:outline-none dark:focus:ring-blue-800"
            >
              Bill Record
            </button>
          </>
        )}

        {activeView === "sale" && (
          <div className="w-full">
            <div className="text-center mt-4">
              <button
                onClick={() => setActiveView("dashboard")}
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                           focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2"
              >
                Dashboard
              </button>
            </div>
            <SaleProduct />
          </div>
        )}

        {activeView === "bill" && (
          <div className="w-full">
            <div className="text-center mt-4">
              <button
                onClick={() => setActiveView("dashboard")}
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                           focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                           py-2.5 me-2 mb-2"
              >
                Dashboard
              </button>
            </div>
            <BillRecord />
          </div>
        )}
      </div>
    </div>
  );
}
