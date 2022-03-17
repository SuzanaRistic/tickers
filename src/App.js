import { useEffect, useState } from 'react'
import './App.css';
import JSONDATA from './data/tickers.json'
import Plot from 'react-plotly.js'
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [ticker, setTicker] = useState(JSONDATA.tickers);
  const [symbolSign, setSymbolSign] = useState("A");
  const [selectedDateStart, setSelectedDateStart] = useState("20/03/2018");
  const [selectedDateEnd, setSelectedDateEnd] = useState("27/03/2018");
  const [chartDates, setChartDates] = useState([])
  const [chartValues, setChartValues] = useState([])
  const [showGraph, setShowGraph] = useState(false)
  const [showList, setShowList] = useState(false)
  const chartDatesArray = [];
  const chartValuesArray = [];

  useEffect (() => {
    fetchStock()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolSign])

  const tickerSearch = (list, key) => {
    const searchWord = key.toLowerCase()
      return list && list.filter(value => {
        return value.symbol.toLowerCase().match(searchWord) ||
          value.securityName.toLowerCase().match(searchWord)
      })
    } 

  const handleOnChange = async (e) => {
    let value = e.target.value;
    if (value.length >= 1) {
      let search = await tickerSearch(ticker, value);
      setTicker(search)
      showTickers()
    } else {
      setTicker(JSONDATA.tickers)
      setShowList(false)
      //WHOLE GRAPH DISAPPEARS
      // setShowGraph(false)

      //ONLY GRAPH VALUES REMOVED
      setChartDates("")
      setChartValues("")
      setSymbolSign("")
      }
    }

  const fetchStock = () => {
    const API_KEY = "Sita4NS9zWNb1jAsf4Mn";
    const API_call = `https://data.nasdaq.com/api/v3/datasets/WIKI/${symbolSign}.json?start_date=${selectedDateStart}&end_date=${selectedDateEnd}&collapse=daily&rows=30&order=desc&column_index=1&api_key=${API_KEY}`;
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
    const inputEndDate = moment('27/03/2018', "DD/MM/YYYY");
    const inputChosenDate = moment(selectedDateEnd, "DD/MM/YYYY")
    const dDiff = inputChosenDate.diff(inputEndDate)
    if (dDiff > 0) {
      alert("No data for dates after 27/03/2018")
    }
  }

  const showChart = () => {
    showGraph ? setShowGraph(true) : setShowGraph(true);
    };

  const showTickers = () => {
    showList ? setShowList(true) : setShowList(true);
    };

  const handleDate = (start, end) => {
    const startDateValue = moment(start._d).format('DD/MM/YYYY');
    const endDateValue = moment(end._d).format('DD/MM/YYYY');
    setSelectedDateStart(`${startDateValue}-`);
    setSelectedDateEnd(`${endDateValue}`);
    };

  const handleSymbol = (e) => {
    setSymbolSign(e.target.value)
    fetchStock()
    showChart()
    handleDate()
    };

  return (
  <div className="wrapper">
    <div className="list-div">
      <div className="header-div"><h1 className="main-header">STOCK SEARCH</h1></div>
        <input className="input-field" type="text" placeholder=" Search stock symbol" onChange={handleOnChange}/>
        {ticker && showList ? (ticker.map(item => (
          <div className="list-box" key={Math.random()}>
            <button className="button-symbol" value={item.symbol} onClick={handleSymbol}>{item.symbol}</button>
            <p className="p-name"> {item.securityName}</p><br/>
          </div>
        ))) : null }
    </div>
    {showGraph ? (<div className="graph-div">
      <div className="date-range-div">
        <DateRangePicker
          onCallback={handleDate}
          initialSettings={{
          startDate: selectedDateStart,
          endDate: selectedDateEnd,
          locale: {format: 'DD/MM/YYYY'},
          }}
          onApply={fetchStock}
        >
          <input
            type="text"
            className="date-form-box"
          />
        </DateRangePicker>
        <div className='tc-calendar-icon'>
          <FontAwesomeIcon
            className='icon-calendar'
            icon={faCalendar}
            color= 'rgb(70, 131, 222)'
          />
        </div>
      </div>
      <Plot data={[{
        x: chartDates,
        y: chartValues,
        type: 'scatter',
        mode: 'lines+markers',
        marker: {color: 'blue'},
        }]}
        layout={{width: 720, height: 440, title: ("Stock Market: " + symbolSign)}}
      />
    </div>
    ) : null}
  </div>
  );
}

export default App;