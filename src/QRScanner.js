import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parsePix } from 'pix-utils';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null); // State to store parsed data
  const [showButtons, setShowButtons] = useState(false); // State to control button visibility
  const [scanner, setScanner] = useState(null); // State to hold the scanner instance
  const [isScannerVisible, setIsScannerVisible] = useState(true); // State to control scanner visibility

  useEffect(() => {
    // Initialize the QR code scanner
    const qrScanner = new Html5QrcodeScanner('qr-reader', {
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
        setShowButtons(true); // Show the buttons
        setIsScannerVisible(false); // Hide the scanner
        qrScanner.pause(); // Pause the scanner after a successful scan
      } catch (error) {
        console.error('Error parsing QR code:', error);
        setScannedData({ error: 'Invalid Pix QR code' });
        setShowButtons(false); // Hide the buttons if there's an error
      }
    };

    const onScanError = (err) => {
      console.error('QR scan error:', err);
    };

    qrScanner.render(onScanSuccess, onScanError);
    setScanner(qrScanner); // Save the scanner instance to state

    // Cleanup function
    return () => {
      qrScanner.clear();
    };
  }, []);

  const handleConfirmAndSend = () => {
    console.log('Sending data:', scannedData);
    alert('Data sent successfully!');
    resetScanner(); // Reset the scanner after sending
  };

  const handleDiscard = () => {
    resetScanner(); // Reset the scanner
  };

  const resetScanner = () => {
    setScannedData(null); // Clear the scanned data
    setShowButtons(false); // Hide the buttons
    setIsScannerVisible(true); // Show the scanner
    if (scanner) {
      scanner.resume(); // Resume the scanner
    }
  };

  return (
    <div>
      {/* <h1>Pix Invoice QR Code Scanner</h1> */}

      {/* Scanner container */}
      <div id="qr-reader" style={{ display: isScannerVisible ? 'block' : 'none' }}></div>

      {/* Display parsed data in a user-friendly format */}
      {scannedData && (
        <div style={{ marginTop: '20px', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ backgroundColor: '#222', padding: '20px', borderRadius: '10px' }}>
            <p style={{ fontSize: '18px', margin: '10px 0' }}>
              <strong>Transaction Type:</strong> {scannedData.type}
            </p>
            <p style={{ fontSize: '36px', margin: '10px 0' }}>
              <strong>{scannedData.merchantName}</strong>
            </p>
            <p style={{ fontSize: '28px', margin: '10px 0' }}>
              <strong>{scannedData.merchantCity}</strong> 
            </p>
            <p style={{ fontSize: '28px', margin: '30px 0 10px 0' }}>
              <strong>Amount:</strong> R$ {scannedData.transactionAmount}
            </p>
          </div>
        </div>
      )}

      {/* Show buttons if data is parsed */}
      {showButtons && (
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleDiscard}
            style={{
              backgroundColor: 'red',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              marginRight: '10px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Discard
          </button>
          <button
            onClick={handleConfirmAndSend}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Confirm & Send
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;