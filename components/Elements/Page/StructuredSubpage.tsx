"use client";

import { CampaignProgress } from "@elements/Progress/CampaignProgress";
import { Button } from "@elements/Button/Button";
import CmsHtml from "@elements/MainCutout/CmsHtml";
import { getStateBlockForAppState } from "@lib/directus/page-defaults";
import { countCompletedKids, getSubpageProgressConfig } from "@lib/directus/progress";
import type { PageButton, PageLayout, PageSection, StructuredPageContent } from "@lib/directus/schema";
import { cmsBody } from "@/lib/ui-classes";
import { useCart } from "@/components/providers/CartProvider";
import { getToday } from "@scripts/getToday";
import { cn } from "@/lib/utils";

const cmsLinkStyles =
  "[&_a]:cursor-pointer [&_a]:font-semibold [&_a]:text-caritas-red [&_a]:underline hover:[&_a]:text-caritas-red-dark";

const PHASE_MESSAGE_STATES = new Set([
  "pre_registration",
  "registration",
  "post_registration",
  "waitinglist",
]);

type Props = {
  content: StructuredPageContent;
  appState?: string | null;
  leadClassName?: string;
  showButtons?: boolean;
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
    <div className="mt-6 flex flex-col justify-center gap-4 lg:mb-12 lg:flex-row lg:gap-2">
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

function PageCopySection({
  content,
  appState,
  leadClassName,
}: {
  content: StructuredPageContent;
  appState: string | null | undefined;
  leadClassName?: string;
}) {
  const stateBlock = getStateBlockForAppState(content, appState);
  const closedUsesStateBlockCopy =
    appState === "closed" &&
    Boolean(stateBlock?.headline || stateBlock?.lead || stateBlock?.body);

  if (closedUsesStateBlockCopy) return null;
  if (!content.lead && !content.body) return null;

  return (
    <>
      <LeadBlock content={content} className={leadClassName} />
      {content.body && (
        <CmsHtml html={content.body} className={cn(cmsBody, cmsLinkStyles, "mb-8 md:mb-10")} />
      )}
    </>
  );
}

function StateBlockCopy({
  content,
  appState,
  leadClassName,
}: {
  content: StructuredPageContent;
  appState: string | null | undefined;
  leadClassName?: string;
}) {
  const stateBlock = getStateBlockForAppState(content, appState);
  if (!stateBlock) return null;

  const leadStyles =
    "mb-8 max-w-none font-sans text-[1.375rem] font-normal leading-[1.6] tracking-[0.0375rem] text-[#242424] md:mb-10 xl:text-[1.5625rem]";

  const stateBlockHasCopy = Boolean(stateBlock.headline || stateBlock.lead || stateBlock.body);
  const showStateBlockCopy =
    Boolean(appState && stateBlockHasCopy) &&
    (appState === "closed" || PHASE_MESSAGE_STATES.has(appState!));

  if (!showStateBlockCopy) return null;

  return (
    <>
      {stateBlock.headline && (
        <p className="my-8 text-center text-2xl font-bold text-[#333333] md:my-10 md:text-3xl">{stateBlock.headline}</p>
      )}

      {stateBlock.lead && (
        <CmsHtml html={stateBlock.lead} className={cn(leadStyles, cmsLinkStyles, leadClassName)} />
      )}

      {stateBlock.body && (
        <CmsHtml
          html={stateBlock.body}
          className={cn(
            stateBlock.lead
              ? cn(cmsBody, "mb-8 md:mb-10")
              : cn(
                  "mx-auto mb-8 max-w-3xl text-base leading-[1.65] text-[#444444] md:mb-10",
                  stateBlock.headline ? "text-center" : cmsBody,
                ),
            cmsLinkStyles,
          )}
        />
      )}
    </>
  );
}

function StateBlockSection({
  content,
  appState,
  wishLimit,
  completedKids,
  registeredKids,
}: {
  content: StructuredPageContent;
  appState: string | null | undefined;
  wishLimit: number;
  completedKids: number;
  registeredKids: number;
}) {
  const stateBlock = getStateBlockForAppState(content, appState);
  const progressConfig = getSubpageProgressConfig(content.slug, appState);

  return (
    <>
      {progressConfig && (
        <CampaignProgress
          config={progressConfig}
          wishLimit={wishLimit}
          date={getToday()}
          completedKids={completedKids}
          registeredKids={registeredKids}
        />
      )}

      {stateBlock?.button_label && stateBlock.button_url && (
        <div className="mb-8 flex flex-wrap justify-center gap-4 md:mb-10">
          <Button
            {...(stateBlock.button_url.startsWith("http")
              ? { externalLink: stateBlock.button_url }
              : { innerLink: stateBlock.button_url })}
            className="mx-0 rounded-full border-0"
          >
            {stateBlock.button_label}
          </Button>
        </div>
      )}
    </>
  );
}

function LeadBlock({ content, className }: { content: StructuredPageContent; className?: string }) {
  if (!content.lead) return null;

  return (
    <CmsHtml
      html={content.lead}
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
  children,
}: Props) => {
  const layout = content.layout || "simple";
  const hasStateBlocks = content.state_blocks.length > 0;
  const { wishLimit, kids } = useCart();
  const completedKids = countCompletedKids(kids);
  const registeredKids = kids.length;

  if (layout === "simple" && !hasStateBlocks) {
    return (
      <div className="max-w-none">
        <LeadBlock content={content} className={leadClassName} />
        {content.body && <CmsHtml html={content.body} className={cn(cmsBody, cmsLinkStyles)} />}
        {showButtons && <PageButtons buttons={content.buttons} />}
        <FootnoteBlock content={content} />
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-none">
      {!hasStateBlocks && <LeadBlock content={content} className={leadClassName} />}
      {!hasStateBlocks && content.body && (
        <CmsHtml html={content.body} className={cn(cmsBody, cmsLinkStyles)} />
      )}

      {hasStateBlocks && (
        <PageCopySection content={content} appState={appState} leadClassName={leadClassName} />
      )}

      <SectionsGrid layout={layout} sections={content.sections} />

      {hasStateBlocks && (
        <StateBlockSection
          content={content}
          appState={appState}
          wishLimit={wishLimit}
          completedKids={completedKids}
          registeredKids={registeredKids}
        />
      )}

      {hasStateBlocks && (
        <StateBlockCopy content={content} appState={appState} leadClassName={leadClassName} />
      )}

      {layout !== "simple" && content.body && (
        <CmsHtml html={content.body} className={cn("mt-8", cmsBody, cmsLinkStyles)} />
      )}

      {showButtons && <PageButtons buttons={content.buttons} />}
      <FootnoteBlock content={content} />
      {children}
    </div>
  );
};

export default StructuredSubpage;
