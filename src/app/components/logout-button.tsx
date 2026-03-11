import { LogoutOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useAuth } from "../context/UserContext";


export function LogoutButton() {
  const { logout } = useAuth();
  return (
    <Button 
      type="primary" 
      danger 
      icon={<LogoutOutlined />} 
      onClick={logout}
      >
      Sair
    </Button>
  )
}