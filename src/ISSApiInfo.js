import { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';
import Stats from './Stats';
import 'leaflet/dist/leaflet.css';


function ISSMap({position}) {
    const map = useMap();
    //console.log("Map center: " + map.getCenter());
    map.setView(position);
    return null;
  }

  
function TrackingMap({lat, lon}) {
    let position = [lat, lon];
    return (
      <MapContainer center={position} zoom={3} scrollWhealZoom={false}>
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker 
            center={position} 
            radius={10}
        />
        <ISSMap position={[lat, lon]}/>
      </MapContainer>
    );
  }


export default function ISSApiInfo() {
    const intervalRef = useRef(null);
    const [apiUnits, setApiUnits] = useState("miles");
    const [issData, setISSData] = useState(null);
  
    // const ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544?units=" + apiUnits;
    const ISS_API_URL = "http://localhost:8000/now?units=" + apiUnits;
  
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
    }, [ISS_API_URL]);
  
    let lat = 0;
    let lon = 0;
    let issStats = null;
    if (issData) {
      lat = issData["latitude"];
      lon = issData["longitude"];
      issStats = issData;
    }

    function handleUnitChange() {
      apiUnits === "miles" ? setApiUnits("kilometers") : setApiUnits("miles");
    }

    return (
      <>
        <TrackingMap lat={lat} lon={lon}/>
        <Stats currentStats={issStats} onUnitChange={handleUnitChange} displayApiUnits={apiUnits}/>
      </>
      
    );
}
  