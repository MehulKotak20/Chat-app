// src/theme.js
import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "light", // Set initial color mode (light or dark)
  useSystemColorMode: false, // If true, use system setting
};

const theme = extendTheme({ config });

export default theme;
