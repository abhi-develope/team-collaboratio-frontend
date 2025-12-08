export default function Avatar({ name, size = "md", className = "" }) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
  };

  return (
    <div
      className={`${sizes[size]} rounded-full bg-blue-600 flex items-center justify-center text-white font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
