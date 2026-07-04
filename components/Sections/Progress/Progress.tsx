import { MainCutoutProgress } from "@elements/MainCutout/MainCutoutProgress";

type Props = {
  title: string;
  value: number;
  max: number;
  date: string;
  align?: "left" | "center";
};

/** @deprecated Use CampaignProgress + MainCutoutProgress for consistent styling */
export const Progress = ({ title, value, date, max }: Props) => {
  return (
    <MainCutoutProgress title={title} date={date} value={value} max={max} />
  );
};
