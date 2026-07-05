"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { CampaignProgress } from "@elements/Progress/CampaignProgress";
import { Button } from "@elements/Button/Button";
import CmsHtml from "@elements/MainCutout/CmsHtml";
import {
  getStateBlockForAppState,
  resolveEffectivePageContent,
  type EffectivePageContent,
} from "@lib/directus/page-defaults";
import { countCompletedKids, getSubpageProgressConfig } from "@lib/directus/progress";
import type { PageButton, PageLayout, PageSection, StructuredPageContent } from "@lib/directus/schema";
import { cmsBody } from "@/lib/ui-classes";
import { useCart } from "@/components/providers/CartProvider";
import { getToday } from "@scripts/getToday";
import { cn } from "@/lib/utils";

const cmsLinkStyles =
  "[&_a]:cursor-pointer [&_a]:font-semibold [&_a]:text-caritas-red [&_a]:underline hover:[&_a]:text-caritas-red-dark";

type Props = {
  content: StructuredPageContent;
  appState?: string | null;
  leadClassName?: string;
  showButtons?: boolean;
  afterLead?: React.ReactNode;
  children?: React.ReactNode;
};

function SectionColumn({ sections, compact }: { sections: PageSection[]; compact?: boolean }) {
  return (
    <>
      {sections.map((section) => (
        <div
          key={section.id}
          className={cn(
            "text-base leading-[1.65] text-[#444444]",
            compact ? "[&+&]:mt-4" : "[&+&]:mt-6",
            cmsLinkStyles,
          )}
        >
          <span className="mb-2 block text-base font-bold text-[#333333]">{section.title}</span>
          <CmsHtml html={section.body || ""} />
        </div>
      ))}
    </>
  );
}

function PageButtons({ buttons }: { buttons: PageButton[] }) {
  if (!buttons.length) return null;

  return (
    <div className="mt-10 flex flex-col justify-center gap-4 md:mt-12 lg:mb-12 lg:flex-row lg:gap-6">
      {buttons.map((button) => (
        <Button
          key={button.id}
          {...(button.external
            ? { externalLink: button.url }
            : { innerLink: button.url.startsWith("/") ? button.url : `/${button.url}` })}
          color={button.style === "outline" ? "outline" : "primary"}
          className="mx-0"
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
}

function EffectivePageCopy({
  effective,
  leadClassName,
}: {
  effective: EffectivePageContent;
  leadClassName?: string;
}) {
  if (!effective.lead && !effective.body) return null;

  const leadStyles =
    "mb-8 max-w-none font-sans text-[1.375rem] font-normal leading-[1.6] tracking-[0.0375rem] text-[#242424] md:mb-10 xl:text-[1.5625rem]";

  return (
    <>
      {effective.lead && (
        <CmsHtml html={effective.lead} className={cn(leadStyles, cmsLinkStyles, leadClassName)} />
      )}

      {effective.body && (
        <CmsHtml
          html={effective.body}
          className={cn(
            effective.lead ? cn(cmsBody, "mb-8 md:mb-10") : cn(cmsBody, "mb-8 md:mb-10"),
            cmsLinkStyles,
          )}
        />
      )}
    </>
  );
}

function StateBlockNotification({ notification }: { notification: string | null }) {
  if (!notification) return null;

  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#d0d0d0] bg-[#fafafa] px-5 py-4 md:gap-5 md:px-6">
      <InformationCircleIcon
        className="h-[50px] w-[50px] max-h-[50px] max-w-[50px] shrink-0 text-[#666666]"
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-left text-base font-semibold leading-snug text-[#333333] md:text-lg">
          {notification}
        </p>
      </div>
    </div>
  );
}

function StateBlockButtons({
  content,
  appState,
}: {
  content: StructuredPageContent;
  appState: string | null | undefined;
}) {
  const stateBlock = getStateBlockForAppState(content, appState);
  if (!stateBlock?.button_label || !stateBlock.button_url) return null;

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-4 md:mb-0">
      <Button
        {...(stateBlock.button_url.startsWith("http")
          ? { externalLink: stateBlock.button_url }
          : { innerLink: stateBlock.button_url })}
        className="mx-0 rounded-full border-0"
      >
        {stateBlock.button_label}
      </Button>
    </div>
  );
}

function SubpageProgress({
  content,
  appState,
  wishLimit,
  fixedWishCount,
  completedKids,
  registeredKids,
}: {
  content: StructuredPageContent;
  appState: string | null | undefined;
  wishLimit: number;
  fixedWishCount: number | null;
  completedKids: number;
  registeredKids: number;
}) {
  const progressConfig = getSubpageProgressConfig(content.slug, appState);
  if (!progressConfig) return null;

  return (
    <CampaignProgress
      config={progressConfig}
      wishLimit={wishLimit}
      fixedWishCount={fixedWishCount}
      date={getToday()}
      completedKids={completedKids}
      registeredKids={registeredKids}
      className="m-0"
    />
  );
}

function LeadBlock({ lead, className }: { lead: string | null; className?: string }) {
  if (!lead) return null;

  return (
    <CmsHtml
      html={lead}
      className={cn(
        "mb-8 max-w-none font-sans text-[1.375rem] font-normal leading-[1.6] tracking-[0.0375rem] text-[#242424] md:mb-10 xl:text-[1.5625rem]",
        cmsLinkStyles,
        className,
      )}
    />
  );
}

function FootnoteBlock({ content }: { content: StructuredPageContent }) {
  if (!content.footnote) return null;

  return (
    <CmsHtml
      html={content.footnote}
      className={cn(
        "mt-8 border-t border-[#e5e5e5] pt-8 text-sm leading-relaxed text-[#666666] md:mt-10 md:pt-10",
        cmsLinkStyles,
      )}
    />
  );
}

function SectionsGrid({
  layout,
  sections,
}: {
  layout: PageLayout;
  sections: PageSection[];
}) {
  if (!sections.length) return null;

  if (layout === "one_column") {
    return (
      <div className="max-w-3xl">
        <SectionColumn sections={sections} />
      </div>
    );
  }

  if (layout === "three_column") {
    const col1 = sections.filter((section) => (section.column ?? 1) === 1);
    const col2 = sections.filter((section) => section.column === 2);
    const col3 = sections.filter((section) => section.column === 3);

    return (
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
        {col1.length > 0 && (
          <div>
            <SectionColumn sections={col1} compact />
          </div>
        )}
        {col2.length > 0 && (
          <div>
            <SectionColumn sections={col2} compact />
          </div>
        )}
        {col3.length > 0 && (
          <div>
            <SectionColumn sections={col3} compact />
          </div>
        )}
      </div>
    );
  }

  const leftSections = sections.filter((section) => (section.column ?? 1) === 1);
  const rightSections = sections.filter((section) => section.column === 2);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
      {leftSections.length > 0 && (
        <div>
          <SectionColumn sections={leftSections} />
        </div>
      )}
      {rightSections.length > 0 && (
        <div>
          <SectionColumn sections={rightSections} />
        </div>
      )}
    </div>
  );
}

const StructuredSubpage = ({
  content,
  appState = null,
  leadClassName,
  showButtons = true,
  afterLead,
  children,
}: Props) => {
  const layout = content.layout || "simple";
  const hasStateBlocks = content.state_blocks.length > 0;
  const effective = resolveEffectivePageContent(content, appState);
  const { wishLimit, fixedWishCount, kids } = useCart();
  const completedKids = countCompletedKids(kids);
  const registeredKids = kids.length;

  if (layout === "simple" && !hasStateBlocks) {
    return (
      <div className="max-w-none">
        <LeadBlock lead={content.lead ?? null} className={leadClassName} />
        {afterLead}
        {content.body && <CmsHtml html={content.body} className={cn(cmsBody, cmsLinkStyles)} />}
        {showButtons && <PageButtons buttons={content.buttons} />}
        <FootnoteBlock content={content} />
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-none">
      {!hasStateBlocks && <LeadBlock lead={content.lead ?? null} className={leadClassName} />}
      {!hasStateBlocks && afterLead}
      {!hasStateBlocks && content.body && (
        <CmsHtml html={content.body} className={cn(cmsBody, cmsLinkStyles)} />
      )}

      {hasStateBlocks && (
        <EffectivePageCopy effective={effective} leadClassName={leadClassName} />
      )}

      {hasStateBlocks ? (
        <div className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-10">
          <SectionsGrid layout={layout} sections={content.sections} />

          <SubpageProgress
            content={content}
            appState={appState}
            wishLimit={wishLimit}
            fixedWishCount={fixedWishCount}
            completedKids={completedKids}
            registeredKids={registeredKids}
          />

          <StateBlockNotification notification={effective.notification} />

          <StateBlockButtons content={content} appState={appState} />
        </div>
      ) : (
        <SectionsGrid layout={layout} sections={content.sections} />
      )}

      {layout !== "simple" && !hasStateBlocks && content.body && (
        <CmsHtml html={content.body} className={cn("mt-8", cmsBody, cmsLinkStyles)} />
      )}

      {showButtons && <PageButtons buttons={content.buttons} />}
      <FootnoteBlock content={content} />
      {children}
    </div>
  );
};

export default StructuredSubpage;
