import Arkitech_Bold from "../assets/Arkitech_Bold.json";

import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { extend, MeshProps } from "@react-three/fiber";
import { Property } from "csstype";

extend({ TextGeometry });

type TextProps = MeshProps & {
  text: string;
  color?: Property.Color;
  size?: number;
  height?: number;
};
export const Text = (props: TextProps, ref: any) => {
  const { text, color = "white", size = 1, height = 1, ...meshProps } = props;

  const font = new FontLoader().parse(Arkitech_Bold);

  return (
    <mesh {...meshProps}>
      {/* @ts-ignore */}
      <textGeometry args={[text, { font, size: size, height: height }]} />
      <meshPhysicalMaterial attach="material" color={color} />
    </mesh>
  );
};
