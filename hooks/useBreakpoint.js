import { useWindowDimensions } from 'react-native';

export const BREAKPOINTS = {
  tablet: 700,
  wide: 1024,
};

export default function useBreakpoint() {
  const { width, height } = useWindowDimensions();

  let numColumns = 2;
  if (width >= BREAKPOINTS.wide) {
    numColumns = 4;
  } else if (width >= BREAKPOINTS.tablet) {
    numColumns = 3;
  }

  return {
    width,
    height,
    isLandscape: width > height,
    numColumns,
  };
}