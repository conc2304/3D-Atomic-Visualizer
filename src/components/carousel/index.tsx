import { animated } from "@react-spring/three";
import { cloneElement, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";

type ObjectCarouselProps = {
  objects: JSX.Element[];
  activeIndex?: number;
  visualizerActive?: boolean;
};

/**
 *  The object Carousel component is responsible for telling the carousel items
 *  where in space to be and their orientation based on props
 * */

export const ObjectCarousel = (props: ObjectCarouselProps) => {
  const { objects, activeIndex = 0, visualizerActive } = props;

  const visibleItemRange = 2;

  return (
    <>
      <group rotation-y={-Math.PI / objects.length} position-y={-0.01}>
        <animated.group rotation-y={0}>
          {objects.map((MeshObject, i) => {
            const isActiveIndex = i === activeIndex;

            // only show +- the visible item range
            if (
              i > activeIndex + visibleItemRange ||
              i < activeIndex - visibleItemRange
            )
              return null;

            return (
              <animated.group
                key={`anim-g-${i}`}
                position-x={0 + (i - activeIndex) * 6.5}
                position-y={isActiveIndex ? 2 : -1}
                position-z={isActiveIndex ? 4 : -3}
                // lay inactive tiles down
                rotation-x={!isActiveIndex ? degToRad(-90) : 0}
              >
                {/* By using clone element here, we are able to render any component that was passed
                in to the carousel and augment it with carousel props used to animate carousel state */}
                {cloneElement(MeshObject, {
                  ...MeshObject.props,
                  hide: visualizerActive && !isActiveIndex,
                  key: `carouselItem-${i}`,

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
