import { Vector3 } from "three";
import "./App.css";
import { Cube } from "./components/cube";
import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <div className="App">
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube color="orange" position={new Vector3(-1.2, 0, 0)} />
        <Cube color="orange" position={new Vector3(1.3, 0, 0)} />
      </Canvas>
    </div>
  );
}

export default App;
