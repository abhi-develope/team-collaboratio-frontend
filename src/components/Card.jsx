export default function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }) {
  return (
    <h3
      className={`text-xl font-semibold text-gray-900 dark:text-gray-100 ${className}`}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}
