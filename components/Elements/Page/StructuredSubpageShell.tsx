import Page from "@elements/Page/Page";
import Footer from "@sections/Footer/Footer";
import StructuredSubpage from "@elements/Page/StructuredSubpage";
import type { StructuredPageContent } from "@lib/directus/schema";

type Props = {
  content: StructuredPageContent;
  children?: React.ReactNode;
  afterLead?: React.ReactNode;
};

export default function StructuredSubpageShell({ content, children, afterLead }: Props) {
  return (
    <>
      <Page
        title={content.title}
        image={content.icon || undefined}
        breadcrumbs={[
          { label: "Weihnachtswunschaktion", href: "/" },
          { label: content.title },
        ]}
      >
        <StructuredSubpage
          content={content}
          appState={null}
          leadClassName={content.icon ? "pr-[clamp(4.5rem,10vw,7.5rem)]" : undefined}
          afterLead={afterLead}
        />
        {children}
      </Page>
      <Footer />
    </>
  );
}
