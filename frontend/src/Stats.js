
function StatTableRow({type, data}) {
    return (
      <tr>
        <td className="stat-label">{type}</td>
        <td>{data}</td>
      </tr>
    );
  }
  
export default function Stats({currentStats, onUnitChange, displayApiUnits}) {
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
            statData = currentStats[k].toLocaleString("en-us");
          }
          if (k === "altitude") {
            statData = statData + " " + currentStats["units"];
          }
          if (k === "velocity") {
            statData = statData + speedUnit;
          }
          if (k === "timestamp") {
            const tmpDate = new Date(currentStats[k] * 1000);
            statData = tmpDate.toLocaleTimeString();
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
          <tbody>
            {rows}
          </tbody>
        </table>
        <button onClick={onUnitChange}>Units: {displayApiUnits}</button>
      </div>
    );
}