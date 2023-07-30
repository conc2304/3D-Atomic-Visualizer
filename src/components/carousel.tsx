import { animated, useSpring } from "@react-spring/three";
import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { Cube } from "./cube";
import { degToRad, radToDeg } from "three/src/math/MathUtils";

type ObjectCarouselProps = {
  objects: JSX.Element[];
};

export const ObjectCarousel = (props: ObjectCarouselProps) => {
  const { objects } = props;
  const offset = degToRad(180 / objects.length) + degToRad(360); // put the first item in the front

  const [activeIndex, setActiveIndex] = useState(0);
  const currAngle = useRef(offset);

  const getAngle = (activeIndex: number, direction = -1) => {
    const angle = (2 * Math.PI * activeIndex * direction) / objects.length;
    console.log(radToDeg(angle + offset));
    return angle + offset;
  };

  const [springs, api] = useSpring(() => ({
    from: {
      carouselRotation: offset,
    },
    config: {
      mass: 4,
      tension: 800,
      friction: 50,
    },
  }));

  const radius = 5;

  const getItemPosition = (index: number) => {
    const theta = (2 * Math.PI * index) / objects.length;
    return new Vector3(Math.sin(theta) * radius, 0, Math.cos(theta) * radius);
  };

  const handleOnItemClick = (nextActiveIndex: number) => {
    let delta: number;
    //  check for index wrap around and only increment by one in either direction
    if (activeIndex === 0 && nextActiveIndex === objects.length - 1) {
      delta = 1;
    } else if (activeIndex === objects.length - 1 && nextActiveIndex === 0) {
      delta = -1;
    } else {
      const direction = -1;
      delta = direction * (nextActiveIndex - activeIndex);
    }

    const nextAngle =
      currAngle.current + delta * degToRad(360 / objects.length);

    currAngle.current = nextAngle;
    api.start({
      to: {
        carouselRotation: nextAngle,
      },
    });
    setActiveIndex(nextActiveIndex);
  };
  const colorMap = ["red", "green", "yellow", "blue"];

  return (
    <>
      <group rotation-y={-Math.PI / objects.length} position-y={-0.01}>
        <animated.group rotation-y={springs.carouselRotation}>
          {objects.map((MeshObject, i) => {
            const isActiveIndex = i === activeIndex;

            return (
              <Cube
                position={getItemPosition(i)}
                key={`carouseItem-${i}`}
                onClick={() => handleOnItemClick(i)}
                isActive={isActiveIndex}
                color={isActiveIndex ? colorMap[i] : colorMap[i] || "grey"}
              />
            );
          })}
        </animated.group>
      </group>
    </>
  );
};
