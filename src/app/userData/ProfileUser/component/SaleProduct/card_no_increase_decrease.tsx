"use client";

import React, { useEffect, useState } from "react";
import Select from "react-select";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  availableQuantity: number;
}

interface CartItem {
  productId: string;
  productName: string;
  priceSale: number;
  quantitySale: number;
}

function SalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/userData/saleProduct");
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        console.log("data: ", data)

        const extracted_array = data.products.map((product: any) => {
        const stockItem = data.stock.find((s: any) => s.productId === product.productId);
        const priceItem = data.price.find((p: any) => p.productId === product.productId);

        return {
          productId: product.productId,
          productName: product.productName,
          stockId: stockItem ? stockItem.stockId : null,
          availableQuantity: stockItem ? stockItem.availableQuantity : null,
          purchaseId: priceItem ? priceItem.purchaseId : null,
          priceSale: priceItem ? priceItem.priceSale : null,
        };
      });

      console.log("extracted_array: ", extracted_array)


        //setProducts(data.products);
        setProducts(extracted_array);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Convert product list to react-select format
  const productOptions = products.map((p) => ({
    value: p.productId,
    label: `${p.productName} - Rs.${p.priceSale} - Qauntity.${p.availableQuantity}`,
    priceSale: p.priceSale,
  }));

  // Handle adding to cart
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const existingItem = cart.find((item) => item.productId === selectedProduct.productId);

    if (existingItem) {
      // Update quantity if already in cart
      setCart(
        cart.map((item) =>
          item.productId === selectedProduct.productId
            ? { ...item, quantity: item.quantitySale + 1 }
            : item
        )
      );
    } else {
      // Add new product to cart
      setCart([
        ...cart,
        {
          productId: selectedProduct.productId,
          productName: selectedProduct.productName,
          priceSale: selectedProduct.priceSale,
          quantitySale: 1,
        },
      ]);
    }

    setSelectedProduct(null); // Reset selection
  };

  // Handle cart item removal
  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  // Calculate total bill
  const totalAmount = cart.reduce(
    (total, item) => total + item.priceSale * item.quantitySale,
    0
  );

  // Handle bill generation
  const handleGenerateBill = () => {
    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    console.log("Final Bill:", cart);
    alert(`Bill Generated! Total Amount: Rs.${totalAmount}`);
    // Later, you can post this data to backend for record
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
      Product Sale
      </h2>

      {/* Product Selection */}
      <div className="mb-4">
        <label
          htmlFor="productSelect"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Search and Select Product
        </label>

        <Select
          id="productSelect"
          options={productOptions}
          value={
            selectedProduct
              ? {
                  value: selectedProduct.productId,
                  label: `${selectedProduct.productName} - Rs.${selectedProduct.priceSale}`,
                }
              : null
          }
          onChange={(option) => {
            if (option) {
              const product = products.find((p) => p.productId === option.value);
              if (product) setSelectedProduct(product);
            }
          }}
          placeholder="Search product..."
          isSearchable
          className="text-sm"
        />

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!selectedProduct}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Add to Cart
        </button>
      </div>

      {/* Cart Section */}
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
          🛒 Cart Items
        </h3>

        {cart.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No items in cart.</p>
        ) : (
          <table className="w-full text-sm text-gray-700 dark:text-gray-200">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 text-left">Product</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Price (Rs.)</th>
                <th className="text-right">Total</th>
                <th className="text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.productId} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2">{item.productName}</td>
                  <td className="text-center">{item.quantitySale}</td>
                  <td className="text-right">{item.priceSale}</td>
                  <td className="text-right">{item.priceSale * item.quantitySale}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Bill Summary */}
        {cart.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Total: Rs.{totalAmount}
            </span>
            <button
              type="button"
              onClick={handleGenerateBill}
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Generate Bill
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalePage;
