// @ts-nocheck
import {
  createDirectusClient,
  readItems,
  readSingleton,
  createItem,
  updateItem,
} from "./client";
import { mapKid, mapWish } from "./transform";
import type { LegacyKid, LegacyKidsConnection, LegacyWishesResponse } from "./schema";

const KID_FIELDS = [
  "*",
  "wish.*",
  "wish.image.*",
  "wish.category.*",
  "family.*",
  "donor.*",
  "donor.logo.*",
];

export async function fetchApplication() {
  const client = createDirectusClient();
  return client.request(readSingleton("application", { fields: ["state"] }));
}

export async function fetchGlobalSettings() {
  const client = createDirectusClient();
  return client.request(readSingleton("global_setting", { fields: ["*"] }));
}

export async function fetchKidsPage(after: number, time: string, limit = 1000): Promise<LegacyKidsConnection> {
  const client = createDirectusClient();
  const items = await client.request(
    readItems("kid", {
      filter: {
        active: { _eq: true },
        date_created: { _gt: time },
      } as Record<string, unknown>,
      fields: KID_FIELDS,
      sort: ["-id"],
      limit,
      offset: after,
    })
  );

  const mapped = items.map(mapKid);
  const hasNextPage = items.length === limit;

  return {
    connection: {
      edges: mapped.map((node, i) => ({
        cursor: String(after + i + 1),
        node,
      })),
      pageInfo: { hasNextPage },
    },
  };
}

export async function fetchAllKids(time: string): Promise<LegacyKid[]> {
  let offset = 0;
  const all: LegacyKid[] = [];
  let hasNext = true;

  while (hasNext) {
    const page = await fetchKidsPage(offset, time);
    all.push(...page.connection.edges.map((e) => e.node));
    hasNext = page.connection.pageInfo.hasNextPage;
    offset += 1000;
  }

  return all;
}

export async function fetchWishes(): Promise<LegacyWishesResponse> {
  const client = createDirectusClient();
  const [wishes, categories] = await Promise.all([
    client.request(
      readItems("wish", {
        filter: { active: { _eq: true } },
        fields: ["*", "image.*", "category.*"],
        limit: 1000,
      })
    ),
    client.request(
      readItems("category", {
        fields: ["id", "name", "wishes.id"],
        limit: 100,
      })
    ),
  ]);

  return {
    wishes: wishes.map((w) => mapWish(w)).filter(Boolean) as LegacyWishesResponse["wishes"],
    categories: categories as LegacyWishesResponse["categories"],
  };
}

export async function blockKid(id: string, checkout: string | null) {
  const client = createDirectusClient();
  return client.request(updateItem("kid", id, { checkout }));
}

export async function createDonor(data: Record<string, unknown>) {
  const client = createDirectusClient();
  return client.request(
    createItem("donor", {
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
    })
  );
}

export async function updateDonorPayment(id: string) {
  const client = createDirectusClient();
  return client.request(updateItem("donor", id, { payment_successful: "Yes" }));
}

export async function connectKidToDonor(kidId: string, donorId: string) {
  const client = createDirectusClient();
  return client.request(
    updateItem("kid", kidId, {
      donor: donorId,
      completed: true,
    })
  );
}

export async function createWish(data: Record<string, unknown>) {
  const client = createDirectusClient();
  return client.request(
    createItem("wish", {
      description: data.description,
      link: data.link,
      active: data.active ?? false,
      year: data.year ?? "2026",
      individual: data.individual ?? true,
      to_check: data.toCheck ?? true,
    })
  );
}

export async function createFamilyWithKids(
  familyData: Record<string, unknown>,
  kids: { prename: string; age: number; wishId: string }[],
  imageId?: string | null
) {
  const client = createDirectusClient();
  const family = await client.request(
    createItem("family", {
      prename: familyData.prename,
      surname: familyData.surname,
      street: familyData.street,
      nr: familyData.nr,
      zipcode: familyData.zipcode,
      city: familyData.city,
      email: familyData.email,
      phone: familyData.phone,
      comment: familyData.comment,
      leginr: familyData.leginr,
      origin: familyData.origin,
      contact_permission: familyData.contactPermission,
      image: imageId || null,
    })
  );

  for (const kid of kids) {
    await client.request(
      createItem("kid", {
        prename: kid.prename,
        age: kid.age,
        active: true,
        family: family.id,
        wish: kid.wishId,
      })
    );
  }

  return family;
}

export async function updateKid(id: string, data: Record<string, unknown>) {
  const client = createDirectusClient();
  return client.request(updateItem("kid", id, data));
}

export async function fetchPageBySlug(slug: string) {
  const client = createDirectusClient();
  const pages = await client.request(
    readItems("page", {
      filter: { slug: { _eq: slug } },
      fields: ["*", "hero_image.*"],
      limit: 1,
    })
  );
  return pages[0] || null;
}

export async function fetchSponsors() {
  const client = createDirectusClient();
  return client.request(
    readItems("sponsor", {
      fields: ["*", "logo.*"],
      sort: ["name"],
      limit: 100,
    })
  );
}
