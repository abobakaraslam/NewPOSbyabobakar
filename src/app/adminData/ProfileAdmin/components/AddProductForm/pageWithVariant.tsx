"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  availableQuantity: number;
}

const sanitizeInput = (input: any): string => {
  const inputFilteredTrim = input.trim();
  const inputFiltered = inputFilteredTrim
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\/g, "");
  return inputFiltered;
};

function numberValidator(data: any): number {
  // Default result
  let resultTest = 0;

  // Check if input is actually a number type or a numeric string
  if (typeof data === "number" && !isNaN(data)) {
    return 1; // Pure number (like 123, 45.6)
  }

  if (typeof data === "string") {
    // Remove surrounding spaces
    const trimmed = data.trim();

    // Regex: matches integers or decimals, optionally negative
    const numberPattern = /^-?\d+(\.\d+)?$/;

    if (numberPattern.test(trimmed)) {
      resultTest = 1; // Valid numeric string (e.g. "123", "-45.67")
    }
  }

  return resultTest; // 0 for invalid, 1 for valid number
}

export default function AddProductForm(): JSX.Element {

   const router = useRouter();

  //states for input fields
  const [nameProductState, setNameProductState] = useState("");
  const [productsState, setProductState] = useState<Product[]>([]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [priceSaleState, setPriceSaleState] = useState("");
  const [pricePurchaseState, setPricePurchaseState] = useState("");
  const [quantityState, setQuantityState] = useState("");
  const [productTypes, setProductTypes] = useState<string[]>([""]);
  const [productTypesNew, setProductTypesNew] = useState<string[]>([""]);

  //states for error
  const [generalError, setGeneralError] = useState("");
  const [errorNameProductState, setErrorNameProductState] = useState("");
  const [errorPriceSaleState, setErrorPriceSaleState] = useState("");
  const [errorPricePurchaseState, setErrorPricePurchaseState] = useState("");
  const [errorQuantityProduct, setErrorQuantityProduct] = useState("");
  
  const MAX_TYPES = 5;

    // Fetch products
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch("/api/userData/saleProduct");
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
  
          const extracted_array = data.products.map((product: any) => {
            const stockItem = data.stock.find(
              (s: any) => s.productId === product.productId
            );
            const priceItem = data.price.find(
              (p: any) => p.productId === product.productId
            );
  
            return {
              productId: product.productId,
              productName: product.productName,
              availableQuantity: stockItem ? stockItem.availableQuantity : 0,
              priceSale: priceItem ? priceItem.priceSale : 0,
            };
          });
  
          setProductState(extracted_array);
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      };
      fetchProducts();
    }, []);
  
    const productOptions = productsState.map((p) => ({
      value: p.productId,
      label: `${p.productName} - Rs.${p.priceSale} - Qty: ${p.availableQuantity}`,
    }));
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous errors
    setGeneralError("");
    setErrorNameProductState("");

    const nameProduct = sanitizeInput(nameProductState);
    let allValid = true;

    if (nameProduct === "") {
      setGeneralError("Please enter all required information in correct format");
      setErrorNameProductState("Please enter a Product Name");
      allValid = false;
    }
    ////console.log("nameProduct: ", nameProduct)

    // Validating Product-Type and pushing into new array
    const productTypesNew = [];
    for (let index = 0; index < productTypes.length; index++) {
      const element = productTypes[index];
      ////console.log("element ", index, ": ", element);

      const element_sanitized = sanitizeInput(element);
      
      productTypesNew.push(element_sanitized);
      setProductTypesNew([...productTypesNew]);
    }

    ////console.log("productTypesNew: ", productTypesNew)

    // Validating price-Sale
    const priceSale = sanitizeInput(priceSaleState); // Removing fake/virus input
    if (priceSale === "") {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorPriceSaleState("Please enter a Price here");
      allValid = false;
    } else {
      setErrorPriceSaleState("");
      const valid_priceSale = numberValidator(priceSale);
      if (valid_priceSale === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorPriceSaleState("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorPriceSaleState("");
        //setPriceSaleState(priceSale);
        //console.log("priceSale: ", priceSale)
      }
    }

    // Validating price-Purchase
    const pricePurchase = sanitizeInput(pricePurchaseState); // Removing fake/virus input
    if (pricePurchase === "") {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorPricePurchaseState("Please enter a Price here");
      allValid = false;
    } else {
      setErrorPricePurchaseState("");
      const valid_pricePurchase = numberValidator(pricePurchase);
      if (valid_pricePurchase === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorPricePurchaseState("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorPricePurchaseState("");
        //console.log("pricePurchase: ", pricePurchase)
      }
    }

    // Validating Quantity
    const quantityProduct = sanitizeInput(quantityState); // Removing fake/virus input
    if (quantityProduct === "") {
      setGeneralError(
        "Please enter all required information in correct format"
      );
      setErrorQuantityProduct("Please enter a Quantity here");
      allValid = false;
    } else {
      setErrorQuantityProduct("");
      const valid_quantityProduct = numberValidator(quantityProduct);
      if (valid_quantityProduct === 0) {
        setGeneralError(
          "Please enter all required information in correct format"
        );
        setErrorQuantityProduct("Please enter a valid Price here");
        allValid = false;
      }else{
        setErrorQuantityProduct("");
        //console.log("quantityProduct: ", quantityProduct)
      }
    }

    if (!allValid) return;

    // All validations passed
    //console.log("Form submitted successfully!");
    /*
    console.log({
      nameProduct,
      productTypesNew,
      priceSale,
      pricePurchase,
      quantityProduct
    });
*/
    // If all validations pass, proceed with registration
    if (allValid) {
      alert("Validation passed! Now you can proceed with registration.");
      // Send registration request
      try {
        //console.log("nameProduct: ", nameProduct);
        //console.log("productTypes: ", productTypesNew);
        //console.log("priceSale: ", priceSale);
        //console.log("pricePurchase: ", pricePurchase);
        //console.log("quantityProduct: ", quantityProduct);


        const response = await fetch("../../api/adminData/add_product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName: nameProduct,
            productTypes: productTypesNew,
            priceSale: priceSale,
            pricePurchase: pricePurchase,
            quantityProduct: quantityProduct
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setGeneralError(errorData.message || "Product Entry is failed.");
          return;
        }

        const result = await response.json();

        setNameProductState("");
        setPricePurchaseState("");
        setPriceSaleState("");
        setQuantityState("");

        alert("Product is Added successful!");
        // Handle success (e.g., redirect or clear form)
        router.push("ProfileAdmin");

      
      } catch (error) {
        //console.log("error");
        
        setGeneralError(
          "An error occurred during insertion of product. Please try again."
        );
        
      }
    }
  };

  const handleAddType = () => {
    if (productTypes.length < MAX_TYPES) {
      setProductTypes([...productTypes, ""]);
    }
  };

  const handleRemoveType = (index: number) => {
    setProductTypes(productTypes.filter((_, i) => i !== index));
  };

  const handleTypeChange = (index: number, value: string) => {
    const updatedTypes = [...productTypes];
    updatedTypes[index] = value;
    setProductTypes(updatedTypes);
  };



  return (
    <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-4">
      {generalError && (
              <p className="text-red-500 text-xs text-center">{generalError}</p>
            )}
      <h1 className="text-xl font-bold mb-4 text-center">Add New Product 11</h1>

      

      <form onSubmit={handleSubmit}>

        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Select Existing Product
        </label>
        <Select
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
              const product = productsState.find((p) => p.productId === option.value);
              if (product) setSelectedProduct(product);
            }
          }}
          placeholder="Search product..."
          isSearchable
          className="text-sm"
        />


        {errorNameProductState && (
          <p className="text-red-600 text-sm">{errorNameProductState}</p>
        )}
        {/* Product Name */}
        <input
          type="text"
          placeholder="Product Name"
          value={nameProductState}
          onChange={(e) => setNameProductState(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        

        {/* Product Types */}
        <p className="font-semibold text-gray-800 mb-2 mt-7">
          Product Variant Types ({productTypes.length})
        </p>

        {productTypes.map((type, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              type="text"
              placeholder={`Product Type ${index + 1}`}
              value={type}
              onChange={(e) => handleTypeChange(index, e.target.value)}
              className="w-full p-2 border rounded"
            />
            {productTypes.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveType(index)}
                className="ml-2 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
              >
                ✕
              </button>
            )}
          </div>
        ))}

        {productTypes.length < MAX_TYPES && (
          <button
            type="button"
            onClick={handleAddType}
            className="bg-blue-600 text-white px-3 py-1 rounded mb-3 hover:bg-blue-700"
          >
            + Add More Type
          </button>
        )}

        
        {/* Price Details */}
        <p className="mt-10 mb-7 font-semibold text-gray-800">Price Detail000</p>

        <p className=" text-gray-800 text-sm">Sale Price</p>
        {errorPriceSaleState && (
          <p className="text-red-600 text-sm">{errorPriceSaleState}</p>
        )}
        <input
          type="number"
          placeholder="Sale Price per Item"
          className="w-full p-2 mb-2 border rounded"
          
          value={priceSaleState}
          onChange={(e) => setPriceSaleState(e.target.value)}
        />
        
        <p className=" text-gray-800 text-sm">Purchase Price</p>
        {errorPricePurchaseState && (
          <p className="text-red-600 text-sm">{errorPricePurchaseState}</p>
        )}
        <input
          type="number"
          placeholder="Purchase Price per Item"
          className="w-full p-2 mb-2 border rounded"

          value={pricePurchaseState}
          onChange={(e) => setPricePurchaseState(e.target.value)}
        />

        <p className=" text-gray-800 text-sm">Quantity</p>
        {errorQuantityProduct && (
          <p className="text-red-600 text-sm">{errorQuantityProduct}</p>
        )}
        <input
          type="number"
          placeholder="Quantity"
          className="w-full p-2 mb-4 border rounded"

          value={quantityState}
          onChange={(e) => setQuantityState(e.target.value)}
        />


        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
