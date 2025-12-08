export default function Input({
  label,
  error,
  className = "",
  containerClassName = "",
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder-gray-400 dark:placeholder-gray-500
          disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed
          transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
