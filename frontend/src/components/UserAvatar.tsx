// src/components/UserAvatar.tsx
import { Avatar, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import ThemeToggle from './ThemeToggle'; 

const items = [
  // 1. Theme-Specific Option
  {
    key: 'theme-toggle-item',
    // The label is a custom element containing the ThemeToggle component
    label: (
      <div 
        style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        // Added onClick to prevent the dropdown from closing immediately when clicking the toggle itself
        onClick={(e) => e.stopPropagation()} 
      >
        <span>Theme</span>
        <ThemeToggle /> 
      </div>
    ),
    // Use className or style to override default menu item padding/hover if needed
    className: 'hover:bg-transparent',
    // We make it disabled as the interaction happens on the toggle button, not the menu item click
    disabled: true, 
  },
  
  // 2. Standard User Options
  {
    key: 'profile',
    icon: <UserOutlined />,
    label: 'Profile',
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: 'Logout',
  },
];

export default function UserAvatar() {
  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Avatar 
        icon={<UserOutlined />} 
        style={{ cursor: 'pointer', backgroundColor: '#87d068' }} 
      />
    </Dropdown>
  );
}