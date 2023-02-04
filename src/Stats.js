

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
    if (currentStats) {
        Object.keys(currentStats).forEach(k => 
            rows.push(<StatTableRow type={k} data={currentStats[k]}/>)
        );
    }
    return (
      <div className='stats'>
        <table>
          <caption>ISS Statistics</caption>
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