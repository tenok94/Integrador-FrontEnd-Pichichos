import { createTheme } from "@mui/material/styles";

const themeConfig = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: { main: "#1976d2" },
      secondary: { main: "#dc004e" },
    },
  });

export default themeConfig;