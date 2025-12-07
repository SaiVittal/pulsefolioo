import { Button, ButtonProps } from "antd";
import { ReactNode } from "react";

type Kind = "primary" | "outline" | "ghost";

interface AppButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  kind?: Kind;
  children: ReactNode;
}

export default function AppButton({
  kind = "primary",
  children,
  style,
  ...rest
}: AppButtonProps) {
  const isPrimary = kind === "primary";

  const buttonType: "primary" | "default" = isPrimary ? "primary" : "default";

  const variantStyle: React.CSSProperties =
    kind === "outline"
      ? {
          background: "transparent",
          border: "1px solid var(--ant-color-border)",
        }
      : kind === "ghost"
      ? {
          background: "transparent",
          border: "none",
        }
      : {};

  return (
    <Button
      type={buttonType}
      style={{
        borderRadius: 999,
        fontWeight: 500,
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
