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
  const [astrosNum, setAstrosNum] = useState(0);
  const INFO_API_URL = "http://api.open-notify.org/astros.json";

  useEffect(() => {
    let ignore = false;
    fetch(INFO_API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (!ignore) {
          setAstrosNum(data["number"]);
          let newAstros = [];
          let issAstroCount = 0;
          data["people"].forEach((astro) => {
            if (astro["craft"] === "ISS") {
              newAstros.push(<AstroRow name={astro["name"]}/>);
              issAstroCount ++;
            }
          });
          setAstrosList(newAstros);
          setAstrosNum(issAstroCount);
        }
      });
    
    return () => {
      ignore = true;
    }
  }, [INFO_API_URL]);
  let tableTitle = `Currently ${astrosNum} ISS Astronaut`;
  if (astrosNum !== 1) tableTitle += "s";
  return (
    <div className='info'>
      <table>
          <caption>{tableTitle}</caption>
          <tbody>
            {astrosList}
          </tbody>
        </table>
    </div>
  )
}
  