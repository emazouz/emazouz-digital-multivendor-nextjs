import { cn } from "@/shared/lib/utils";
import { Loader2 } from "lucide-react";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
  variant?: "default" | "secondary" | "white";
}

export function Loader({
  className,
  size = "default",
  variant = "default",
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    default: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const variantClasses = {
    default: "text-primary",
    secondary: "text-muted-foreground",
    white: "text-white",
  };

  return (
    <div
      className={cn("flex justify-center items-center", className)}
      {...props}
    >
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          variantClasses[variant],
        )}
      />
    </div>
  );
}
