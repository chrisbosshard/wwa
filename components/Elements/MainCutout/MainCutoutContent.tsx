"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@elements/Button/Button";
import { MainCutoutProgress } from "@elements/MainCutout/MainCutoutProgress";
import CmsHtml from "@elements/MainCutout/CmsHtml";
import { fetchCampaignContent } from "@lib/directus/api-client";
import { mergeCampaignContent } from "@lib/directus/campaign-content-defaults";
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
    <div className={cn("main-cutout-cta", alignedWithProgress && "main-cutout-cta--progress")}>
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

function resolveProgressValue(
  content: Omit<CampaignContent, "id">,
  completedKids: number,
  registeredKids: number
) {
  switch (content.progress_value_source) {
    case "completed_kids":
      return completedKids;
    case "registered_kids":
      return registeredKids;
    case "fixed":
      return content.progress_fixed_value ?? 0;
    default:
      return 0;
  }
}

const MainCutoutContent = ({
  appState,
  initialContent,
  date,
  completedKids,
  registeredKids,
}: Props) => {
  const state = appState || "registration";
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
      return mergeCampaignContent(state, cmsByState[state]);
    }
    if (initialContent?.state === state) {
      return initialContent;
    }
    return mergeCampaignContent(state, undefined);
  }, [state, cmsByState, initialContent]);

  const progressValue = resolveProgressValue(content, completedKids, registeredKids);
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

  const showProgress = Boolean(content.show_progress && content.progress_title && content.progress_max);
  const progressCta = showProgress && buttons[0] ? buttons[0] : null;
  const actionButtons = progressCta ? buttons.slice(1) : buttons;

  return (
    <>
      {content.show_page_title !== false && content.page_title && (
        <h1 className="main-cutout-heading">{content.page_title}</h1>
      )}

      <CmsHtml html={content.lead || ""} className="main-cutout-lead cms-body" />

      <CutoutCta buttons={progressCta ? [progressCta] : []} alignedWithProgress />

      {showProgress ? (
        <MainCutoutProgress
          title={content.progress_title!}
          date={date}
          value={progressValue}
          max={content.progress_max!}
        />
      ) : null}

      <CmsHtml html={content.body || ""} className="main-cutout-text cms-body" />

      <CutoutCta buttons={actionButtons} />
    </>
  );
};

export default MainCutoutContent;
