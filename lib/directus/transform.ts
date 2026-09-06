// @ts-nocheck
import type {
  DirectusFile,
  Donor,
  Family,
  Kid,
  LegacyDonor,
  LegacyFamily,
  LegacyImage,
  LegacyKid,
  LegacyWish,
  Wish,
} from "./schema";
import { getAssetUrl } from "./client";

function mapImage(file: DirectusFile | string | null | undefined): LegacyImage | null {
  const url = getAssetUrl(file, { width: "400", height: "400", fit: "cover" });
  return url ? { url } : null;
}

export function mapWish(wish: Wish | Record<string, unknown> | null | undefined): LegacyWish | null {
  if (!wish || typeof wish === "string") return null;
  return {
    id: wish.id,
    code: wish.code,
    link: wish.link,
    article: wish.article,
    active: wish.active,
    description: wish.description,
    voucher: wish.voucher,
    ageRange: wish.age_range,
    category:
      wish.category && typeof wish.category !== "string"
        ? { id: String(wish.category.id), name: wish.category.name }
        : undefined,
    image: mapImage(wish.image),
  };
}

export function mapFamily(family: Family | null | undefined): LegacyFamily | null {
  if (!family || typeof family === "string") return null;
  return {
    id: family.id,
    prename: family.prename,
    surname: family.surname,
    street: family.street,
    email: family.email,
    phone: family.phone,
    nr: family.nr,
    zipcode: family.zipcode,
    city: family.city,
    comment: family.comment,
    leginr: family.leginr,
    origin: family.origin,
    contactPermission: family.contact_permission,
  };
}

export function mapDonor(donor: Donor | null | undefined): LegacyDonor | null {
  if (!donor || typeof donor === "string") return null;
  return {
    prename: donor.prename,
    surname: donor.surname,
    public: donor.public,
    paymentSuccessful: donor.payment_successful,
    manualUpload: donor.manual_upload,
    logo: mapImage(donor.logo),
  };
}

export function mapKid(kid: Kid | Record<string, unknown>): LegacyKid {
  const wish = kid.wish && typeof kid.wish !== "string" ? mapWish(kid.wish) : null;
  const family = kid.family && typeof kid.family !== "string" ? mapFamily(kid.family) : null;
  const donor = kid.donor && typeof kid.donor !== "string" ? mapDonor(kid.donor) : null;

  return {
    id: kid.id,
    createdAt: kid.date_created,
    age: kid.age,
    prename: kid.prename,
    active: kid.active,
    checkout: kid.checkout,
    completed: kid.completed,
    code: kid.code,
    wish,
    family,
    donor,
  };
}

export function mapDonorInput(data: Record<string, unknown>) {
  return {
    titel: data.titel,
    prename: data.prename,
    surname: data.surname,
    address: data.address,
    zipcode: String(data.zipcode ?? ""),
    city: data.city,
    email: data.email,
    public: data.public,
    number_of_gifts: data.numberOfGifts,
    payment_successful: data.paymentSuccessful ?? "No",
  };
}

export function mapFamilyInput(data: Record<string, unknown>, kids: { prename: string; age: number; wishId: string }[]) {
  return {
    prename: data.prename,
    surname: data.surname,
    street: data.street,
    nr: data.nr,
    zipcode: data.zipcode,
    city: data.city,
    email: data.email,
    phone: data.phone,
    comment: data.comment,
    leginr: data.leginr,
    origin: data.origin,
    contact_permission: data.contactPermission,
    image: data.imageId || undefined,
    kidsPayload: kids,
  };
}
