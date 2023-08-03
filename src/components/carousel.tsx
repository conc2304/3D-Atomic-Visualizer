import { animated, useSpring } from "@react-spring/three";
import { cloneElement, useRef, useState } from "react";
import { Vector3 } from "three";
import { Cube } from "./cube";
import { degToRad } from "three/src/math/MathUtils";
import { Text } from "./text";

type ObjectCarouselProps = {
  objects: JSX.Element[];
  radius?: number;
  onElementChange?: (elementId: number) => void;
  activeIndex?: number;
};

export const ObjectCarousel = (props: ObjectCarouselProps) => {
  const { objects, onElementChange, radius = 5, activeIndex = 0 } = props;
  // const offset = degToRad(180 / objects.length) + degToRad(360); // turn everything to face the camera

  const [visualizerActive, setVisualizerActive] = useState(false);
  const visibleItemRange = 2;
  // const currAngle = useRef(offset);
  const currRotation = useRef(0);

  // const [springs, api] = useSpring(() => ({
  //   from: {
  //     carouselRotation: offset,
  //     itemRotation: [0, 0, 0],
  //   },
  //   config: {
  //     mass: 4,
  //     tension: 800,
  //     friction: 50,
  //   },
  // }));

  const getItemPosition = (index: number) => {
    // console.log("getItemPosition", index);
    const offScreenX = 20;
    if (index > 0 && index < objects.length - 1) {
      const theta = (2 * Math.PI * index) / 3;
      const spacing = index !== activeIndex ? 4 : 0;
      const spacingDir = index > activeIndex ? 1 : -1;

      return new Vector3(
        spacing * spacingDir + Math.sin(theta + degToRad(120)) * radius,
        0,
        Math.cos(theta + degToRad(120)) * radius
      );
    } else if (index === 0) {
      // put it off screen left
      return new Vector3(-offScreenX, 0, 0);
    } else {
      return new Vector3(offScreenX, 0, 0);
      // put it off screen right
    }
  };

  const handleOnItemClick = (nextActiveIndex: number, elementId: number) => {
    // let delta: number;
    // //  check for index wrap around and only increment by one in either direction
    // if (activeIndex === 0 && nextActiveIndex === objects.length - 1) {
    //   delta = 1;
    // } else if (activeIndex === objects.length - 1 && nextActiveIndex === 0) {
    //   delta = -1;
    // } else {
    //   const direction = -1;
    //   delta = direction * (nextActiveIndex - activeIndex);
    // }

    // const nextAngle =
    //   currAngle.current + delta * degToRad(360 / objects.length);

    // const nextRotation =
    //   currRotation.current + delta * degToRad(-360 / objects.length);

    // currRotation.current = nextRotation;

    // currAngle.current = nextAngle;
    // api.start({
    //   to: {
    //     carouselRotation: nextAngle,
    //     itemRotation: [nextRotation, 0, 0],
    //   },
    // });
    // setActiveIndex(nextActiveIndex);

    onElementChange && onElementChange(elementId);
  };

  return (
    <>
      <group rotation-y={-Math.PI / objects.length} position-y={-0.01}>
        <animated.group rotation-y={0}>
          {/* <animated.group rotation-y={springs.carouselRotation}> */}
          {objects.map((MeshObject, i) => {
            const isActiveIndex = i === activeIndex;

            // only show +- the visible item range
            if (
              i > activeIndex + visibleItemRange ||
              i < activeIndex - visibleItemRange
            )
              return <></>;

            return (
              <animated.group
                key={`anim-g-${i}`}
                position-x={0 + (i - activeIndex) * 6.5}
                position-y={isActiveIndex ? 2 : -1}
                position-z={isActiveIndex ? 4 : -3}
                rotation-x={!isActiveIndex ? degToRad(-90) : 0}
              >
                {cloneElement(MeshObject, {
                  ...MeshObject.props,
                  hide: visualizerActive && !isActiveIndex,
                  key: `carouselItem-${i}`,
                  onClick: (elementId: number): void => {
                    handleOnItemClick(i, elementId);
                    MeshObject.props.onElementSelect(elementId);
                  },
                  onVisualizerActiveChange: (isActive: boolean) => {
                    setVisualizerActive(isActive);
                  },
                  isActive: isActiveIndex,
                })}
              </animated.group>
            );
          })}
        </animated.group>
      </group>
    </>
  );
};
