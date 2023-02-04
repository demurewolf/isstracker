import { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';


function TrackingMap({lat, lon}) {
  let position = [lat, lon];
  return (
    <MapContainer center={position} zoom={2} scrollWhealZoom={false}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={position} radius={10}/>
    </MapContainer>
  );
}

function StatTableRow({type, data}) {
  return (
    <tr>
      <td>{type}</td>
      <td>{data}</td>
    </tr>
  );
}

function Stats({currentStats}) {
  const rows = [];
  if (currentStats) {
    Object.keys(currentStats).forEach(k => rows.push(<StatTableRow type={k} data={currentStats[k]}/>));
  }
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
  );
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
  const intervalRef = useRef(null);
  const [issData, setISSData] = useState(null);


  const ISS_API_URL = "http://api.open-notify.org/iss-now";

  useEffect(() => {
    let ignore = false;
    intervalRef.current = setInterval(() => {
      fetch(ISS_API_URL)
        .then((response) => response.json())
        .then((data) => {
          if (!ignore) {
            setISSData(data);
          }
        });
    }, 10000);
    return () => {
      ignore = true;
      clearInterval(intervalRef.current);
    }
  }, []);

  let lat = 0;
  let lon = 0;
  let issStats = null;
  if (issData) {
    lat = issData["iss_position"]["latitude"];
    lon = issData["iss_position"]["longitude"];
    issStats = issData["iss_position"];
  }
  return (
    <>
      <TrackingMap lat={lat} lon={lon}/>
      <Stats currentStats={issStats}/>
    </>
    
  );
}

export default function App() {
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
