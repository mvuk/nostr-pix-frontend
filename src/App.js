import logo from './logo.svg';
import './App.css';
import QRScanner from './QRScanner';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Pay Pix Anonymously with Bitcoin</h1>
        <QRScanner />
      </header>
    </div>
  );
}

export default App;
