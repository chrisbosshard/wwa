import { NextResponse } from "next/server";

const CARD_URL = "https://cwebplus.ch/Prod/Kule/api/1.0/de/Card";
const REGIONS = ["ZH", "SH"] as const;
const DATE_PARAMS = ["ExpiresAt", "Birthdate"] as const;

const authHeader = {
  Authorization:
    process.env.CWEBPLUS_TOKEN ||
    "Bearer K/0Lw0ehOifVlesjTxhi0T2zu5Bd4KO0kNws6S0Hby+GK4mUEgz6TqtnR64VaqfRhRJw8APm3NK0t1LKOFddbWoJ72hH0+h8fzWSdm1b0TbPxYezpr7ETgxFkUCsxY+VdQXIn/EZ0WAkaAQm1RWxGPSDRe9m2+1yiCI2mwxICfI=",
};

class CardRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

function isUnavailable(err: unknown) {
  if (err instanceof CardRequestError) {
    return !err.status || err.status === 407 || err.status >= 500;
  }
  return true;
}

function publicCardData(data: unknown) {
  if (!data || typeof data !== "object") return data;
  const card = data as Record<string, unknown>;
  return {
    RCO: card.RCO,
    PersNb: card.PersNb,
    CardNo: card.CardNo,
    ExpiresAt: card.ExpiresAt,
    Valid: card.Valid,
  };
}

function cardUrl(rco: string, persNb: string, isoDate: string, dateParam: (typeof DATE_PARAMS)[number]) {
  const url = new URL(CARD_URL);
  url.searchParams.set("RCO", rco);
  url.searchParams.set("PersNb", persNb);
  url.searchParams.set(dateParam, `${isoDate} 00:00:00`);
  return url;
}

async function fetchCard(
  rco: string,
  persNb: string,
  isoDate: string,
  dateParam: (typeof DATE_PARAMS)[number],
  proxyUrl?: string,
) {
  const url = cardUrl(rco, persNb, isoDate, dateParam);

  if (proxyUrl) {
    const [{ default: axios }, { HttpsProxyAgent }] = await Promise.all([
      import("axios"),
      import("https-proxy-agent"),
    ]);
    try {
      return await axios.get(url.toString(), {
        headers: authHeader,
        timeout: 15000,
        httpsAgent: new HttpsProxyAgent(proxyUrl),
        proxy: false,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new CardRequestError(err.message, err.response?.status);
      }
      throw err;
    }
  }

  const response = await fetch(url, {
    headers: authHeader,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new CardRequestError(`Request failed with status code ${response.status}`, response.status);
  }

  return { status: response.status, data: await response.json() };
}

async function lookupCard(persNb: string, isoDate: string, proxyUrl?: string) {
  const via = proxyUrl ? "proxy" : "direct";
  let unavailable = false;

  for (const rco of REGIONS) {
    for (const dateParam of DATE_PARAMS) {
      try {
        const response = await fetchCard(rco, persNb, isoDate, dateParam, proxyUrl);
        if (response.status === 200) {
          console.log(`✅ ${rco}/${dateParam} (${via})`);
          return { found: true as const, data: response.data };
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.log(`❌ ${rco}/${dateParam} (${via}): ${message}`);
        if (isUnavailable(err)) unavailable = true;
      }
    }
  }

  return { found: false as const, unavailable };
}

export async function POST(request: Request) {
  const body = await request.json();
  const info = body.info;
  const dateParts = String(info?.expiresAt || "").split(".");
  const newDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  const persNb = String(info?.leginr || "").trim();

  if (!persNb || dateParts.length !== 3) {
    return NextResponse.json({ success: false, error: "invalid" });
  }

  const preferProxy = process.env.CWEBPLUS_PREFER_PROXY === "1";
  const proxyUrl = process.env.CWEBPLUS_PROXY_URL;

  const first = await lookupCard(persNb, newDate, preferProxy ? proxyUrl : undefined);
  if (first.found) {
    return NextResponse.json({ success: true, data: publicCardData(first.data) });
  }

  if (proxyUrl && !preferProxy && first.unavailable) {
    const proxied = await lookupCard(persNb, newDate, proxyUrl);
    if (proxied.found) {
      return NextResponse.json({ success: true, data: publicCardData(proxied.data) });
    }
    return NextResponse.json({
      success: false,
      error: proxied.unavailable ? "unavailable" : "invalid",
    });
  }

  return NextResponse.json({
    success: false,
    error: first.unavailable ? "unavailable" : "invalid",
  });
}
