import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10, // Frames per second
      qrbox: 250, // Size of the QR code scanning box
    });

    scanner.render((data) => {
      console.log('Scanned:', data);
      alert(`Scanned: ${data}`);
    });

    // Clean up the scanner when the component unmounts
    return () => {
      scanner.clear();
    };
  }, []);

  return <div id="qr-reader" style={{ width: '100%' }}></div>;
};

export default QRScanner;