import { Property } from "csstype";
import { memo } from "react";
import { MathUtils } from "three";

type NucleusProps = {
  color?: Property.Color;
  size?: number;
  nucleusRadius?: number;
};

const NucleusComponent = (props: NucleusProps) => {
  const { color = "red", size = 1, nucleusRadius = 0.1 } = props;
  const nucleusDensity = 0.6;
  console.log("render");

  return (
    <group position={[0, 0, 0]}>
      {Array.from({ length: size }).map((_, i) => (
        <mesh
          key={`${i % 2 === 0 ? "proton" : "neutron"}-${i}`}
          position={[
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
          ]}
        >
          <sphereGeometry args={[nucleusRadius, 32, 32]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : "white"} />
        </mesh>
      ))}
    </group>
  );
};

// memoize it because every time we hover on the parent this rerenders and the random triggers and looks janky
export const Nucleus = memo(NucleusComponent);
