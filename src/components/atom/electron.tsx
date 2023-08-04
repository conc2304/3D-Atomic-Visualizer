import { useFrame } from "@react-three/fiber";
import { Property } from "csstype";
import { useRef } from "react";
import { Mesh } from "three";

type ElectronProps = {
  shellIndex: number;
  color?: Property.Color;
  orbitSpeed?: number;
  offset?: number;
  orbitRadius?: number;
  size?: number;
};

export const Electron = (props: ElectronProps) => {
  const {
    shellIndex,
    color = "#00FFFF",
    orbitSpeed = 1,
    offset = 0,
    orbitRadius = 1,
    size = 0.5,
  } = props;

  const ref = useRef<Mesh>(null);
  const shellRadius = orbitRadius * (2 + shellIndex * 2); // each shell will be 2 units apart

  useFrame(({ clock }) => {
    if (!ref.current) return;
    // each frame move/orbit the electron round the center
    const elapsedTime = clock.getElapsedTime();
    const positionX = shellRadius * Math.cos(elapsedTime * orbitSpeed + offset); // offset to prevent overlapping paths
    const positionZ = shellRadius * Math.sin(elapsedTime * orbitSpeed + offset);

    ref.current.position.set(positionX, 0, positionZ);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
