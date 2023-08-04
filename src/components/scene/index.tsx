import { useEffect, useMemo, useState } from "react";
import { ObjectCarousel } from "../carousel";
import { Canvas } from "@react-three/fiber";
import { Text } from "../ui/text";
import { Floor } from "./floor";
import { Vector3 } from "three";
import { Background } from "./background";
import { ElementTag } from "../element";
import { PeriodicTableElement } from "../../types";
import { electronStringToObject } from "../atom/utils";
import { degToRad } from "three/src/math/MathUtils";
import { Box } from "@mui/system";
import { OrbitControls } from "@react-three/drei";
import { InfoModal } from "../element/infoModal";
import { Search } from "../ui/search";

export const Scene = (): JSX.Element => {
  // Component State
  const [periodicTableElements, setPeriodicTableElements] = useState<
    PeriodicTableElement[]
  >([]);
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [visualizerActive, setVisualizerActive] = useState(false);

  const getElementData = async () => {
    const response = await fetch(
      "https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json"
    );

    if (!response || !response.ok) {
      return;
    }
    const data = await response.json();
    const elements: PeriodicTableElement[] = data.elements || [];

    const sortedElements = elements.sort((elemA, elemB) => {
      return elemA.number - elemB.number;
    });
    setPeriodicTableElements(sortedElements);
  };
  // On Component Load callback
  useEffect(() => {
    getElementData();
  }, []);

  const visibleElements = useMemo<JSX.Element[]>(() => {
    if (!periodicTableElements) return [];

    const components = periodicTableElements.map((element) => {
      if (!element) return <></>;

      const { name, electron_configuration, symbol, number } = element;
      const electronConfig = electronStringToObject(electron_configuration);
      return (
        <ElementTag
          key={symbol}
          name={name}
          symbol={symbol}
          atomicNumber={number}
          electronConfig={electronConfig}
          isActive={activeElementIndex === number}
          onElementSelect={(nextActiveElem: number) => {
            // elements are base 1, ie there is no element with an atomic number of 0
            setActiveElementIndex(nextActiveElem - 1);
          }}
          onVisualizerActiveChange={(isActive: boolean) => {
            setVisualizerActive(isActive);
          }}
          onInfoClick={() => {
            setInfoModalOpen(true);
          }}
        />
      );
    });
    return components;
  }, [periodicTableElements, activeElementIndex]);

  return (
    <div style={{ height: "100%" }}>
      <Box
        component="div"
        position={"absolute"}
        sx={{ zIndex: 100, bottom: 10, right: 10 }}
      >
        <Search
          options={periodicTableElements}
          onSearchChange={(value) => {
            setActiveElementIndex(value ? value : activeElementIndex);
          }}
        />
      </Box>
      {periodicTableElements && (
        <InfoModal
          data={periodicTableElements[activeElementIndex]}
          open={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
        />
      )}

      <Canvas shadows camera={{ position: [0, 16, 42], fov: 30 }}>
        <OrbitControls />
        <color attach="background" args={["#191920"]} />
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
          args={["white", 1, 100]}
          position={[-1, 4, -1]}
          penumbra={1}
        />
        <Text text="Atomic Structure" color="red" position={[-10, 8.5, -2]} />
        <Text text="Visualizer" color="red" position={[-6, 7, -2]} />

        <ObjectCarousel
          objects={visibleElements}
          activeIndex={activeElementIndex}
          visualizerActive={visualizerActive}
        />

        <Text
          text="Click Atom to Visualize"
          color="white"
          position={[-4.5, -6, 10]}
          rotation-x={degToRad(-25)}
          height={0.1}
          size={0.3}
        />

        <Floor
          position={new Vector3(0, -2.25, 0)}
          radius={12}
          thickness={0.2}
        />
        <Background />
      </Canvas>
    </div>
  );
};
