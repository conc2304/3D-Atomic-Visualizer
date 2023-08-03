import { useState, useRef, useMemo, useEffect } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { Euler, MathUtils, Mesh, Vector3 } from "three";
import { Property } from "csstype";
import { lighten } from "@mui/material";
import { ColorTranslator } from "colortranslator";
import { MeshWobbleMaterial } from "@react-three/drei";
import { animated, config, useSpring } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";
import { Triplet, useBox } from "@react-three/cannon";

type CubeProps = MeshProps & {
  color?: Property.Color;
  hoverColor?: Property.Color;
  cubeSize?: number;
  rotationResponsiveness?: number;
  isActive?: boolean;
  withPhysics?: boolean;
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
  const {
    color = "blue",
    hoverColor = null,
    cubeSize = 2,
    isActive = false,
    onClick,
    position = new Vector3(0, 0, 0),
    withPhysics = false,
  } = props;

  // const meshRef = useRef<Mesh>(null);

  console.log("INIT POS: ", position);

  const { size } = useThree();
  const e = useMemo(() => new Euler(), []);
  const [hovered, setHover] = useState(false);
  const [rotationActive, setRotationActive] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const colorHex = new ColorTranslator(color).HEX;
  const cubeArgs: CubeArgs = [cubeSize, cubeSize, cubeSize];

  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  const springs = useSpring({
    scale: isActive ? 1.2 : 0.5,
    color: hovered ? hoverHex : colorHex,
    warpFactor: !isActive ? 1 : 0,
    wardSpeed: !isActive ? 1 : 0,
    config: config.slow,
  });

  const defaultPosition = [0, 0, 0];
  const initialRotation: Array<string | number | undefined> = [0, 0, 0];
  const [iSpring, api] = useSpring(
    () => ({
      from: {
        rotation: initialRotation,
        position: [0, 0, 0],
      },
    }),
    []
  );

  useEffect(() => {
    // reset rotation to normal when its no longer the active item in the carousel
    if (!isActive) {
      api.start({
        to: {
          rotation: initialRotation,
          position: [0, 0, 0],
        },
      });
    }
  }, [isActive]);

  const bind = useDrag(({ delta: [dx, dy] }) => {
    if (!rotationActive) return;

    const responsiveness = 10;
    // https://threejs.org/docs/#api/en/math/Matrix4.makeRotationFromEuler
    e.y += (dx / size.width) * responsiveness;
    e.x += (dy / size.width) * responsiveness;
    e.x = MathUtils.clamp(e.x, -Math.PI / 2, Math.PI / 2);

    const nextRotation = e.toArray().slice(0, 3);

    api.start({
      to: {
        rotation: nextRotation,
      },
      config: config.wobbly,
    });
  });

  const handlePointerOver = () => {
    setHover(true);
    if (isActive) {
      setRotationActive(!rotationActive);
    }
  };

  const handlePointerOut = () => {
    setHover(false);
  };

  const handleClick = () => {
    onClick && onClick();
  };

  const handleDoubleClick = () => {
    if (!isActive) return;
    console.log("DOUBLE");
    const nextIsZoomed = !isZoomed;
    const toPos = nextIsZoomed ? [0, 1, 1] : defaultPosition;
    api.start({
      to: {
        position: toPos,
      },
    });

    console.log(nextIsZoomed);
    console.log(toPos, defaultPosition);
    setIsZoomed(!nextIsZoomed);
  };

  return (
    // @ts-ignore
    // <mesh ref={boxRef}>
    <mesh position={iSpring.position}>
      <animated.mesh
        {...bind()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        scale={springs.scale}
        position={position}
        // @ts-ignore
        rotation={iSpring.rotation}
      >
        <boxGeometry args={cubeArgs} />
        {/* @ts-ignore */}
        <AnimatedMesh
          color={springs.color}
          speed={springs.wardSpeed}
          factor={springs.warpFactor}
        />
      </animated.mesh>
    </mesh>
    // {/* </mesh> */}
  );
};
