import { Plus } from "lucide-react";

export default function MenuItem({ item, onAdd }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4">

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900">
              {item.name}
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </div>

          {item.isVeg && (
            <span className="mt-1 h-4 w-4 shrink-0 rounded-sm border-2 border-green-600 p-0.5">
              <span className="block h-full w-full rounded-full bg-green-600" />
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">

          <span className="text-lg font-bold text-slate-900">
            ₹{item.price}
          </span>

          <button
            type="button"
            onClick={() => onAdd(item)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white transition hover:bg-amber-600"
            aria-label={`Add ${item.name}`}
          >
            <Plus className="h-5 w-5" />
          </button>

        </div>
      </div>
    </article>
  );
}