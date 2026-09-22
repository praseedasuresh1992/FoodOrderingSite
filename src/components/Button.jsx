export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}) {
  const variants = {
    primary:
      "bg-amber-500 text-white hover:bg-amber-600",

    secondary:
      "border border-white/30 text-white hover:bg-white hover:text-black",

    dark:
      "bg-slate-900 text-white hover:bg-slate-800",
  };

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        px-6
        py-3
        text-sm
        font-semibold
        transition
        duration-300
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}