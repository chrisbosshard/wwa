import { cn } from "@/lib/utils";

type Props = {
  wish: {
    id?: string;
    description: string;
    image?: { url?: string };
  };
  small?: boolean;
  onSelect?: (id: string) => void;
};

const Wish = ({ wish, small = false, onSelect }: Props) => {
  const picture = wish.image?.url || "/placeholder.jpg";

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]",
        onSelect && "cursor-pointer",
      )}
      onClick={onSelect && wish.id ? () => onSelect(wish.id!) : undefined}
      role={onSelect ? "button" : undefined}
    >
      <div className="p-4 pb-0">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={picture}
            alt={wish.description}
            className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-105"
          />
        </div>
      </div>
      {!small && <h3 className="p-4 text-base font-semibold text-caritas-gray-800">{wish.description}</h3>}
    </div>
  );
};

export default Wish;
