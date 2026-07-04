import { NextResponse } from "next/server";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const proxyUrl =
  "http://customer-wwacaritas_SRJ92-cc-ch-sessid-0235665092-sesstime-10:Weihnacht_Caritas_WWA11@pr.oxylabs.io:7777";
const agent = new HttpsProxyAgent(proxyUrl);

const authHeader = {
  Authorization:
    "Bearer K/0Lw0ehOifVlesjTxhi0T2zu5Bd4KO0kNws6S0Hby+GK4mUEgz6TqtnR64VaqfRhRJw8APm3NK0t1LKOFddbWoJ72hH0+h8fzWSdm1b0TbPxYezpr7ETgxFkUCsxY+VdQXIn/EZ0WAkaAQm1RWxGPSDRe9m2+1yiCI2mwxICfI=",
};

export async function POST(request: Request) {
  const body = await request.json();
  const info = body.info;
  const dateParts = info.expiresAt.slice().split(".");
  const newDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  try {
    const response = await axios.get(
      `https://cwebplus.ch/Prod/Kule/api/1.0/de/Card?RCO=ZH&PersNb=${info.leginr}&ExpiresAt=${newDate} 00%3A00%3A00`,
      { headers: authHeader, httpsAgent: agent },
    );
    if (response.status !== 200) {
      return NextResponse.json({ success: false });
    }
    console.log("✅ 1. Try: Success");
    return NextResponse.json({ success: true, data: response.data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ 1. Try: ${message}`);
    try {
      const response2 = await axios.get(
        `https://cwebplus.ch/Prod/Kule/api/1.0/de/Card?RCO=SH&PersNb=${info.leginr}&ExpiresAt=${newDate} 00%3A00%3A00`,
        { headers: authHeader, httpsAgent: agent },
      );
      if (response2.status !== 200) {
        return NextResponse.json({ success: false });
      }
      console.log("✅ 2. Try: Success");
      return NextResponse.json({ success: true, data: response2.data });
    } catch (err2) {
      const message2 = err2 instanceof Error ? err2.message : "Unknown error";
      console.log(`❌ 2. Try: ${message2}`);
      return NextResponse.json({ success: false });
    }
  }
}
