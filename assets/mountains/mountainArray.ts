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
  { index: 0, name: "Grouse", desc: "Easy", trees: 1, jerries: 1, moguls: 0, bears: 0 },
  { index: 1, name: "Louise", desc: "Bear Central", trees: 3, jerries: 1, moguls: 1, bears: 8 },
  { index: 2, name: "Sun Peaks", desc: "Glades", trees: 13, jerries: 1, moguls: 1, bears: 1 },
  { index: 3, name: "Panorama", desc: "Moguls", trees: 11, jerries: 1, moguls: 14, bears: 3 },
  { index: 4, name: "Revelstoke", desc: "Glades", trees: 14, jerries: 1, moguls: 13, bears: 2 },
  { index: 5, name: "Whistler", desc: "Jerry Central", trees: 5, jerries: 10, moguls: 1, bears: 0 },
];
