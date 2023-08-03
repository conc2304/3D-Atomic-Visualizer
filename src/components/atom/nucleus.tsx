import { Property } from "csstype";
import { MathUtils } from "three";

type NucleusProps = {
  color?: Property.Color;
  size?: number;
};

export const Nucleus = (props: NucleusProps) => {
  const { color = "red", size = 6 } = props;
  const nucleusDensity = 0.6;
  return (
    <group>
      {Array.from({ length: size }).map((_, i) => (
        <mesh
          key={`${i % 2 === 0 ? "proton" : "neutron"}-${i}`}
          position={[
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
            MathUtils.randFloat(-nucleusDensity, nucleusDensity),
          ]}
        >
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color={i % 2 === 0 ? color : "white"} />
        </mesh>
      ))}
    </group>
  );
};
