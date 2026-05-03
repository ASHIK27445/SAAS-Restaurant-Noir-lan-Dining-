export interface MenuItemProps {
  img: string;
  alt: string;
  title: string;
  price: string;
  desc: string;
}

export interface ColorTheme {
  primary: string;
  secondary: string;
  tertiary: string;
  surface: string;
  onSurface: string;
  onSurfaceVariant: string;
  surfaceContainer: string;
  surfaceContainerLow: string;
  surfaceContainerHigh: string;
  surfaceContainerLowest: string;
  outline: string;
  onPrimary: string;
}

export const colors: ColorTheme = {
  primary: "#173124",
  secondary: "#625e54",
  tertiary: "#521801",
  surface: "#fbf9f5",
  onSurface: "#1b1c1a",
  onSurfaceVariant: "#424844",
  surfaceContainer: "#efeeea",
  surfaceContainerLow: "#f5f3ef",
  surfaceContainerHigh: "#eae8e4",
  surfaceContainerLowest: "#ffffff",
  outline: "#727973",
  onPrimary: "#ffffff",
} as const;