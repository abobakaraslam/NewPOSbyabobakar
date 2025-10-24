"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Define Model Type (Instead of importing complete Model)
interface BillItem {
  productId: string;
  productName: string;
  quantitySold: number;
  priceSalePerUnit: number;
  priceSaleAmount:  number;
  customerId: string;
  billId: string;
  createdAt: string;
}



const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString("en-PK", {
    weekday: "short",    // Sat
    day: "2-digit",      // 18
    month: "short",      // Oct
    year: "numeric",     // 2025
  });
};





export default function BillPage() {

  const router = useRouter();

 
  const { billId } = useParams();
  const [priceTotal, setPriceTotal] = useState<number>(0);
  const [billState, setBill] = useState<BillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateBillState,  setDateBillState] = useState("");

  

  useEffect(() => {
    
    const fetchBill = async () => {
      try {
        const res = await fetch(`/api/userData/printBill/${billId}`);
        const data = await res.json();

        //console.log("data: ",data);

        let priceTotal = 0;
        const filteredData: any[] = [];

        data.forEach((item: any) => {
          // Add price to total
          priceTotal += item.priceSaleAmount;

          /*
          const formattedDate = new Date(item.createdAt).toLocaleString("en-PK", {
            weekday: "short",    // Sat
            day: "2-digit",      // 18
            month: "short",      // Oct
            year: "numeric",     // 2025
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          });
          */

          //formatDate(item.createdAt);

          setDateBillState(formatDate(item.createdAt));

          // Extract only required fields
          filteredData.push({
            productId: item.productId,
            productName: item.productName,
            saleId: item.saleId ?? "",
            quantitySold: item.quantitySold,
            priceSalePerUnit: item.priceSalePerUnit,
            priceSaleAmount: item.priceSaleAmount,
            customerId: item.customerId,
            billId: item.billId,
            createdAt: item.createdAt,
          });
        });

        setBill(filteredData);

        ////console.log("Filtered Data:", filteredData);
        ////console.log("Total Price:", priceTotal);
        setPriceTotal(priceTotal);

      
      
      } catch (err) {
        console.error("Failed to fetch bill:", err);
      } finally {
        setLoading(false);
      }
    };

    if (billId) fetchBill();
  }, [billId]);

  const handlePrintTwice = async () => {
    window.print(); // First print
    await new Promise((r) => setTimeout(r, 2)); // wait 2.5 seconds
    window.print(); // Second print
  };

  if (loading) return <p>Loading bill...</p>;
  if (!billState) return <p>Bill not found.</p>;

  const GotoDashboard = ()=>{
    // Redirect to Bill Page
      router.push("/userData/ProfileUser/");
  }

// Spinner while loading
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-dotted rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700">Loading bill...</p>
      </div>
    );

    
  return (
    <div>
      <div className="text-center mt-8">
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 
                     focus:ring-blue-300 font-medium rounded-lg text-sm px-5 
                     py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 
                     focus:outline-none dark:focus:ring-blue-800"
              onClick={GotoDashboard}>
              Dashboard
      </button>
      
      </div>
      
    
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow receipt-container">
      
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-footer {
            display: block !important;
            text-align: center;
            margin-top: 20px;
            font-size: 10px;
            color: gray;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
          .receipt-container {
            width: 80mm;
            margin: 0 auto;
            padding: 10px;
            background: #fff;
            font-family: "Courier New", monospace;
            font-size: 12px;
            color: #000;
          }

          body {
            margin: 0;
            padding: 0;
            width: 80mm;
            font-family: "Arial", sans-serif;
            font-size: 12px;
          }
          * {
            color: #000 !important;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          th, td {
            padding: 2px 0;
            font-size: 11px;
            border: 1px solid #ccc;
          }
          h1{
            font-size: 16px;
          }
          p{
            font-size: 10px;
          }

          h1, p {
            margin: 0;
            padding: 2px 0;
            text-align: center;
          }
          .receipt-title {
            text-align: center;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 4px;
          }
          .receipt-total {
            text-align: right;
            margin-top: 6px;
            font-size: 13px;
            font-weight: bold;
          }
          .footer-text {
            text-align: center;
            font-size: 10px;
            margin-top: 10px;
            border-top: 1px dashed #000;
            padding-top: 5px;
          }
        }
        @media screen {
          .print-footer {
            display: none;
          }
        }
      `}</style>
      
      <h1 className="receipt-title text-2xl font-semibold mb-4 text-center">Ammad Traders</h1>
      
      <div>
        <p className="text-left"><span className="font-bold">Bill ID: </span>{billId}</p>
        <p className="text-left"><span className="font-bold">Date: </span>{dateBillState}</p>
      </div>

      <table className="receipt-table w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Item</th>
            <th className="p-2">Qty</th>
            <th className="p-2">U/P</th>
            <th className="p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {billState.map((item, index) => (
            <tr key={index} className="border-t">
              <td className="p-2">{item.productName}</td>
              <td className="p-2">{item.quantitySold}</td>
              <td className="p-2">Rs.{item.priceSalePerUnit}</td>
              <td className="p-2">Rs.{item.priceSaleAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="receipt-total">
        <p className="text-right">
          <span style={{fontWeight: "bold"}}>Total: </span>Rs.{priceTotal}
        </p>
      </div>

      <p className="footer-text text-center">Software develped by Abo Bakar <br />+92-313-5369068</p>

      <div className="text-center mt-6 no-print">
        <button
          onClick={handlePrintTwice}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          🖨️ Print Bill
        </button>
      </div>
    </div>
    </div>
  );
}
