import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

/**
 * 通用按钮组件，支持 default/outline/ghost 三种风格
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    let variantClass = "";
    switch (variant) {
      case "outline":
        variantClass = "border border-blue-600 text-blue-700 bg-white hover:bg-blue-50";
        break;
      case "ghost":
        variantClass = "bg-transparent text-blue-700 hover:bg-blue-100";
        break;
      default:
        variantClass = "bg-blue-600 text-white hover:bg-blue-700";
    }
    return (
      <button
        ref={ref}
        className={cn(
          "rounded px-6 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400",
          variantClass,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;
