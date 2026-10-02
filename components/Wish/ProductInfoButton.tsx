import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Button } from "@elements/Button/Button";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  className?: string;
};

export function ProductInfoButton({ href, className }: Props) {
  return (
    <Button color="outline" externalLink={href} className={cn("mx-0 w-full justify-center gap-2", className)}>
      Weitere Informationen
      <ArrowUpRightIcon className="h-4 w-4 shrink-0" aria-hidden />
    </Button>
  );
}
