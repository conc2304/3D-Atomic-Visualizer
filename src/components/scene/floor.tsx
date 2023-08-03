import { MeshReflectorMaterial } from "@react-three/drei";
import { MeshReflectorMaterialProps } from "@react-three/drei/materials/MeshReflectorMaterial";
import { Vector3 } from "three";

type FloorProps = {
  radius: number;
  thickness: number;
  position: Vector3;
  reflectorMaterialProps?: MeshReflectorMaterialProps;
};
export const Floor = (props: FloorProps) => {
  const { radius, thickness, position, reflectorMaterialProps } = props;

  const {
    mirror = 1,
    mixBlur = 1,
    // @ts-expect-error types are out of date, this is a prop
    resolution = 2048,
    // @ts-expect-error types are out of date, this is a prop
    blur = [512, 512],
    mixStrength = 20,
    roughness = 0.5,
    depthScale = 0,
    minDepthThreshold = 0,
    maxDepthThreshold = 20,
    color = "#d3d3d3",
    metalness = 1,
  } = reflectorMaterialProps || {};
  return (
    <mesh rotation={[0, 0, 0]} position={position}>
      <cylinderGeometry args={[radius, radius, thickness]} />
      <MeshReflectorMaterial
        blur={blur}
        mirror={mirror}
        resolution={resolution}
        mixBlur={mixBlur}
        mixStrength={mixStrength}
        roughness={roughness}
        depthScale={depthScale}
        minDepthThreshold={minDepthThreshold}
        maxDepthThreshold={maxDepthThreshold}
        color={color}
        metalness={metalness}
      />
    </mesh>
  );
};
