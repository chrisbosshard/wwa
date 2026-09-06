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
        <p className="text-lg font-bold text-[#242424] md:text-xl">{title}</p>
        <p className="shrink-0 text-sm text-[#575656] md:text-base">{date}</p>
      </div>
      <div
        className="rounded-full bg-white px-4 py-4 shadow-regio-pill md:px-6 md:py-5"
        role="progressbar"
        aria-label={title}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={displayValue}
        aria-valuetext={`${displayValue} von ${max}`}
      >
        <div className="relative h-12 overflow-hidden rounded-full bg-white md:h-14">
          <div
            className="relative z-10 flex h-full min-w-[3.5rem] items-center justify-end rounded-full bg-caritas-red pr-4 text-base font-bold text-white md:min-w-[4rem] md:pr-5 md:text-lg"
            style={{ width: `${Math.max(percentage, displayValue > 0 ? 8 : 0)}%` }}
          >
            {displayValue}
          </div>
          <span className="absolute inset-y-0 right-4 flex items-center text-sm font-bold text-[#575656] md:right-5 md:text-base">
            von {max}
          </span>
        </div>
      </div>
    </div>
  );
};
