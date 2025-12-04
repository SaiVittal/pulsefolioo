import { Button } from "antd";
import { useLogout } from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const nav = useNavigate();
  const mutation = useLogout();

  async function doLogout() {
    mutation.mutate(undefined, {
      onSuccess: () => nav("/login", { replace: true }),
      onError: () => nav("/login", { replace: true }),
    });
  }

  return (
    <Button onClick={doLogout} danger loading={mutation.isPending}>
      Logout
    </Button>
  );
}
