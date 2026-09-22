export default function SectionTitle({
  subtitle,
  title,
  description,
  light = false,
}) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {subtitle && (
        <p
          className={`
            mb-2
            text-sm
            font-semibold
            uppercase
            tracking-[0.25em]
            ${light ? "text-amber-400" : "text-amber-600"}
          `}
        >
          {subtitle}
        </p>
      )}

      <h2
        className={`
          text-3xl
          font-bold
          sm:text-4xl
          ${light ? "text-white" : "text-slate-900"}
        `}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`
            mt-4
            text-sm
            leading-7
            sm:text-base
            ${light ? "text-white/70" : "text-slate-600"}
          `}
        >
          {description}
        </p>
      )}
    </div>
  );
}