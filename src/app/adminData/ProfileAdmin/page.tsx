"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddProductForm from "./components/AddProductForm/page";
import BillRecord from "./components/BillRecord/page";
import StockView from "./components/StockView/page";
import StockUpdate from "./components/StockUpdate/page";
// import StockView from "./components/StockView/page"; // Uncomment when component is ready

export default function ProfileAdmin(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [activeView, setActiveView] = useState<"dashboard" | "sale" | "bill" | "stock" | "stockUpdate">("dashboard");

  const router = useRouter();

  const handleLogout = async () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("userType");
    router.push("/userData/LoginUser");

    try {
      const response = await fetch("../../api/auth/logout", { method: "GET" });
      const data = await response.json();
      if (!data.success) console.error("Error logging out:", data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch("/api/auth/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userType: "Admin" }),
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
      router.push("/adminData/LoginAdmin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium text-lg">Loading, please wait...</p>
      </div>
    );

  if (errorMessage) return <div><h2>Error: {errorMessage}</h2></div>;

  if (!isAuthenticated)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-700 font-medium text-lg">Processing, please wait...</p>
      </div>
    );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex justify-between p-4">
        <p className="font-medium text-lg">EasyPOS</p>
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

      <div>
        <h1 className="text-center">Ammad Traders</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-row items-center justify-center p-4 flex-wrap gap-4">
        {activeView === "dashboard" && (
          <>
            {/* Add Item */}
            <button
              type="button"
              onClick={() => setActiveView("sale")}
              className="group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2"
            >
              <img
                src="/images/addItem500.png"
                alt="Add Item"
                className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                Add Item
              </span>
            </button>

            {/* Bill Record */}
            <button
              type="button"
              onClick={() => setActiveView("bill")}
              className="group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2"
            >
              <img
                src="/images/BillGeneation500.png"
                alt="Bill Record"
                className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                Bill Record
              </span>
            </button>

            {/* Stock View */}
            <button
              type="button"
              onClick={() => setActiveView("stock")}
              className="group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2"
            >
              <img
                src="/images/stock500.png"
                alt="Stock View"
                className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                Stock View
              </span>
            </button>

            {/* Stock update */}
            <button
              type="button"
              onClick={() => setActiveView("stockUpdate")}
              className="group w-44 h-44 bg-white border border-gray-200 rounded-2xl shadow-md 
                        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 
                        flex flex-col items-center justify-center p-2"
            >
              <img
                src="/images/stockUpdate.png"
                alt="Stock Update"
                className="w-24 h-24 mb-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-base font-semibold text-gray-700 group-hover:text-white">
                Stock Update
              </span>
            </button>
          </>
        )}

        {/* Add Product Form */}
        {activeView === "sale" && (
          <div className="w-full flex flex-col items-center justify-center">
            <div className="text-center">
              <button
                onClick={() => setActiveView("dashboard")}
                className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 
                          focus:ring-gray-300 font-medium rounded-lg text-sm px-5 
                          py-2.5 me-2 mb-2"
              >
                Dashboard
              </button>
            </div>
            <div className="flex items-center justify-center w-full">
              <AddProductForm />
            </div>
          </div>
        )}

        {/* Bill Record View */}
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

        {/* Stock View Placeholder */}
        {activeView === "stock" && (
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
            {/* Replace this placeholder with your actual StockView component */}
            <StockView />
          </div>
        )}

        {/* Stock Update Placeholder */}
        {activeView === "stockUpdate" && (
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
            {/* Replace this placeholder with your actual StockView component */}
            <StockUpdate />
          </div>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-8 mb-8">
        Software Developed by Abo Bakar<br />+92-313-5369068
      </p>
    </div>
  );
}
