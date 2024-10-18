import { useState, useEffect } from 'react';
import './App.css';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';

function App() {
  const [currencyValue, setCurrencyValue] = useState(0);
  const [convertedValue, setConvertedValue] = useState(0);
  const [currencies, setCurrencies] = useState([]);
  const [currencySymbols, setCurrencySymbols] = useState({});
  const [sourceCurrency, setSourceCurrency] = useState('USD');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [isConverting, setIsConverting] = useState(false); // State to track conversion status

  // Fetch available currencies and symbols on component mount
  useEffect(() => {
    let freecurrencyapi = new Freecurrencyapi('fca_live_AFk41IKNCPpAhAgZut1hFj75hCQLqJmiRHAVAoEF');

    freecurrencyapi.currencies().then(response => {
      const currencyData = response.data;
      setCurrencies(Object.keys(currencyData));
      
      // Store currency symbols in state
      const symbols = {};
      for (const code in currencyData) {
        symbols[code] = currencyData[code].symbol_native || currencyData[code].symbol || '';
      }
      setCurrencySymbols(symbols);
    });
  }, []); // No need to include freecurrencyapi in the dependency array now

  const convertCurrency = () => {
    if (sourceCurrency && targetCurrency && currencyValue) {
      setIsConverting(true); // Start the conversion process
      let freecurrencyapi = new Freecurrencyapi('fca_live_AFk41IKNCPpAhAgZut1hFj75hCQLqJmiRHAVAoEF');
      freecurrencyapi.latest({
        base_currency: sourceCurrency,
        currencies: targetCurrency
      }).then(response => {
        const rate = response.data[targetCurrency];
        setConvertedValue(currencyValue * rate);
        setIsConverting(false); // Conversion is done
      }).catch(() => {
        setIsConverting(false); // In case of error, stop the loading state
      });
    }
  };

  return (
    <div className='App'>
      <h1>Currency Converter</h1>
      <div className='converter'>
        <div className='currency-section'>
          <div className='currency-input'>
            <label>From</label>
            <select value={sourceCurrency} onChange={e => setSourceCurrency(e.target.value)}>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <div className='currency_input_group'>
              <span>
                {currencySymbols[sourceCurrency] || ''}
              </span>
              <input
                type="number"
                value={currencyValue}
                onChange={e => setCurrencyValue(Number(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className='currency-input'>
            <label>To</label>
            <select value={targetCurrency} onChange={e => setTargetCurrency(e.target.value)}>
              {currencies.map(currency => (
                <option key={currency} value={currency}>{currency}</option>
              ))}
            </select>
            <div className='converted-output'>
              <span>
                {currencySymbols[targetCurrency] || ''} {convertedValue.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        <button onClick={convertCurrency} disabled={isConverting}>
          {isConverting ? 'Converting...' : 'Convert'}
        </button>
      </div>
    </div>
  );
}

export default App;
