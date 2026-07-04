import { MainCutoutProgress } from "@elements/MainCutout/MainCutoutProgress";
import { resolveProgressValue, shouldShowProgress, type ProgressDisplayConfig } from "@lib/directus/progress";
import { cn } from "@/lib/utils";

type Props = {
  config: ProgressDisplayConfig;
  wishLimit: number;
  date: string;
  completedKids: number;
  registeredKids: number;
  className?: string;
};

export function CampaignProgress({
  config,
  wishLimit,
  date,
  completedKids,
  registeredKids,
  className,
}: Props) {
  if (!shouldShowProgress(config, wishLimit)) return null;

  const value = resolveProgressValue(config, completedKids, registeredKids, wishLimit);

  return (
    <div className={cn("mt-8 md:mt-10", className)}>
      <MainCutoutProgress
        title={config.progress_title!}
        date={date}
        value={value}
        max={wishLimit}
      />
    </div>
  );
}
