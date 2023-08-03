import { Mesh } from "three";
import { Electron } from "./electron";
import { Nucleus } from "./nucleus";
import { Property } from "csstype";
import { ElectronConfiguration } from "./types";
import { degToRad } from "three/src/math/MathUtils";

type AtomProps = {
  color?: Property.Color;
  electronConfig: ElectronConfiguration;
};
export const Atom = (props: AtomProps) => {
  const { color = "red", electronConfig } = props;

  return (
    <group>
      <Nucleus />
      {Object.keys(electronConfig).map((shellIndex) => {
        const shellI = Number(shellIndex);
        const electronShell = electronConfig[shellI];
        const electronCloud: (Mesh | JSX.Element)[] = [];

        console.log(electronShell);

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
              shellIndex={shellI}
              offset={offset}
              orbitSpeed={shellSpeed}
            />
          );
        }

        // if (electronShell.s) {
        //   for (let i = 0; i < electronShell.s; i++) {
        //     electronCloud.push(
        //       <SOrbitalElectron
        //         key={`s-orbital-${shellI}-${i}`}
        //         shellIndex={shellI}
        //       />
        //     );
        //   }
        // }

        // if (electronShell.p) {
        //   for (let i = 0; i < electronShell.p; i++) {
        //     electronCloud.push(
        //       <POrbitalElectron
        //         key={`p-orbital-${shellI}-${i}`}
        //         shellIndex={shellI}
        //         hemisphere={i % 2 === 0 ? "left" : "right"}
        //       />
        //     );
        //   }
        // }

        return electronCloud;
      })}
    </group>
  );
};
