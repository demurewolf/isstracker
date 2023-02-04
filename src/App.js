import ISSApiInfo from "./ISSApiInfo";
import Info from "./Info";
import './App.css';

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
