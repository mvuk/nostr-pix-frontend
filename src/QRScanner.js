import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parsePix } from 'pix-utils';

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null); // State to store parsed data
  const [showButtons, setShowButtons] = useState(false); // State to control button visibility
  const [scanner, setScanner] = useState(null); // State to hold the scanner instance

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
    if (scanner) {
      scanner.resume(); // Resume the scanner
    }
  };

  return (
    <div>
      <div id="qr-reader" style={{ width: '100%' }}></div>

      {/* Display parsed data */}
      <div>
        <h2>Scanned Data:</h2>
        <pre>{scannedData ? JSON.stringify(scannedData, null, 2) : 'Scan a QR code to display the data.'}</pre>
      </div>

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