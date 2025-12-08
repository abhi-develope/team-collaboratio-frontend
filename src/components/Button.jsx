export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost:
      "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300",
    outline:
      "border-2 border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    icon: "p-2",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
