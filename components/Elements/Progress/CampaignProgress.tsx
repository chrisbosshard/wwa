import { MainCutoutProgress } from "@elements/MainCutout/MainCutoutProgress";
import { countGrantedWishes, resolveProgressValue, shouldShowProgress, type ProgressDisplayConfig } from "@lib/directus/progress";
import { useCart } from "@/components/providers/CartProvider";
import { cn } from "@/lib/utils";

type Props = {
  config: ProgressDisplayConfig;
  wishLimit?: number;
  date: string;
  completedKids?: number;
  registeredKids?: number;
  fixedWishCount?: number | null;
  className?: string;
};

export function CampaignProgress({
  config,
  wishLimit: wishLimitProp,
  date,
  completedKids,
  registeredKids,
  fixedWishCount: fixedWishCountProp,
  className,
}: Props) {
  const { kids, wishLimit: wishLimitFromCart, fixedWishCount: fixedWishCountFromCart } = useCart();
  const wishLimit = wishLimitProp ?? wishLimitFromCart;
  const fixedWishCount = fixedWishCountProp ?? fixedWishCountFromCart;
  const grantedCount = completedKids ?? countGrantedWishes(kids);
  const registeredCount = registeredKids ?? kids.length;

  if (!shouldShowProgress(config, wishLimit)) return null;

  const value = resolveProgressValue(config, grantedCount, registeredCount, wishLimit, fixedWishCount);

  return (
    <div className={cn("mt-8 md:mt-10 mb-8 md:mb-10", className)}>
      <MainCutoutProgress
        title={config.progress_title!}
        date={date}
        value={value}
        max={wishLimit}
      />
    </div>
  );
}
