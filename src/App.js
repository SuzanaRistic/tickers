import { useEffect, useState } from 'react'
import './App.css';
import JSONDATA from './data/tickers.json'
import Plot from 'react-plotly.js'

function App() {
  const [ticker, setTicker] = useState(JSONDATA.tickers)
  const [symbolSign, setSymbolSign] = useState("A")
  const [chartDates, setChartDates] = useState([])
  const [chartValues, setChartValues] = useState([])
  const [show, setShow] = useState(false)
  const chartDatesArray = [];
  const chartValuesArray = [];

  useEffect (() => {
    fetchStock()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolSign])

  const tickerSearch = (list, key) => {
    const searchTerm = key.toLowerCase()
      return list.filter(value => {
        return value.symbol.toLowerCase().match(searchTerm) ||
          value.securityName.toLowerCase().match(searchTerm)
      })
    } 

  const handleOnChange = async (e) => {
    let value = e.target.value;
    if (value.length >= 1) {
      let search = await tickerSearch(ticker, value);
      setTicker(search)
    } else {
      setTicker(JSONDATA.tickers)
      }
    }

  const fetchStock = () => {
    const API_KEY = "Sita4NS9zWNb1jAsf4Mn";
    const StockCode = symbolSign
    const API_call = `https://data.nasdaq.com/api/v3/datasets/WIKI/${StockCode}.json?collapse=annually&rows=30&order=asc&column_index=1&api_key=${API_KEY}`;
    fetch(API_call)
    .then(response => response.json())
    .then(data => {
           const stockInfo = (data["dataset"]["data"])
            stockInfo.forEach((key) => {
            chartDatesArray.push(key[0]);
            chartValuesArray.push(key[1]);  
            })
            setChartDates(chartDatesArray)
            setChartValues(chartValuesArray)
    })
  }

  const showGraph = () => {
    show ? setShow(true) : setShow(true);
    };

  const handleSymbol = (e) => {
    setSymbolSign(e.target.value)
    fetchStock()
    showGraph()
  }

  return (
  <div className="wrapper">
    <div className="list-div">
      <input className="input-symbol" type="text" placeholder="Search stock symbol" onChange={handleOnChange}/>
        {ticker.map(item => (
          <div className="list-box" key={Math.random()}>
            <button className="button-symbol" value={item.symbol} onClick={handleSymbol}>{item.symbol}</button>
            <p className="p-name"> {item.securityName}</p><br/>
          </div>
        ))}
    </div>
    {show ? (<div className="graph-div">
      <Plot data={[{
        x: chartDates,
        y: chartValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color: 'blue'},
        }]}
        layout={{width: 720, height: 440, title: ("Stock Market: " + symbolSign)}}/>
        </div>
        ) : null}
  </div>
  );
}

export default App;