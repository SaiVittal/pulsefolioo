import { Switch } from "antd";
import { useTheme } from "../context/ThemeContext"; 
export default function ThemeToggle() {
  const { themeMode, toggleTheme } = useTheme();

  return (
    <Switch
      checked={themeMode === "dark"}
      onChange={toggleTheme}
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      style={{ margin: '0 8px' }} 
    />
  );
}