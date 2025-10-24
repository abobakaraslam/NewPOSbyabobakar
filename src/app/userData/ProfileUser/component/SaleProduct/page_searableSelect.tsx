"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

interface Product {
  productId: string;
  productName: string;
}

function SaleProduct() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{ value: string; label: string } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/userData/allProduct");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Transform data for react-select
  const options = products.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Sale Product
      </h3>

      <div className="max-w-sm mx-auto">
        <label
          htmlFor="productSelect"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select Product
        </label>

        <Select
          id="productSelect"
          options={options}
          value={selectedProduct}
          onChange={(option) => setSelectedProduct(option)}
          placeholder="Search or select a product..."
          className="text-sm"
          isSearchable
        />
      </div>

      {selectedProduct && (
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          Selected Product ID: <strong>{selectedProduct.value}</strong>
        </p>
      )}
    </div>
  );
}

export default SaleProduct;
