"use client";

import { useState, useMemo } from "react";

interface BillGroup {
  _id: { billId: string; date: string };
  totalSaleAmount: number;
  items: {
    productName: string;
    quantitySold: number;
    priceSalePerUnit: number;
    priceSaleAmount: number;
  }[];
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString("en-PK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BillRecord(): JSX.Element {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [bills, setBills] = useState<BillGroup[]>([]);
  const [showBills, setShowBills] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGetBills = async () => {
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }

    setError("");
    setLoading(true);

    const finalEndDate = endDate || startDate;

    try {
      const response = await fetch("/api/adminData/billRecord/getByDate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate: finalEndDate }),
      });

      const data = await response.json();

      if (data.success) {
        const sorted = data.bills.sort(
          (a: BillGroup, b: BillGroup) =>
            new Date(a._id.date).getTime() - new Date(b._id.date).getTime()
        );
        setBills(sorted);
        setShowBills(true);
      } else {
        setError(data.message || "No bills found.");
        setShowBills(false);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bills. Please try again.");
      setShowBills(false);
    } finally {
      setLoading(false);
    }
  };

  const overall = useMemo(() => {
    if (!bills.length) return { sale: 0 };
    return bills.reduce(
      (acc, bill) => ({
        sale: acc.sale + bill.totalSaleAmount,
      }),
      { sale: 0 }
    );
  }, [bills]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, { bills: BillGroup[]; sale: number }> = {};

    bills.forEach((bill) => {
      const date = bill._id.date;
      if (!groups[date]) {
        groups[date] = { bills: [], sale: 0 };
      }
      groups[date].bills.push(bill);
      groups[date].sale += bill.totalSaleAmount;
    });

    return Object.entries(groups).map(([date, data]) => ({
      date,
      ...data,
    }));
  }, [bills]);

  const headerColors = ["from-green-700 to-green-600", "from-indigo-700 to-indigo-600"];

  return (
    <div className="flex flex-col items-center min-h-screen py-10 px-6">
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-3xl border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Bill Record Filter
        </h2>

        {showBills && bills.length === 0 && (
        <div className="text-center text-red-600 mb-5">
          No bills found for the selected date range.
        </div>
      )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Starting Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ending Date</label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleGetBills}
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-6 py-2.5 shadow-md transition-all duration-150 disabled:opacity-50"
          >
            {loading ? "Fetching..." : "Get Bills"}
          </button>
        </div>
      </div>

      {showBills && bills.length > 0 && (
        <div className="mt-10 w-full max-w-6xl space-y-8">
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg rounded-2xl p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Overall Summary ({bills.length} Bills)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                <p className="text-sm uppercase text-gray-200 mb-1">Total Sale Amount</p>
                <p className="text-2xl font-bold">Rs. {overall.sale.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {groupedByDate.map((group, index) => {
            const color = headerColors[index % 2];
            return (
              <div key={formatDate(group.date)} className="space-y-6">
                <div className={`bg-gradient-to-r ${color} text-white shadow-md rounded-2xl p-5`}>
                  <h3 className="text-lg font-semibold mb-3 text-center">
                    {formatDate(group.date)} ({group.bills.length} Bills)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6 text-center">
                    <div className="bg-white/10 p-3 rounded-xl">
                      <p className="text-sm uppercase text-gray-200 mb-1">Total Sale</p>
                      <p className="text-xl font-bold">Rs. {group.sale.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {group.bills.map((bill, i) => (
                  <div
                    key={i}
                    className="bg-white shadow-md rounded-2xl border border-gray-200 overflow-hidden"
                  >
                    <div className={`bg-gradient-to-r ${color} text-white p-4 flex justify-between items-center`}>
                      <h3 className="font-semibold">Bill ID: {bill._id.billId}</h3>
                      <p>{formatDate(bill._id.date)}</p>
                    </div>

                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                        <tr>
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3">Qty</th>
                          <th className="px-4 py-3">P/U</th>
                          <th className="px-4 py-3">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bill.items.map((item, j) => (
                          <tr key={j} className="border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2">{item.productName}</td>
                            <td className="px-4 py-2">{item.quantitySold}</td>
                            <td className="px-4 py-2">{item.priceSalePerUnit}</td>
                            <td className="px-4 py-2">{item.priceSaleAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="bg-blue-50 px-6 py-4 flex justify-between text-sm text-gray-700">
                      <span>Total Sale: Rs. {bill.totalSaleAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      
    </div>
  );
}
