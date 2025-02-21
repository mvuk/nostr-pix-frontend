import React from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Import QRCodeSVG

const LightningInvoice = () => {
  const lightningInvoice =
    'lnbc10u1pnm3e6msp59fatyw2jekd6rvdq3vcx7n8q6rv2y5gekm3cmcmlqsqsjwu204cqpp50nzr88qy797c6gzakwj77k4ngum825msa8q48ane70965760kp4shp5uwcvgs5clswpfxhm7nyfjmaeysn6us0yvjdexn9yjkv3k7zjhp2sxq9z0rgqcqpnrzjqvjt5gujufdl7a4t6zcl0e948d0c92jnlhwrgxds2xmvsqwmnc3ywrf67vqqnvsqqqqqqqqqqqqqraqq2q9qxpqysgq00xxu0tkre6zslrjm9w6l38m6855004czernw64fv57gxq57xg2h3nvg4eqv0fzk85pvmcrxa5np8hnrv05p3ahpzw30q69rnhrur5sqx7ktfs';

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
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h4>Sample Lightning Invoice (pay with webln)</h4>
      <div
        style={{ margin: '20px 0', cursor: 'pointer' }}
        onClick={handlePayInvoice} // Trigger payment on QR code click
      >
        <QRCodeSVG value={lightningInvoice} size={256} level="H" includeMargin={true} />
      </div>
      <p style={{ margin: '20px 0', fontSize: '14px', color: '#666' }}>
        Click the QR code to pay the invoice.
      </p>
    </div>
  );
};

export default LightningInvoice;