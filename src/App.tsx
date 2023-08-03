import "./App.css";
import { Scene } from "./components/scene";

function App() {
  return (
    <div className="App">
      <div style={{ zIndex: -10, height: "100%" }}>
        <Scene />
      </div>
    </div>
  );
}

export default App;
