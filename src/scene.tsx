import { darken } from "@mui/material";
import { ContactShadows, OrbitControls } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import { ColorTranslator } from "colortranslator";
import { Property } from "csstype";
import { Depth, LayerMaterial, Noise } from "lamina";
import { useRef } from "react";
import * as THREE from "three";
import { ObjectCarousel } from "./components/carousel";
import { Cube } from "./components/cube";

type BackgroudProps = {
  colorA?: Property.Color;
  colorB?: Property.Color;
  bkgSpeed?: number;
  bkgNoise?: number;
};
const Background = (props: BackgroudProps) => {
  const {
    colorA = "#21d989",
    colorB = "#348ab3",
    bkgSpeed = 0.1,
    bkgNoise = 0.4,
  } = props;
  const meshRef = useRef<THREE.Mesh>(null);

  const colorAHex = new ColorTranslator(colorA).HEX;
  const colorBHex = new ColorTranslator(colorB).HEX;

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        meshRef.current.rotation.y =
        meshRef.current.rotation.z +=
          delta * bkgSpeed;
    }
  });

  return (
    <mesh scale={100} ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <LayerMaterial side={THREE.BackSide}>
        <Depth
          colorA={colorAHex}
          colorB={colorBHex}
          alpha={1}
          mode="normal"
          near={130}
          far={200}
          origin={[100, 100, -100]}
        />
        <Noise
          mapping="local"
          type="white"
          scale={200}
          colorA={darken(colorBHex, 0.1)}
          colorB={darken(colorAHex, 0.1)}
          mode="subtract"
          alpha={bkgNoise}
        />
      </LayerMaterial>
    </mesh>
  );
};

export const Scene = () => {
  const objects = [
    <Cube color="red" />,
    <Cube color="green" />,
    <Cube color="blue" />,
    <Cube color="yellow" />,
  ];
  return (
    <>
      {/* <OrbitControls /> */}

      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 20, 20]} intensity={1} />

      <ObjectCarousel objects={objects} />

      <ContactShadows scale={30} opacity={0.32} />
      <Background />
    </>
  );
};
