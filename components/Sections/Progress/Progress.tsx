type Props = {
  title: string;
  value: number;
  max: number;
  date: string;
  align?: "left" | "center";
};

export const Progress = ({ title, value, date, max, align = "center" }: Props) => {
  const percentage = Math.min(Math.floor((value / max) * 100), 100);
  const displayValue = Math.min(value, max);
  const alignClass = align === "left" ? "text-left" : "text-center";

  return (
    <div className={`mx-auto mb-10 max-w-[560px] ${alignClass} ${align === "left" ? "mr-auto ml-0" : ""}`}>
      <p className="text-lg font-semibold text-caritas-gray-800">{title}</p>
      <p className="mt-1 text-sm text-[#666]">{date}</p>
      <div className="mt-4 h-8 overflow-hidden rounded-full bg-gray-200">
        <div
          className="flex h-full items-center justify-end rounded-full bg-caritas-red pr-3 text-sm font-bold text-white transition-all duration-500"
          style={{ width: `${percentage}%` }}
        >
          {percentage >= 12 ? displayValue : null}
        </div>
      </div>
      <p className="mt-2 text-sm text-[#666]">
        {displayValue} von {max} ({percentage}%)
      </p>
    </div>
  );
};
