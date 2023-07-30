import { Vector3 } from "three";
import "./App.css";
import { Cube } from "./components/cube";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./scene";

function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{ position: [0, 16, 42], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Scene />
      </Canvas>
    </div>
  );
}

export default App;
