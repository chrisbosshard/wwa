"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@elements/Button/Button";
import { CampaignProgress } from "@elements/Progress/CampaignProgress";
import CmsHtml from "@elements/MainCutout/CmsHtml";
import { useCart } from "@/components/providers/CartProvider";
import { fetchCampaignContent } from "@lib/directus/api-client";
import { normalizeCampaignContent } from "@lib/directus/campaign-content-defaults";
import { shouldShowProgress } from "@lib/directus/progress";
import type { CampaignContent } from "@lib/directus/schema";
import { cn } from "@/lib/utils";

type CutoutButton = {
  label: string | null | undefined;
  url: string | null | undefined;
  external?: boolean;
  style?: string | null;
};

const CUTOUT_BUTTON_CLASS =
  "mx-0 inline-flex min-h-11 items-center justify-center rounded-full px-8 py-3 text-base font-semibold";

function CutoutCta({
  buttons,
  alignedWithProgress = false,
}: {
  buttons: CutoutButton[];
  alignedWithProgress?: boolean;
}) {
  if (!buttons.length) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 md:gap-6",
        alignedWithProgress && "mx-auto w-full max-w-4xl",
      )}
    >
      {buttons.map((button, index) => (
        <Button
          key={`${button.label}-${index}`}
          className={cn(CUTOUT_BUTTON_CLASS, button.style === "outline" ? "border-2" : "border-0")}
          color={button.style === "outline" ? "outline" : "primary"}
          {...(button.external ? { externalLink: button.url! } : { innerLink: button.url! })}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}

type Props = {
  appState: string | null;
  initialContent?: Omit<CampaignContent, "id">;
  date: string;
  completedKids: number;
  registeredKids: number;
};

const MainCutoutContent = ({
  appState,
  initialContent,
  date,
  completedKids,
  registeredKids,
}: Props) => {
  const state = appState || "registration";
  const { wishLimit, fixedWishCount } = useCart();
  const [cmsByState, setCmsByState] = useState<Record<string, CampaignContent>>({});

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const { content } = await fetchCampaignContent(state);
        if (cancelled || !content) return;

        const item = Array.isArray(content)
          ? content.find((entry) => entry?.state === state)
          : content;

        if (!item?.state) return;

        setCmsByState((current) => ({ ...current, [item.state]: item }));
      } catch (error) {
        console.error("Failed to load campaign content", error);
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, [state]);

  const content = useMemo(() => {
    if (cmsByState[state]) {
      return normalizeCampaignContent(state, cmsByState[state]);
    }
    if (initialContent?.state === state) {
      return initialContent;
    }
    return null;
  }, [state, cmsByState, initialContent]);

  if (!content) return null;

  const buttons = [
    {
      label: content.button_1_label,
      url: content.button_1_url,
      external: content.button_1_external,
      style: content.button_1_style,
    },
    {
      label: content.button_2_label,
      url: content.button_2_url,
      external: content.button_2_external,
      style: content.button_2_style,
    },
    {
      label: content.button_3_label,
      url: content.button_3_url,
      external: content.button_3_external,
      style: content.button_3_style,
    },
  ].filter((button) => button.label && button.url);

  const showProgress = shouldShowProgress(content, wishLimit);
  const progressCta = showProgress && buttons[0] ? buttons[0] : null;
  const actionButtons = progressCta ? buttons.slice(1) : buttons;

  return (
    <div className="flex flex-col gap-8 pb-8 md:gap-10 md:pb-10">
      {content.show_page_title !== false && content.page_title && (
        <h1 className="mb-6 font-sans text-[2rem] font-bold leading-tight text-[#333333] md:mb-8 md:text-[2.5rem] md:leading-[1.15]">
          {content.page_title}
        </h1>
      )}

      <CmsHtml
        html={content.lead || ""}
        className="mb-0 max-w-none font-sans text-[1.375rem] font-normal leading-[1.6] tracking-[0.0375rem] text-[#242424] xl:text-[1.5625rem] [&_p+p]:mt-4 [&_p]:mb-0 [&_p]:leading-[inherit] [&_p]:tracking-[inherit] [&_p]:text-inherit [&_strong]:mb-0 [&_strong]:font-medium [&_strong]:text-inherit"
      />

      <CutoutCta buttons={progressCta ? [progressCta] : []} alignedWithProgress />

      <CampaignProgress
        config={content}
        wishLimit={wishLimit}
        fixedWishCount={fixedWishCount}
        date={date}
        completedKids={completedKids}
        registeredKids={registeredKids}
        className="mb-8 mt-0 md:mb-10"
      />

      <CmsHtml
        html={content.body || ""}
        className="mb-0 max-w-3xl text-base leading-[1.65] text-[#444444] [&_p+p]:mt-4 [&_p]:mb-0"
      />

      <CutoutCta buttons={actionButtons} />
    </div>
  );
};

export default MainCutoutContent;
