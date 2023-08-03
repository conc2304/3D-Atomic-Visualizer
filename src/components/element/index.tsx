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
} from "three";
import { animated, config, useSpring } from "@react-spring/three";

import { Box, RoundedBox } from "@react-three/drei";
import { Text } from "../text";
import { useEffect, useRef, useState } from "react";
import { ElectronConfiguration } from "../atom/types";
import { ColorTranslator } from "colortranslator";
import { lighten } from "@mui/material";

type ElementTagProps = MeshProps & {
  name: string;
  symbol: string;
  atomicNumber: string | number;
  electronConfig: ElectronConfiguration;
  size?: Vector3;
  color?: Property.Color;
  isActive: boolean;
  hoverColor?: Property.Color;
  onClick?: () => void;
};
export const ElementTag = (props: ElementTagProps) => {
  const {
    name,
    symbol,
    atomicNumber,
    electronConfig,
    hoverColor,
    color = "white",
    position = [0, 0, 0],
    isActive = false,
  } = props;

  const [hovered, setHover] = useState(false);

  const colorHex = new ColorTranslator(color).HEX;

  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  const springs = useSpring({
    scale: isActive ? 1 : 0.5,
    color: hovered ? hoverHex : colorHex,
    warpFactor: !isActive ? 1 : 0,
    wardSpeed: !isActive ? 1 : 0,
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

  return (
    <animated.group position={position} scale={springs.scale}>
      <RoundedBox args={[10, 8, 0.5]} radius={0.2} smoothness={4}>
        <meshStandardMaterial color="orange" />
      </RoundedBox>
      <group position={[-2.7, 0, 1.1]}>
        <Text
          text={symbol}
          color={color}
          size={1.5}
          height={1}
          position={[symbol.length === 2 ? 0.5 : 1.6, 1.5, 1]}
        />
        <Text
          text={atomicNumber.toString()}
          color={color}
          size={0.5}
          height={0.5}
          position={[-1.5, 3.5, 1]}
        />
        <Text
          text={name}
          size={0.5}
          height={0.1}
          position={[getXPosition(name), -0.5, 1]}
        />
      </group>
    </animated.group>
  );
};
