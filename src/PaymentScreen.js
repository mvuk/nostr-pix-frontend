import React, { useState, useEffect } from 'react';

const PaymentScreen = ({ qrData, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [lightningInvoice, setLightningInvoice] = useState(null); // Lightning invoice state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const sendPayload = async () => {
      try {
        // Send the raw QR code data to the backend
        const response = await fetch('https://your-backend-server.com/api/generate-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrData }), // Send the raw QR code data
        });

        if (!response.ok) {
          throw new Error('Failed to generate Lightning invoice');
        }

        const result = await response.json();
        setLightningInvoice(result.lightningInvoice); // Set the Lightning invoice
      } catch (error) {
        console.error('Error sending data:', error);
        setError('Failed to generate Lightning invoice. Please try again.');
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    sendPayload();
  }, [qrData]);

  const handlePayInvoice = async () => {
    if (window.webln) {
      try {
        await window.webln.enable(); // Enable WebLN
        const paymentResult = await window.webln.sendPayment(lightningInvoice); // Send payment
        alert(`Payment successful! Preimage: ${paymentResult.preimage}`);
      } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
    } else {
      alert('WebLN is not available. Please use a Lightning-compatible browser.');
    }
  };

  return (
    <div>
      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Generating Lightning Invoice...</h2>
          <p>Please wait while we process your request.</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Go Back
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Lightning Invoice</h2>
          <p>{lightningInvoice}</p>
          <button
            onClick={handlePayInvoice}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Pay Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentScreen;