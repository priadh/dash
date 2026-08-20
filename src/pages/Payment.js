import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const jobDetails = location.state;

  const handlePayment = () => {
    alert("✅ Payment Successful! Your job will be listed.");
    console.log("Job Posted:", jobDetails);
    // Here you would send jobDetails to backend/database
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Complete Payment - $99</h2>
      <div className="mb-6">
        <p><strong>{jobDetails.title}</strong> at <strong>{jobDetails.company}</strong></p>
        <p>Location: {jobDetails.location}</p>
      </div>
      <button onClick={handlePayment} className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Pay $99</button>
    </div>
  );
};

export default Payment;
