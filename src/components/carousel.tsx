import { animated, useSpring } from "@react-spring/three";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Cube } from "./cube";
import { degToRad, radToDeg } from "three/src/math/MathUtils";
import {
  Selection,
  Select,
  EffectComposer,
  Outline,
} from "@react-three/postprocessing";

type ObjectCarouselProps = {
  objects: JSX.Element[];
};

export const ObjectCarousel = (props: ObjectCarouselProps) => {
  const { objects } = props;

  const [activeIndex, setActiveIndex] = useState(0);

  const offset = degToRad(180 / objects.length); // put the first item in the front
  const getAngle = (activeIndex: number) => {
    const direction = -1;
    const angle = (2 * Math.PI * activeIndex * direction) / objects.length;
    console.log(radToDeg(angle + offset));
    return angle + offset;
  };

  const { carouselRotation } = useSpring({
    carouselRotation: getAngle(activeIndex),
    config: {
      mass: 5,
      tension: 400,
      friction: 50,
    },
  });

  const radius = 5;

  const getItemPosition = (index: number) => {
    const theta = (2 * Math.PI * index) / objects.length;
    return new Vector3(Math.sin(theta) * radius, 0, Math.cos(theta) * radius);
  };

  const handleOnItemClick = (newActiveIndex: number) => {
    setActiveIndex(newActiveIndex);
  };
  const colorMap = ["red", "green", "yellow", "blue"];

  return (
    <>
      <group rotation-y={-Math.PI / objects.length} position-y={-0.01}>
        <animated.group rotation-y={carouselRotation}>
          {objects.map((MeshObject, i) => {
            const isActiveIndex = i === activeIndex;

            return (
              <Cube
                position={getItemPosition(i)}
                key={`carouseItem-${i}`}
                onClick={() => handleOnItemClick(i)}
                isActive={isActiveIndex}
                color={isActiveIndex ? "white" : colorMap[i] || "grey"}
              />
            );
          })}
        </animated.group>
      </group>
    </>
  );
};
