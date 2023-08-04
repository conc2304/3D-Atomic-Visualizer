import { MeshProps } from "@react-three/fiber";
import { Property } from "csstype";
import { Vector3, Mesh } from "three";
import { animated, config, useSpring } from "@react-spring/three";
import { RoundedBox } from "@react-three/drei";
import { Text } from "../ui/text";
import { useEffect, useRef, useState } from "react";
import { ElectronConfiguration } from "../../types";
import { ColorTranslator } from "colortranslator";
import { lighten } from "@mui/material";
import { Atom } from "../atom";
import { degToRad } from "three/src/math/MathUtils";

type ElementBackDropProps = {
  isHovered: boolean;
  hoverColor: Property.Color;
  color: Property.Color;
};

const ElementBackDrop = (props: ElementBackDropProps) => {
  const { isHovered, hoverColor, color } = props;

  const meshRef = useRef<Mesh>(null);

  // Define the spring animation for the material's color.
  const springs = useSpring({
    color: isHovered ? hoverColor : color,
    config: config.slow,
  });

  return (
    <RoundedBox ref={meshRef} args={[10, 8, 0.5]} radius={0.2} smoothness={4}>
      {/* @ts-ignore */}
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
  onElementSelect?: (elemId: number) => void;
  onVisualizerActiveChange?: (isActive: boolean) => void;
  onInfoClick?: () => void;
  hide?: false;
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
    position = [0, 0, 0],
    isActive = false,
    onElementSelect,
    onInfoClick,
    onVisualizerActiveChange,
    rotationY = 0,
    hide = false,
  } = props;

  const [hovered, setHover] = useState(false);
  const [visualizerActive, setVisualizerActive] = useState(false);
  const [infoIconHovered, setInfoIconHovered] = useState(false);
  const [visualizerHovered, setVisualizerHover] = useState(false);
  const colorHex = new ColorTranslator(tagBackground).HEX;

  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  const springs = useSpring({
    scale: visualizerActive || hide ? 0 : isActive ? 1 : 0.5,
    infoIconScale: infoIconHovered ? 1.4 : 1,
    rotationY: rotationY,
    visualizerAngle: degToRad(90),
    visualizerScale: visualizerHovered ? 1.5 : 1,
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
    setCursorActive(true);
    setHover(true);
  };

  const handlePointerOut = () => {
    setCursorActive(false);
    setHover(false);
  };

  const handleClick = () => {
    if (!visualizerActive) {
      onElementSelect && onElementSelect(Number(atomicNumber));
    }

    if (isActive) {
      setVisualizerActive(true);
      onVisualizerActiveChange && onVisualizerActiveChange(true);
    }
  };

  const setCursorActive = (isActive: boolean) => {
    const cursor = isActive ? "pointer" : "default";
    document.body.style.cursor = cursor;
  };

  useEffect(() => {
    if (!isActive) {
      setVisualizerActive(false);
      onVisualizerActiveChange && onVisualizerActiveChange(false);
    }
  }, [isActive, onVisualizerActiveChange]);

  const symbolPosMap = {
    1: 1.6,
    2: 0.5,
    3: -0.5,
  };

  return (
    <>
      <animated.group
        position={position}
        rotation-y={springs.rotationY}
        rotation-x={isActive ? degToRad(-15) : 0}
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
            text={atomicNumber.toString()}
            color={textColor}
            size={0.5}
            height={0.15}
            position={[-1.5, 3, -0.7]}
          />
          <animated.group
            scale={springs.infoIconScale}
            onPointerEnter={(e) => {
              e.stopPropagation();
              setCursorActive(true);
              setInfoIconHovered(true);
            }}
            onPointerLeave={(e) => {
              e.stopPropagation();
              setCursorActive(false);
              setInfoIconHovered(false);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onInfoClick && onInfoClick();
            }}
            position={[6, 2.5, -0.5]}
          >
            <mesh
              rotation={[0, degToRad(90), degToRad(90)]}
              position={[0.5, 0.35, 0]}
            >
              <cylinderGeometry args={[0.7, 0.7, 0.1]} />
              <meshBasicMaterial color={infoIconHovered ? "blue" : "black"} />
            </mesh>
            <Text text="?" color={textColor} size={0.7} height={0.15} />
          </animated.group>

          {/* shift this text down for hard coded recentering - centering kinda moves when we rescale  */}
          <group position={[0, -1, 0]}>
            <Text
              text={symbol}
              color={textColor}
              size={1.5}
              height={1}
              position={[
                symbolPosMap[symbol.length as 1 | 2 | 3] || 0.5,
                1.5,
                -1,
              ]}
            />
            <Text
              text={name}
              size={0.5}
              height={0.1}
              position={[getXPosition(name), -0.5, -0.5]}
            />
          </group>
          {/* Atom Visualizer "Icon Button" */}
          <animated.group
            rotation={[0, 0, 0]}
            scale={springs.visualizerScale}
            position={[2.5, -4, 6]}
          >
            {isActive && (
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  setVisualizerActive(true);
                  onVisualizerActiveChange && onVisualizerActiveChange(true);
                }}
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  setCursorActive(true);
                  setVisualizerHover(true);
                }}
                onPointerLeave={() => {
                  setCursorActive(false);
                  setVisualizerHover(false);
                }}
              >
                <Atom
                  electronConfig={{ 1: { s: 2 } }}
                  electronColor="lightblue"
                  atomColor="red"
                  orbitRadius={0.2}
                  electronSize={0.2}
                />
              </mesh>
            )}
          </animated.group>
        </group>
      </animated.group>
      {/* this means only render what is next if visualizerActive is truthy */}
      {visualizerActive && (
        <animated.mesh
          scale={springs.visualizerScale}
          onClick={(e) => {
            e.stopPropagation();
            setVisualizerActive(false);
            onVisualizerActiveChange && onVisualizerActiveChange(false);
          }}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setVisualizerHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerLeave={() => {
            setVisualizerHover(false);
            document.body.style.cursor = "default";
          }}
        >
          <Atom electronConfig={electronConfig} size={Number(atomicNumber)} />
        </animated.mesh>
      )}
    </>
  );
};
