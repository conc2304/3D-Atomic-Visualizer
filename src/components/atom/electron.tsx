import { useFrame } from "@react-three/fiber";
import { Property } from "csstype";
import { useRef } from "react";
import { Mesh } from "three";

type ElectronProps = {
  shellIndex: number;
  color?: Property.Color;
  orbitSpeed?: number;
  offset?: number;
};

export const Electron = (props: ElectronProps) => {
  const { shellIndex, color = "#00FFFF", orbitSpeed = 1, offset = 0 } = props;

  const ref = useRef<Mesh>(null);
  const radius = 2 + shellIndex * 2; // Each shell will be 2 units apart

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const elapsedTime = clock.getElapsedTime();
    const positionX = radius * Math.cos(elapsedTime * orbitSpeed + offset); // offset to prevent overlapping paths
    const positionZ = radius * Math.sin(elapsedTime * orbitSpeed + offset);

    ref.current.position.set(positionX, 0, positionZ);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};
