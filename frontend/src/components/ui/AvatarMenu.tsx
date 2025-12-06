import { Avatar, Dropdown, MenuProps, Space, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../store/auth";

export default function AvatarMenu() {
  const email = useAuthStore((s) => s.email) ?? "User";

  const items: MenuProps["items"] = [
    { key: "profile", label: "Profile" },
    { type: "divider" },
    { key: "logout", danger: true, label: "Logout" },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Space
        size="small"
        style={{ cursor: "pointer" }}
      >
        <Avatar icon={<UserOutlined />} />
        <Typography.Text>{email}</Typography.Text>
      </Space>
    </Dropdown>
  );
}
