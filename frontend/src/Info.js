import { useEffect, useState } from "react";

function AstroRow({name}) {
  return (
    <tr>
      <td>{name}</td>
    </tr>
  );
}

export default function Info() {

  const [astrosList, setAstrosList] = useState(null);
  const [astrosNum, setAstrosNum] = useState(null);
  const INFO_API_URL = "https://api.open-notify.org/astros.json";

  useEffect(() => {
    let ignore = false;
    fetch(INFO_API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setAstrosNum(data["number"]);
          let newAstros = []
          data["people"].forEach((obj) => {
            newAstros.push(<AstroRow name={obj["name"]}/>);
          });
          setAstrosList(newAstros);
        }
      });
    
    return () => {
      ignore = true;
    }
  }, [INFO_API_URL]);

  return (
    <div className='info'>
      <table>
          <caption>Currently {astrosNum} ISS Astronauts</caption>
          <tbody>
            {astrosList}
          </tbody>
        </table>
    </div>
  )
}
  