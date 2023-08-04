import { MeshProps } from "@react-three/fiber";
import { Property } from "csstype";
import { Vector3 } from "three";
import { animated, config, useSpring } from "@react-spring/three";
import { Text } from "../ui/text";
import { useEffect, useState } from "react";
import { ElectronConfiguration } from "../../types";
import { ColorTranslator } from "colortranslator";
import { lighten } from "@mui/material";
import { Atom } from "../atom";
import { degToRad } from "three/src/math/MathUtils";
import { BackDrop } from "./backdrop";

// Type definition where we merge mesh props
// (which includes things like rotation and position)
// with our own props
type ElementTileProps = MeshProps & {
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

// Throughout this component we update local state AND
// call an onXchange handler to update parent state so that this component can be used as a stand alone
// and as a controlled component (controlled by parent)
// represented as onInfoClick && onInfoClick() -> (if we have been passed an info click function then call it)

// the Element Tile component
export const ElementTile = (props: ElementTileProps) => {
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

  // component state initialization
  const [hovered, setHover] = useState(false);
  const [visualizerActive, setVisualizerActive] = useState(false);
  const [infoIconHovered, setInfoIconHovered] = useState(false);
  const [visualizerHovered, setVisualizerHover] = useState(false);

  // convert colors to hex for easier manipulation, because string like "red" can be hard to manipulate
  const colorHex = new ColorTranslator(tagBackground).HEX;
  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  // animation state callback system
  const springs = useSpring({
    // if visualiser is active or hide is set then 0, otherwise if its active its 1 else 0.5
    scale: visualizerActive || hide ? 0 : isActive ? 1 : 0.5,
    infoIconScale: infoIconHovered ? 1.25 : 1,
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

  // Handle Primary User Events
  // all other event handlers are collocated with their respective components (since they are small)
  // to decrease bloat and reduce developer scrolling fatigue
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

  // callback fired anytime isactive, or onVisual.. changes
  useEffect(() => {
    // turn the visualizer off anytime this tile becomes inactive
    if (!isActive) {
      setVisualizerActive(false);
      onVisualizerActiveChange && onVisualizerActiveChange(false);
    }
  }, [isActive, onVisualizerActiveChange]);

  // hard coding symbol string length to x position in 3d space for centering
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
        <BackDrop color={colorHex} hoverColor={hoverHex} isHovered={hovered} />
        {/* Primary Text Group */}
        <group position={[-2.7, 0, 1.1]}>
          {/* Atomic Number Text */}
          <Text
            text={atomicNumber.toString()}
            color={textColor}
            size={0.5}
            height={0.15}
            position={[-1.5, 3, -0.7]}
          />
          {/* Group for Info Button*/}
          <animated.group
            scale={springs.infoIconScale}
            onPointerEnter={(e) => {
              e.stopPropagation();
              if (!isActive) return;
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
              if (!isActive) return;
              onInfoClick && onInfoClick();
            }}
            position={[6, 2.5, -0.5]}
          >
            {/* button background */}
            <mesh
              rotation={[0, degToRad(90), degToRad(90)]}
              position={[0.5, 0.35, 0]}
            >
              <cylinderGeometry args={[0.7, 0.7, 0.1]} />
              <meshBasicMaterial color={infoIconHovered ? "blue" : "black"} />
            </mesh>
            {/* button text */}
            <Text text="?" color={textColor} size={0.7} height={0.15} />
          </animated.group>

          {/* text group for symbol and name */}
          <group position={[0, -1, 0]}>
            <Text
              text={symbol}
              color={textColor}
              size={1.5}
              height={1}
              // shift this text down for hard coded recentering - centering kinda moves when we rescale
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
            {/* only display the atom visualizer button if this item is active in the carousel */}
            {isActive && (
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  // we update local state and call onVisChange to update parent state so that this component can be used as a stand alone without
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
                {/* a simplified atom to act as an icon */}
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
      {/* PRIMARY visualizer */}
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
            setCursorActive(true);
          }}
          onPointerLeave={() => {
            setVisualizerHover(false);
            setCursorActive(false);
          }}
        >
          <Atom electronConfig={electronConfig} size={Number(atomicNumber)} />
        </animated.mesh>
      )}
    </>
  );
};
