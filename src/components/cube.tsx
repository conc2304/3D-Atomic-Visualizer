import { useState, useRef } from "react";
import { MeshProps, useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { Property } from "csstype";
import { lighten } from "@mui/material";
import { ColorTranslator } from "colortranslator";
import { MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";

type CubeProps = MeshProps & {
  color?: Property.Color;
  hoverColor?: Property.Color;
  cubeSize?: number;
  rotationSpeed?: Vector3;
  isActive?: boolean;
  onClick?: () => void;
};

const AnimatedMesh = animated(MeshWobbleMaterial);

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
    isActive = false,
    onClick,
    rotationSpeed = new Vector3(defaultRSpeed, defaultRSpeed, defaultRSpeed),
    position,
  } = props;

  const meshRef = useRef<Mesh>(null);
  const cubeArgs: CubeArgs = [cubeSize, cubeSize, cubeSize];
  const [hovered, setHover] = useState(false);
  const [rotationActive, setRotationActive] = useState(false);
  const colorHex = new ColorTranslator(color).HEX;
  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.5);
  const springs = useSpring({
    scale: isActive ? 1.2 : 0.5,
    color: hovered ? hoverHex : colorHex,
  });

  useFrame(() => {
    if (!meshRef.current) return;

    if (rotationActive) {
      meshRef.current.rotation.x += rotationSpeed.x;
      meshRef.current.rotation.y += rotationSpeed.y;
      meshRef.current.rotation.z += rotationSpeed.z;
    }
  });

  const handlePointerOver = () => {
    setHover(true);
  };

  const handlePointerOut = () => {
    setHover(false);
  };

  const handleClick = () => {
    onClick && onClick();
    // setIsActive(!active);
    if (isActive) {
      setRotationActive(!rotationActive);
    }
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
      {/* @ts-ignore */}
      <AnimatedMesh color={springs.color} />
    </animated.mesh>
  );
};
