import Footer from "@sections/Footer/Footer";
import type { DisplaySponsor } from "@lib/directus/sponsors";

type Props = {
  topSponsors?: DisplaySponsor[];
  otherSponsors?: DisplaySponsor[];
};

export default function SiteFooter({ topSponsors, otherSponsors }: Props) {
  return <Footer topSponsors={topSponsors} otherSponsors={otherSponsors} />;
}
