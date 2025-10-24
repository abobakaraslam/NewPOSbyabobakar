"use client";

import React, { useEffect, useState, ChangeEvent } from "react";

interface Product {
  productId: string;
  productName: string;
}

function SaleProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/userData/allProduct");
        if (!response.ok) throw new Error("Failed to fetch Products");

        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle typing in search input
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = products.filter((p) =>
      p.productName.toLowerCase().includes(value)
    );
    setFilteredProducts(filtered);
  };

  // Handle product selection
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Sale Product
      </h3>

      <form className="max-w-sm mx-auto space-y-3">
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={handleSearch}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                     focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                     dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                     dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />

        {/* Product Select Menu */}
        <div>
          <label
            htmlFor="productSelect"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select Product
          </label>

          <select
            id="productSelect"
            value={selectedProduct}
            onChange={handleSelect}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                       focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 
                       dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                       dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">-- Select a Product --</option>
            {filteredProducts.map((product, index) => (
              <option
                key={`${product.productId || "no-id"}-${index}`}
                value={product.productId}
              >
                {product.productName}
              </option>
            ))}
          </select>
        </div>
      </form>

      {/* Optional: Display selected product */}
      {selectedProduct && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          Selected Product ID: <strong>{selectedProduct}</strong>
        </p>
      )}
    </div>
  );
}

export default SaleProduct;
