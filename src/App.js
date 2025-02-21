import logo from './logo.svg';
import './App.css';
import QRScanner from './QRScanner';
import { parsePix } from 'pix-utils';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <h1>Pay Pix Anonymously with Bitcoin</h1>

        {/* 00020126330014BR.GOV.BCB.PIX01114158359180052040000530398654041.005802BR5922Octavio Henrique Lucca6009SAO PAULO62140510KCFJ5yBdEc630425F7 */}
        {/* 00020101021226850014br.gov.bcb.pix2563pix.santander.com.br/qr/v2/f7e0fb6d-2298-4bde-ba89-8e03361c6d14520458145303986540517.005802BR5922CAFE CULTURA PRIMAVERA6013FLORIANOPOLIS62070503***63046332 */}
        <QRScanner />

      </header>
    </div>
  );
}

export default App;
