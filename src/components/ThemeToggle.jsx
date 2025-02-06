import { IconButton } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/userSlice";

const ThemeToggle = () => {
  const theme = useSelector((state) => state.user.theme);
  const dispatch = useDispatch();

  return (
    <IconButton onClick={() => dispatch(toggleTheme())} color="inherit">
      {theme === "dark" ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
};

export default ThemeToggle;
