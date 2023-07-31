import { useState, useRef, useMemo, useEffect } from "react";
import { MeshProps, useThree } from "@react-three/fiber";
import { Euler, MathUtils, Mesh } from "three";
import { Property } from "csstype";
import { lighten } from "@mui/material";
import { ColorTranslator } from "colortranslator";
import { MeshWobbleMaterial } from "@react-three/drei";
import { animated, useSpring } from "@react-spring/three";
import { useDrag } from "@use-gesture/react";

type CubeProps = MeshProps & {
  color?: Property.Color;
  hoverColor?: Property.Color;
  cubeSize?: number;
  rotationResponsiveness?: number;
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
  const {
    color = "blue",
    hoverColor = null,
    cubeSize = 2,
    isActive = false,
    onClick,
    position,
  } = props;

  const meshRef = useRef<Mesh>(null);
  const cubeArgs: CubeArgs = [cubeSize, cubeSize, cubeSize];
  const { size } = useThree();
  const [hovered, setHover] = useState(false);
  const [rotationActive, setRotationActive] = useState(false);
  const colorHex = new ColorTranslator(color).HEX;

  const e = useMemo(() => new Euler(), []);

  const hoverHex = hoverColor
    ? new ColorTranslator(hoverColor).HEX
    : lighten(colorHex, 0.7);

  const springs = useSpring({
    scale: isActive ? 1.2 : 0.5,
    color: hovered ? hoverHex : colorHex,
    warpFactor: !isActive ? 1 : 0,
    wardSpeed: !isActive ? 1 : 0,
  });

  const initialRotation: Array<string | number | undefined> = [0, 0, 0];
  const [rSpring, api] = useSpring(
    () => ({
      from: {
        rotation: initialRotation,
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

  const handleClick = (evt: any) => {
    onClick && onClick();
    // if (isActive) {
    //   setRotationActive(!rotationActive);
    // }
  };

  return (
    <animated.mesh
      {...bind()}
      ref={meshRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      scale={springs.scale}
      position={position}
      // @ts-ignore
      rotation={rSpring.rotation}
    >
      <boxGeometry args={cubeArgs} />
      {/* @ts-ignore */}
      <AnimatedMesh
        color={springs.color}
        speed={springs.wardSpeed}
        factor={springs.warpFactor}
      />
    </animated.mesh>
  );
};
