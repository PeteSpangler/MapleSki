export type Mountain = {
  index: number;
  name: string;
  desc: string;
  trees: number;
  jerries: number;
  moguls: number;
  bears: number;
};

export const mountainArray: Mountain[] = [
  { index: 0, name: "Grouse", desc: "Easy", trees: 0, jerries: 0, moguls: 0, bears: 0 },
  { index: 1, name: "Louise", desc: "Bear Central", trees: 1, jerries: 1, moguls: 1, bears: 2 },
  { index: 2, name: "Sun Peaks", desc: "Glades", trees: 3, jerries: 1, moguls: 1, bears: 1 },
  { index: 3, name: "Panorama", desc: "Moguls", trees: 1, jerries: 1, moguls: 4, bears: 1 },
  { index: 4, name: "Revelstoke", desc: "Glades", trees: 4, jerries: 1, moguls: 3, bears: 1 },
  { index: 5, name: "Whistler", desc: "Jerry Central", trees: 0, jerries: 10, moguls: 0, bears: 0 },
];
