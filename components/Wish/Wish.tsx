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
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm${onSelect ? " cursor-pointer transition-shadow hover:shadow-md" : ""}`}
      onClick={onSelect && wish.id ? () => onSelect(wish.id!) : undefined}
      role={onSelect ? "button" : undefined}
    >
      <div className="p-4 pb-0">
        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
          <img src={picture} alt={wish.description} className="h-full w-full object-cover" />
        </div>
      </div>
      {!small && <h3 className="p-4 text-base font-semibold text-caritas-gray-800">{wish.description}</h3>}
    </div>
  );
};

export default Wish;
