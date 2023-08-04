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

  const sphereCrossSections = 32;

  return (
    <group position={[0, 0, 0]}>
      {/* render a sphere per atomic number (size) */}
      {Array.from({ length: size }).map((_, i) => (
        <mesh
          key={`${i % 2 === 0 ? "proton" : "neutron"}-${i}`}
          // we are randomizing the x,y,z positions of the protons and neutrons in the nucleus to simulate their clustering and bonding
          position={[
            size === 1
              ? 0
              : MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            size === 1
              ? 0
              : MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            size === 1
              ? 0
              : MathUtils.randFloat(-nucleusDensity, nucleusDensity),
          ]}
        >
          <sphereGeometry
            args={[nucleusRadius, sphereCrossSections, sphereCrossSections]}
          />
          {/* every other item is either a "proton" or a "neutron" so simulate with color*/}
          <meshStandardMaterial color={i % 2 === 0 ? color : "white"} />
        </mesh>
      ))}
    </group>
  );
};

// memoize it because every time we hover on the parent this rerenders and the random triggers and looks janky
export const Nucleus = memo(NucleusComponent);
