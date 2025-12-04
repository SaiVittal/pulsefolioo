import { Button } from "antd";
import { useLogout } from "../hooks/useLogout";

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <Button onClick={logout} danger>
      Logout
    </Button>
  );
}
