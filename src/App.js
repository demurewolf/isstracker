import './App.css';


function TrackingMap() {
  return (
    <div className='tracking-map'>
      <p>
        I am a map that will show you the ISS.
      </p>
    </div>
  )
}

function Stats() {
  return (
    <div className='stats'>
      <p>
        I will be a table of information
      </p>
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

function App() {
  return (
    <div className="App">
      <header className="App-header">
        ISS Tracking Map
      </header>
      <div className='iss-information'>
        <TrackingMap />
        <Stats />
        <Info />
      </div>
    </div>
  );
}

export default App;
