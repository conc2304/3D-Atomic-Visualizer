import { Mesh } from "three";
import { Electron } from "./electron";
import { Nucleus } from "./nucleus";
import { Property } from "csstype";
import { ElectronConfiguration } from "./types";
import { degToRad } from "three/src/math/MathUtils";

type AtomProps = {
  color?: Property.Color;
  electronConfig: ElectronConfiguration;
  size?: number;
  orbitRadius?: number;
  electronSize?: number;
  nucleusSize?: number;
};
export const Atom = (props: AtomProps) => {
  const {
    color = "red",
    electronConfig,
    size = 1,
    orbitRadius = 1,
    electronSize = 0.4,
    nucleusSize = 0.5,
  } = props;

  return (
    <group>
      <Nucleus size={size} nucleusRadius={nucleusSize} />
      {Object.keys(electronConfig).map((shellIndex) => {
        const shellI = Number(shellIndex);
        const electronShell = electronConfig[shellI];
        const electronCloud: (Mesh | JSX.Element)[] = [];

        // visualize in the Bohr style
        const totalElectrons = Object.values(electronShell).reduce(
          (prev, curr) => {
            return prev + curr;
          },
          0
        );

        const shellSpeed = shellI * 0.5;
        for (let i = 0; i < totalElectrons; i++) {
          const offset = degToRad(360 / totalElectrons) * i;
          electronCloud.push(
            <Electron
              key={`electron-${i * shellI}`}
              shellIndex={shellI}
              offset={offset}
              orbitSpeed={shellSpeed}
              orbitRadius={orbitRadius}
              size={electronSize}
            />
          );
        }

        return electronCloud;
      })}
    </group>
  );
};
