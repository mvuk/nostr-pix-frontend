import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parsePix } from 'pix-utils';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });

    const onScanSuccess = (data) => {
      try {
        const parsedData = parsePix(data); // Parse the QR code

        // Ensure the transaction amount is correctly extracted
        if (parsedData.transactionAmount === undefined) {
          // Manually extract the transaction amount from the raw QR code string
          const transactionAmountMatch = data.match(/54(\d{2})(\d+\.\d{2})/);
          if (transactionAmountMatch) {
            parsedData.transactionAmount = parseFloat(transactionAmountMatch[2]);
          }
        }

        setScannedData(parsedData); // Update state with parsed data
        setShowConfirmButton(true); // Show the "Confirm & Send" button
      } catch (error) {
        console.error('Error parsing QR code:', error);
        setScannedData({ error: 'Invalid Pix QR code' });
        setShowConfirmButton(false); // Hide the button if there's an error
      }
      scanner.clear(); // Stop the scanner after a successful scan
    };

    const onScanError = (err) => {
      console.error('QR scan error:', err);
    };

    scanner.render(onScanSuccess, onScanError);

    return () => {
      scanner.clear();
    };
  }, []);

  const handleConfirmAndSend = () => {
    console.log('Sending data:', scannedData);
    alert('Data sent successfully!');
  };

  return (
    <div>
      <h1>Pix Invoice QR Code Scanner</h1>
      <div id="qr-reader" style={{ width: '100%' }}></div>

      {/* Display parsed data */}
      <div>
        <h2>Scanned Data:</h2>
        <pre>{scannedData ? JSON.stringify(scannedData, null, 2) : 'Scan a QR code to display the data.'}</pre>
      </div>

      {/* Show "Confirm & Send" button if data is parsed */}
      {showConfirmButton && (
        <button onClick={handleConfirmAndSend} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
          Confirm & Send
        </button>
      )}
    </div>
  );
};

export default QRScanner;