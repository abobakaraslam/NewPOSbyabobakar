"use client";

import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Select from "react-select";

interface Product {
  productId: string;
  productName: string;
  priceSale: number;
  availableQuantity: number;
}

//
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
  
  const [selectedProductState, setSelectedProductState] = useState<Product | null>(null);

  const [priceSaleState, setPriceSaleState] = useState<number>(0);
  const [pricePurchaseState, setPricePurchaseState] = useState<number>(0);
  const [quantityState, setQuantityState] = useState<number>(0);
  const [productTypes, setProductTypes] = useState<string[]>([""]);
  const [productTypesNew, setProductTypesNew] = useState<string[]>([""]);

  //states for error
  const [generalError, setGeneralError] = useState("");
  const [errorNameProductState, setErrorNameProductState] = useState("");
  const [errorPriceSaleState, setErrorPriceSaleState] = useState("");
  const [errorPricePurchaseState, setErrorPricePurchaseState] = useState("");
  const [errorQuantityProduct, setErrorQuantityProduct] = useState("");

  const [message, setMessage] = useState<string | null>(null);


  const [showNewProductDiv, setShowNewProductDiv] = useState(false);
  const handleChange = (option: any) => {
    if (option && option.value !== "") {
      const product = productsState.find((p) => p.productId === option.value);
      if (product) {
        setSelectedProductState(product);
        setShowNewProductDiv(false); // hide div if an existing product selected
      }
    } else {
      setSelectedProductState(null);
      setShowNewProductDiv(true); // show div if "Select New Product" chosen
    }
  };
  
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
            //console.error("Error fetching products:", err);
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


    /* Select Existing Product */
    //console.log("selectedProductState: ", selectedProductState);
    const selectedProduct = selectedProductState;

    let selectedProductID = selectedProduct?.productId;
    //console.log("selectedProductID: ", selectedProductID);
    let selectedProductName = selectedProduct?.productName;
    //console.log("selectedProductName: ", selectedProductName);

    /* NewProductName is either required or not, depending upon above select */
    let requireNewProduct = 1; // 1 for yes
    if(!selectedProductState){
      //console.log("not selected product")
    }else{
      //console.log("selected product");
      requireNewProduct = 0; // 0 for no->require
    }

    let nameProduct = "";
    let allValid = true;

    if(requireNewProduct === 1){//yes require
      nameProduct = sanitizeInput(nameProductState);
      allValid = true;

      if (nameProduct === "") {
        setGeneralError("Please enter all required information in correct format");
        setErrorNameProductState("Please select product OR add new product");
        allValid = false;
      }
    }
    if (requireNewProduct === 0) {//not require
      nameProduct = "notProduct";
      allValid = true;
    }

    //console.log("nameProduct: ", nameProduct);

    // Validating price-Sale
    const priceSale = sanitizeInput(String(priceSaleState)); // Removing fake/virus input
    if (priceSale === "" || Number(priceSale) < 1) {
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
      }
    }


    // Validating price-Purchase
    const pricePurchase = sanitizeInput(String(pricePurchaseState)); // Removing fake/virus input
    if (pricePurchase === "" || Number(pricePurchase) < 1) {
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
      }
    }


    // Validating Quantity
    const quantityProduct = sanitizeInput(String(quantityState)); // Removing fake/virus input
    if (quantityProduct === "" || Number(quantityProduct) < 1) {
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

    
    const showToast = (msg: string) => {
      setMessage(msg);
      setTimeout(() => setMessage(null), 2000); // auto-hide after 2s
    };


    // If all validations pass, proceed with registration
    if (allValid) {
      //alert("Validation passed! Now you can proceed with registration.");
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
            selectedProductId: selectedProductID,
            selectedProductName: selectedProductName,
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
        setPricePurchaseState(0);
        setPriceSaleState(0);
        setProductState([]);
        setQuantityState(0);
        setSelectedProductState(null);
        setErrorNameProductState("");
        setGeneralError("");

        //alert("Product is Added successful!");
        // Handle success (e.g., redirect or clear form)
        showToast("Product added successfully!");


        /*
        router.replace("/adminData/ProfileAdmin"); // Replace removes history
        router.refresh(); // Revalidates the route
        */
       window.location.replace("/adminData/ProfileAdmin"); //reload the browser and clear the previous history entry

      } catch (error) {
        console.log("error");
        
        setGeneralError(
          "An error occurred during insertion of product. Please try again."
        );
        
      }
    }


    
  };



  return (
    <div className="w-full max-w-md p-4 bg-gray-100 rounded-lg shadow-md mt-4">
      {generalError && (
        <p className="text-red-500 text-xs text-center">{generalError}</p>
      )}

      <h1 className="text-xl font-bold mb-4 text-center">Add New Product</h1>

      <form onSubmit={handleSubmit}>

        {/* Product Name */}
        <p className="mt-10 mb-7 font-semibold text-gray-800">Product Name</p>

        {errorNameProductState && (
          <p className="text-red-600 text-sm mb-2">{errorNameProductState}</p>
        )}

        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Select Existing Product
        </label>
        <Select
          options={[{ value: "", label: "Select New Product" }, ...productOptions]}
          value={
            selectedProductState
              ? {
                  value: selectedProductState.productId,
                  label: `${selectedProductState.productName} - Rs.${selectedProductState.priceSale}`,
                }
              : { value: "", label: "" } // When nothing selected
          }
          onChange={handleChange}
          placeholder="Search product..."
          isSearchable
          className="text-sm"
        />

      {showNewProductDiv && (
        <div id="newproduct_div">
          <label className="block mt-2 text-sm font-medium text-gray-900 dark:text-white">
            Add New Product
          </label>
          {/* Product Name */}
          <input
            type="text"
            placeholder="Product Name"
            value={nameProductState}
            onChange={(e) => setNameProductState(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
        </div>
      )} 

        
        
        {/* Price Details */}
        <p className="mt-10 mb-7 font-semibold text-gray-800">Price Detail</p>

        <p className=" text-gray-800 text-sm">Sale Price</p>
        {errorPriceSaleState && (
          <p className="text-red-600 text-sm">{errorPriceSaleState}</p>
        )}
        <input
          type="number"
          placeholder="Sale Price per Item"
          className="w-full p-2 mb-2 border rounded"
          
          value={priceSaleState}
          onChange={(e) => setPriceSaleState(Number(e.target.value))}
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
          onChange={(e) => setPricePurchaseState(Number(e.target.value))}
        />

        {/* Stock Details */}
        <p className="mt-10 mb-7 font-semibold text-gray-800">Stock Detail</p>

        <p className=" text-gray-800 text-sm">Quantity</p>
        {errorQuantityProduct && (
          <p className="text-red-600 text-sm">{errorQuantityProduct}</p>
        )}
        <input
          type="number"
          placeholder="Quantity"
          className="w-full p-2 mb-4 border rounded"

          value={quantityState}
          onChange={(e) => setQuantityState(Number(e.target.value))}
        />


        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Product
        </button>
      </form>

      {message && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg transition-all">
          {message}
        </div>
      )}

    </div>
  );
}
