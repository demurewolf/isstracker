

function StatTableRow({type, data}) {
    return (
      <tr>
        <td>{type}</td>
        <td>{data}</td>
      </tr>
    );
  }
  
export default function Stats({currentStats}) {
    const rows = [];
    
    // Filter some stats and make values human readable
    const STATS_FILTER_LIST = ["visibility", "solar_lat", "solar_lon", "units", "name", "id", "daynum", "footprint"];
    const STATS_PRECISION_LIST = ["latitude", "longitude", "velocity", "altitude"];
    if (currentStats) {
      let speedUnit = currentStats["units"] === "miles" ? " mph" : " kph";
      Object.keys(currentStats)
        .forEach((k) => {
          let statData = currentStats[k];
          if (STATS_PRECISION_LIST.includes(k)) {
            statData = currentStats[k].toFixed(3);
          }
          if (k === "altitude") {
            statData = statData + " " + currentStats["units"];
          }
          if (k === "velocity") {
            statData = statData + speedUnit;
          }
          if (k === "timestamp") {
            statData = Date(currentStats[k]).toString();
          }
          if (!STATS_FILTER_LIST.includes(k)) { 
            rows.push(<StatTableRow type={k} data={statData}/>);
          }
        }
      );
    }
    return (
      <div className='stats'>
        <table>
          <caption>Real Time ISS Statistics</caption>
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