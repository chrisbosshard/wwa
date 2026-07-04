export type ApplicationState =
  | "pre_registration"
  | "registration"
  | "waitinglist"
  | "post_registration"
  | "wish_fulfilment"
  | "closed";

export interface DirectusFile {
  id: string;
  filename_download?: string;
}

export interface Category {
  id: string;
  name: string;
  wishes?: { id: string }[];
}

export interface Wish {
  id: string;
  description: string;
  age_range?: number;
  active?: boolean;
  code?: string;
  link?: string;
  article?: string;
  voucher?: boolean;
  year?: string;
  individual?: boolean;
  to_check?: boolean;
  image?: DirectusFile | string | null;
  category?: Category | string | null;
}

export interface Family {
  id: string;
  prename?: string;
  surname?: string;
  street?: string;
  nr?: string;
  zipcode?: string;
  city?: string;
  email?: string;
  phone?: string;
  comment?: string;
  leginr?: string;
  origin?: string;
  contact_permission?: boolean;
  image?: DirectusFile | string | null;
}

export interface Donor {
  id: string;
  titel?: string;
  prename?: string;
  surname?: string;
  address?: string;
  zipcode?: string;
  city?: string;
  email?: string;
  public?: string;
  number_of_gifts?: number;
  payment_successful?: string;
  manual_upload?: boolean;
  logo?: DirectusFile | string | null;
}

export interface Kid {
  id: string;
  date_created?: string;
  prename?: string;
  age?: number;
  active?: boolean;
  checkout?: string | null;
  completed?: boolean;
  code?: string;
  wish?: Wish | string | null;
  family?: Family | string | null;
  donor?: Donor | string | null;
}

export interface Application {
  state: ApplicationState;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  body?: string;
  hero_image?: DirectusFile | string | null;
  sort_order?: number;
}

export interface Sponsor {
  id: string;
  name: string;
  link?: string;
  logo?: DirectusFile | string | null;
  featured?: boolean;
}

export interface GlobalSetting {
  site_logo?: DirectusFile | string | null;
  hero_logo?: DirectusFile | string | null;
  site_logo_white?: DirectusFile | string | null;
  address?: string;
  email?: string;
  contact?: string;
  registration_limit?: number;
}

/** Hygraph-compatible shapes used by existing components */
export interface LegacyImage {
  url: string;
}

export interface LegacyKid {
  id: string;
  createdAt?: string;
  age?: number;
  prename?: string;
  active?: boolean;
  checkout?: string | null;
  completed?: boolean;
  code?: string;
  wish?: LegacyWish | null;
  family?: LegacyFamily | null;
  donor?: LegacyDonor | null;
}

export interface LegacyWish {
  id?: string;
  code?: string;
  link?: string;
  article?: string;
  active?: boolean;
  description?: string;
  voucher?: boolean;
  ageRange?: number;
  category?: { name?: string; id?: string };
  image?: LegacyImage | null;
}

export interface LegacyFamily {
  id?: string;
  prename?: string;
  surname?: string;
  street?: string;
  email?: string;
  phone?: string;
  nr?: string;
  zipcode?: string;
  city?: string;
  comment?: string;
  leginr?: string;
  origin?: string;
  contactPermission?: boolean;
}

export interface LegacyDonor {
  prename?: string;
  surname?: string;
  public?: string;
  paymentSuccessful?: string;
  manualUpload?: boolean;
  logo?: LegacyImage | null;
}

export interface LegacyWishesResponse {
  wishes: LegacyWish[];
  categories: Category[];
}

export interface LegacyKidsConnection {
  connection: {
    edges: { cursor: string; node: LegacyKid }[];
    pageInfo: { hasNextPage: boolean };
  };
}
