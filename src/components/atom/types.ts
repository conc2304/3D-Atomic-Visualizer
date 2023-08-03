export type OrbitalConfiguration = {
  s?: number; // up to 2 electrons
  p?: number; // up to 6 electrons
  d?: number; // up to 10 electrons
  f?: number; // up to 14 electrons
};

export type OrbitalType = keyof OrbitalConfiguration;
export type ElectronConfiguration = {
  [key: number]: OrbitalConfiguration;
};

// Type based on https://github.com/Bowserinator/Periodic-Table-JSON
// but we wond use all of them ... but we could use a lot of them
export type PeriodicTableElement = {
  name: string;
  appearance: string;
  atomic_mass: number;
  boil: number;
  category: string;
  density: number;
  discovered_by: string;
  melt: number;
  molar_heat: number;
  named_by: string;
  number: number;
  period: number;
  group: number;
  phase: string;
  source: string;
  bohr_model_image: string;
  bohr_model_3d: string;
  spectral_img: string;
  summary: string;
  symbol: string;
  xpos: number;
  ypos: number;
  wxpos: number;
  wypos: number;
  shells: number[];
  electron_configuration: string;
  electron_configuration_semantic: string;
  electron_affinity: number;
  electronegativity_pauling: number;
  ionization_energies: number[];
  cpk_hex: string;
  image: {
    title: string;
    url: string;
    attribution: string;
  };
  block: string;
};
