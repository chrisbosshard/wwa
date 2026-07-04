// COMPONENTS
import clsx from "clsx";

// TYPES
type Props = {
  step: number;
};

// DATA
const data = ["KulturLegi", "Kinder Hinzufügen", "Wünsche Auswählen", "Familienangaben", "Bemerkungen"];

// *****************************************************
// IMAGE LINK COMPONENT
// *****************************************************
export const Process = (props: Props) => {
  // PROPS
  const { step } = props;

  // *****************************************************

  // RENDER
  return (
    <div className="relative mb-20 mt-8 flex w-full border-b-2 border-gold-300 text-gold-300">
      {data.map((item, index) => {
        const active = index + 1 > step ? "bg-[#172b3f] border-gold-300 border-2 hidden lg:block" : "bg-gold-300";
        const clsBall = clsx("absolute -bottom-4 mt-4 h-8 w-8 rounded-full", active);
        const clsText = index + 1 > step ? "opacity-30 text-sm" : "text-sm";

        return (
          <div key={index} className="hidden flex-1 flex-col items-center pb-8 lg:flex">
            <p className={clsText}>Schritt {index + 1}</p>
            <p className={clsx(clsText, "font-bold")}>{item}</p>
            <div className={clsBall} />
          </div>
        );
      })}
    </div>
  );
};
