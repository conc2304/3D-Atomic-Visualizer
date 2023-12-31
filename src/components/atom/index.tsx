import { Mesh } from "three";
import { Electron } from "./electron";
import { Nucleus } from "./nucleus";
import { Property } from "csstype";
import { ElectronConfiguration } from "../../types";
import { degToRad } from "three/src/math/MathUtils";

// type definition for the atom component's props
type AtomProps = {
  electronColor?: Property.Color;
  atomColor?: Property.Color;
  electronConfig: ElectronConfiguration;
  size?: number;
  orbitRadius?: number;
  electronSize?: number;
  nucleusSize?: number;
};

// the atom component
export const Atom = (props: AtomProps) => {
  const {
    electronColor = "#00FFFF",
    atomColor = "red",
    electronConfig,
    size = 1,
    orbitRadius = 1,
    electronSize = 0.4,
    nucleusSize = 0.5,
  } = props;

  return (
    <group>
      <Nucleus size={size} nucleusRadius={nucleusSize} color={atomColor} />
      {Object.keys(electronConfig).map((shellIndex) => {
        // loop over every electron shell and add electron to that shell

        const shellI = Number(shellIndex);
        const electronShell = electronConfig[shellI];
        const electronCloud: (Mesh | JSX.Element)[] = [];

        // visualize in the Bohr style - jsut a bunch of concentric circles

        // counte electrons in shell in order to space them in orbit
        const totalElectrons = Object.values(electronShell).reduce(
          (prev, curr) => {
            return prev + curr;
          },
          0
        );

        // add electron to electron cloud
        for (let i = 0; i < totalElectrons; i++) {
          // spacing between electrons in the same shell
          const offset = degToRad(360 / totalElectrons) * i;
          electronCloud.push(
            <Electron
              key={`electron-${i * shellI}`}
              shellIndex={shellI}
              offset={offset}
              orbitSpeed={0.5}
              orbitRadius={orbitRadius}
              size={electronSize}
              color={electronColor}
            />
          );
        }

        return electronCloud;
      })}
    </group>
  );
};
