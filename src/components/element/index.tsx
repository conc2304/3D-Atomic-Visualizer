import { MeshProps } from "@react-three/fiber";
import { Property } from "csstype";
import {
  BoxGeometry,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial,
  Vector3,
  PlaneGeometry,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { animated, config, ElementType, useSpring } from "@react-spring/three";

import { Box, MeshWobbleMaterial, RoundedBox } from "@react-three/drei";
import { Text } from "../text";
import { useEffect, useRef, useState } from "react";
import { ElectronConfiguration } from "../atom/types";
import { ColorTranslator } from "colortranslator";
import { lighten } from "@mui/material";
import { hover } from "@testing-library/user-event/dist/hover";

type ElementBackDropProps = {
  isHovered: boolean;
  hoverColor: Property.Color;
  color: Property.Color;
};

const ElementBackDrop = (props: ElementBackDropProps) => {
  const { isHovered, hoverColor, color } = props;
  // Reference to the mesh for user interactions or other purposes.
  const meshRef = useRef<Mesh>(null);

  // Define the spring animation for the material's color.
  const springs = useSpring({
    color: isHovered ? hoverColor : color,
    config: config.slow,
  });

  return (
    <RoundedBox ref={meshRef} args={[10, 8, 0.5]} radius={0.2} smoothness={4}>
      {/* @ts-expect-error */}
      <animated.meshStandardMaterial color={springs.color} />
    </RoundedBox>
  );
};

type ElementTagProps = MeshProps & {
  name: string;
  symbol: string;
  atomicNumber: string | number;
  electronConfig: ElectronConfiguration;
  size?: Vector3;
  color?: Property.Color;
  isActive: boolean;
  hoverColor?: Property.Color;
  tagBackground?: Property.Color;
  textColor?: Property.Color;
  onClick?: () => void;
  rotationY?: number;
};

export const ElementTag = (props: ElementTagProps) => {
  const {
    name,
    symbol,
    atomicNumber,
    electronConfig,
    hoverColor,
    tagBackground = "orange",
    textColor = "white",
    // color = "white",
    position = [0, 0, 0],
    isActive = false,
    onClick,
    rotation = [0, 0, 0],
    rotationY = 0,
  } = props;

  const [hovered, setHover] = useState(false);

  const colorHex = new ColorTranslator(tagBackground).HEX;

  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  const springs = useSpring({
    scale: isActive ? 1 : 0.5,
    rotationY: rotationY,
    config: config.slow,
  });

  const getXPosition = (str: string) => {
    const len = str.length;
    // Couldnt figure out how to center align items in three.js
    // ... So we are "faking" the centering of text by haivng manually mapped how much a shift
    // we need to "center" our text by testing "neon" and "Rutherfordium" against each other
    // then taking their two values and writing a linear equation
    // that maps the lenghth of a text to how much to shift along the x plan
    //
    return -0.3625 * len + 2.79;
  };

  const handlePointerOver = () => {
    setHover(true);
  };

  const handlePointerOut = () => {
    setHover(false);
  };

  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <animated.group
      position={position}
      rotation={[0, 0, 0]}
      rotation-y={springs.rotationY}
      scale={springs.scale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      <ElementBackDrop
        color={colorHex}
        hoverColor={hoverHex}
        isHovered={hovered}
      />
      <group position={[-2.7, 0, 1.1]}>
        <Text
          text={symbol}
          color={textColor}
          size={1.5}
          height={1}
          position={[symbol.length === 2 ? 0.5 : 1.6, 1.5, 0]}
        />
        <Text
          text={atomicNumber.toString()}
          color={textColor}
          size={0.5}
          height={0.5}
          position={[-1.5, 3.5, 0]}
        />
        <Text
          text={name}
          size={0.5}
          height={0.1}
          position={[getXPosition(name), -0.5, 0]}
        />
      </group>
    </animated.group>
  );
};
