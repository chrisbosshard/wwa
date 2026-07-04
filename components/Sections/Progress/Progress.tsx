// TYPES
type Props = {
  className?: string;
  title: string;
  value: number;
  max: number;
  date: string;
};

// *****************************************************
// IMAGE LINK COMPONENT
// *****************************************************
export const Progress = (props: Props) => {
  // PROPS
  const { title, value, date, max } = props;

  // CALCULATE
  const percentage = Math.min(Math.floor((value / max) * 100), 100);

  const showValue = percentage < 10 ? "" : Math.min(value, max);

  // *****************************************************

  // RENDER
  return (
    <div className="mb-8 w-full text-center">
      <p className="mb-1 mt-0 text-lg font-semibold text-white">{title}</p>
      <p className="mb-4 text-sm font-normal text-gold-300">{date}</p>
      <div className="m-auto w-full rounded-4xl border-4 border-gold-300 lg:w-[500px]">
        <div
          className="mx-1 my-1 flex h-10 items-center justify-end rounded-4xl bg-gold-300 pr-4"
          style={{
            maxWidth: "calc(50px + " + 1 + " * 440px)",
            width: "calc(" + percentage + "% - 8px)",
          }}
        >
          <p className="text-xl font-bold text-darkblue-300">{showValue}</p>
        </div>
      </div>
    </div>
  );
};
