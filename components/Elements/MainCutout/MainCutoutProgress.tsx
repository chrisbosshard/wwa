type Props = {
  title: string;
  date: string;
  value: number;
  max: number;
};

export const MainCutoutProgress = ({ title, date, value, max }: Props) => {
  const percentage = Math.min(Math.floor((value / max) * 100), 100);
  const displayValue = Math.min(value, max);

  return (
    <div className="mx-auto mb-0 w-full max-w-4xl">
      <div className="mb-4 flex items-baseline justify-between gap-4 px-6 md:mb-5 md:px-10">
        <p className="text-lg font-bold text-[#333333] md:text-xl">{title}</p>
        <p className="shrink-0 text-sm text-[#666666] md:text-base">{date}</p>
      </div>
      <div className="rounded-full bg-white px-4 py-4 shadow-regio-pill md:px-6 md:py-5">
        <div className="h-11 overflow-hidden rounded-full bg-white md:h-12">
          <div
            className="flex h-full min-w-[3rem] items-center justify-end rounded-full bg-caritas-red pr-4 text-sm font-bold text-white transition-all duration-500"
            style={{ width: `${Math.max(percentage, displayValue > 0 ? 8 : 0)}%` }}
          >
            {displayValue}
          </div>
        </div>
      </div>
    </div>
  );
};
