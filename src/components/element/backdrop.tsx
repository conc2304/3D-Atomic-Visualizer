import { animated, config, useSpring } from "@react-spring/three";
import { RoundedBox } from "@react-three/drei";
import { Property } from "csstype";
import { useRef } from "react";
import { Mesh } from "three";

// type definition of props for the Backdrop
type ElementBackDropProps = {
  isHovered: boolean;
  hoverColor: Property.Color;
  color: Property.Color;
};

export const BackDrop = (props: ElementBackDropProps) => {
  const { isHovered, hoverColor, color } = props;

  const meshRef = useRef<Mesh>(null);

  // Define the spring animation for the material's color.
  const springs = useSpring({
    color: isHovered ? hoverColor : color,
    config: config.slow,
  });

  return (
    <RoundedBox ref={meshRef} args={[10, 8, 0.5]} radius={0.2} smoothness={4}>
      {/* @ts-expect-error these springs types are just throwing errors left and right */}
      <animated.meshStandardMaterial color={springs.color} />
    </RoundedBox>
  );
};
