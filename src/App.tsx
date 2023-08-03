import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/scene";
import { Box, Typography } from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";

function App() {
  return (
    <div className="App">
      <div style={{ zIndex: -10, height: "100%" }}>
        <Canvas shadows camera={{ position: [0, 16, 42], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Scene />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
