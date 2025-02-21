import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { parsePix } from 'pix-utils';
import PaymentScreen from './PaymentScreen'; // Import the new component

const QRScanner = () => {
  const [scannedData, setScannedData] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [isScannerVisible, setIsScannerVisible] = useState(true);
  const [showPaymentScreen, setShowPaymentScreen] = useState(false); // State to control PaymentScreen visibility

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: 250,
    });

    const onScanSuccess = (data) => {
      try {
        const parsedData = parsePix(data);

        if (parsedData.transactionAmount === undefined) {
          const transactionAmountMatch = data.match(/54(\d{2})(\d+\.\d{2})/);
          if (transactionAmountMatch) {
            parsedData.transactionAmount = parseFloat(transactionAmountMatch[2]);
          }
        }

        setScannedData({ ...parsedData, rawData: data }); // Include raw QR code data
        setShowButtons(true);
        setIsScannerVisible(false);
        qrScanner.pause();
      } catch (error) {
        console.error('Error parsing QR code:', error);
        setScannedData({ error: 'Invalid Pix QR code' });
        setShowButtons(false);
      }
    };

    const onScanError = (err) => {
      console.error('QR scan error:', err);
    };

    qrScanner.render(onScanSuccess, onScanError);
    setScanner(qrScanner);

    return () => {
      qrScanner.clear();
    };
  }, []);

  const handleConfirmAndSend = () => {
    setShowPaymentScreen(true); // Show the PaymentScreen component
  };

  const handleDiscard = () => {
    resetScanner();
  };

  const resetScanner = () => {
    setScannedData(null);
    setShowButtons(false);
    setIsScannerVisible(true);
    if (scanner) {
      scanner.resume();
    }
  };

  return (
    <div>
      {/* Show QRScanner or PaymentScreen based on state */}
      {!showPaymentScreen ? (
        <>
          {/* Scanner container */}
          <div id="qr-reader" style={{ display: isScannerVisible ? 'block' : 'none' }}></div>

          {/* Display parsed data */}
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
        </>
      ) : (
        <PaymentScreen qrData={scannedData.rawData} onCancel={() => setShowPaymentScreen(false)} />
      )}
    </div>
  );
};

export default QRScanner;