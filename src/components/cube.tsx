import { useState, useRef } from "react";
import { MeshProps, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Property } from "csstype";
import { lighten } from "@mui/material";
import { ColorTranslator } from "colortranslator";
import { MeshDistortMaterial } from "@react-three/drei";

import { animated, useSpring } from "@react-spring/three";

type CubeProps = MeshProps & {
  color?: Property.Color;
  hoverColor?: Property.Color;
  cubeSize?: number;
  rotationSpeed?: Vector3;
};

const AnimatedMesh = animated(MeshDistortMaterial);

type CubeArgs = [
  width?: number | undefined,
  height?: number | undefined,
  depth?: number | undefined,
  widthSegments?: number | undefined,
  heightSegments?: number | undefined,
  depthSegments?: number | undefined
];

export const Cube = (props: CubeProps) => {
  const defaultRSpeed = 0.01;
  const {
    color = "blue",
    hoverColor = null,
    cubeSize = 2,
    rotationSpeed = new Vector3(defaultRSpeed, defaultRSpeed, defaultRSpeed),
    position,
  } = props;

  const meshRef = useRef<Mesh>(null);
  const cubeArgs: CubeArgs = [cubeSize, cubeSize, cubeSize];
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const springs = useSpring({ scale: active ? 1.2 : 1 });

  const colorAsHex = new ColorTranslator(color).HEX;
  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorAsHex, 0.3);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.x += rotationSpeed.x;
    if (meshRef.current) meshRef.current.rotation.y += rotationSpeed.y;
    if (meshRef.current) meshRef.current.rotation.z += rotationSpeed.z;
  });

  const handlePointerOver = () => {
    setHover(true);
  };

  const handlePointerOut = () => {
    setHover(false);
  };

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <animated.mesh
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={springs.scale}
      position={position}
    >
      <boxGeometry args={cubeArgs} />
      {/* @ts-expect-error not sure what this error is about */}
      <AnimatedMesh color={!hovered ? colorAsHex : hoverHex} />
    </animated.mesh>
  );
};
