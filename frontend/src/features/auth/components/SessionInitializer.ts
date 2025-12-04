import { useRestoreSession } from "../hooks/useRestoreSession";

export default function SessionInitializer() {
  useRestoreSession(); 
  return null;
}
