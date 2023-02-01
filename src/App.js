import './App.css';


function TrackingMap({lat, lon}) {
  return (
    <div className='tracking-map'>
      <p>
        I am a map that will show you the ISS. I think it's at ({lat}, {lon})!
      </p>
    </div>
  )
}

function StatTableRow({type, data}) {
  return (
    <tr>
      <td>{type}</td>
      <td>{data}</td>
    </tr>
  )
}

function Stats({currentStats}) {
  const rows = []
  // For each key-value in currentStats, add a StatTableRow to rows
  // Pass each key-value pair to a StatTableRow
  Object.keys(currentStats).forEach(k => rows.push(<StatTableRow type={k} data={currentStats[k]}/>))
  return (
    <div className='stats'>
      <p>
        I will be a table of real time info.
      </p>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  )
}

function Info() {
  return (
    <div className='info'>
      <p>
        I will be a list of fun facts about the ISS.
      </p>
    </div>
  )
}

function ISSApiInfo() {
  return (
    <>
      <TrackingMap lat={0} lon={0}/>
      <Stats currentStats={{
        "speed": "0 m/s", 
        "latitude": "0", 
        "longitude": "0",
        }}/>
    </>
    
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        ISS Tracking Map
      </header>
      <div className='iss-information'>
        <ISSApiInfo />
        <Info />
      </div>
    </div>
  );
}

export default App;
