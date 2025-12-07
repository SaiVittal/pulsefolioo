import { Switch } from "antd";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { themeMode, toggleThemeWithRipple } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleThemeWithRipple({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  return (
    <Switch
      checked={themeMode === "dark"}
      onClick={(_checked, e) =>
        handleToggle(e as React.MouseEvent<HTMLButtonElement>)
      }
      checkedChildren="🌙"
      unCheckedChildren="☀️"
      style={{ margin: "0 8px" }}
    />
  );
}
