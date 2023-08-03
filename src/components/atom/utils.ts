import { ElectronConfiguration, OrbitalType } from "./types";

// Take electron config string as "1s2 2s2 2p6" and convert to object
export const electronStringToObject = (
  config: string
): ElectronConfiguration => {
  const electronConfig: ElectronConfiguration = {};

  // (\d+) = shell number // ([spdfgh]) = orbital type (\d+)
  const matches = config.match(/(\d+)([spdfgh])(\d+)/g);

  if (!matches) return electronConfig;

  for (const match of matches) {
    const shellIndex = Number(match[0]);
    const orbitalType = match[1] as OrbitalType;
    const electronCount = Number(match.slice(2));

    if (!electronConfig[shellIndex]) {
      electronConfig[shellIndex] = {};
    }

    electronConfig[shellIndex][orbitalType] = electronCount;
  }

  return electronConfig;
};
