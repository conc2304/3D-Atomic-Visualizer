import { ContactShadows } from "@react-three/drei";

import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { ObjectCarousel } from "../carousel";
import { Cube } from "../cube";
import { Atom } from "../atom/atom";
import { Text } from "../text";
import { Floor } from "./floor";
import { Vector3 } from "three";
import { Background } from "./background";
import { ElementTag } from "../element";
import { PeriodicTableElement } from "../atom/types";
import { electronStringToObject } from "../atom/utils";

export const Scene = () => {
  // const objects = [
  //   <Cube color="red" />,
  //   <Cube color="green" />,
  //   <Cube color="blue" />,
  //   <Cube color="yellow" />,
  // ];

  const [periodicTableElements, setPeriodicTableElements] = useState<
    PeriodicTableElement[]
  >([]);
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const getElementData = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"
    );

    if (!response || !response.ok) {
      return;
    }
    const data = await response.json();
    setPeriodicTableElements(data.elements);
  };
  useEffect(() => {
    getElementData();
  }, []);

  const visibleElements = useMemo<PeriodicTableElement[]>(() => {
    if (!periodicTableElements) return [];

    const listSize = periodicTableElements.length;
    return [
      periodicTableElements[activeElementIndex],
      periodicTableElements[(activeElementIndex + 1) % listSize],
      periodicTableElements[(activeElementIndex + 2) % listSize],
      periodicTableElements[(activeElementIndex + 3) % listSize],
    ];
  }, [periodicTableElements, activeElementIndex]);

  return (
    <>
      {/* <OrbitControls /> */}
      {/* <fog attach="fog" args={["red", 220, 220]} /> */}
      <color attach="background" args={["#191920"]} />
      {/* <ambientLight intensity={0.1} />
      <directionalLight position={[0, 20, 20]} intensity={1} /> */}
      <ambientLight intensity={1} />
      <directionalLight intensity={2} castShadow />
      <pointLight
        castShadow
        intensity={3}
        args={[0xff0000, 1, 100]}
        position={[-1, 3, 1]}
      />
      <spotLight
        castShadow
        intensity={1}
        args={["blue", 1, 100]}
        position={[-1, 4, -1]}
        penumbra={1}
      />
      {/* <ObjectCarousel objects={objects} /> */}
      <Text text="Atomic Visualizer" color="red" position={[-10, 7, -2]} />
      {/* <Atom
        electronConfig={{
          1: { s: 2 },
          2: { s: 2, p: 6 },
        }}
      /> */}
      {visibleElements &&
        visibleElements.map((elementData) => {
          if (!elementData) return <></>;
          const { name, electron_configuration, symbol, number } = elementData;
          const electronConfig = electronStringToObject(electron_configuration);
          return (
            <ElementTag
              key={symbol}
              name={name}
              symbol={symbol}
              atomicNumber={number}
              electronConfig={electronConfig}
            />
          );
        })}

      <Floor position={new Vector3(0, -2.25, 0)} radius={12} thickness={0.2} />
      {/* <ContactShadows scale={30} opacity={0.32} /> */}
      <Background />
      {/* </Physics> */}
    </>
  );
};
