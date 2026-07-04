import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
const { HttpsProxyAgent } = require("https-proxy-agent");

export default async function handler(req, res) {
  const info = req.body.info;
  const dateParts = info.expiresAt.slice().split(".");
  const newDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

  const proxyUrl = "http://customer-wwacaritas_SRJ92-cc-ch-sessid-0235665092-sesstime-10:Weihnacht_Caritas_WWA11@pr.oxylabs.io:7777";
  const agent = new HttpsProxyAgent(proxyUrl);

  // const username = "brd-customer-hl_2659f81f-zone-datacenter_proxy1";
  // const password = "mrktw2x0pck4";
  // const port = 22225;
  // const session_id = (1000000 * Math.random()) | 0;
  // const proxy = {
  //   host: "brd.superproxy.io",
  //   port: port,
  //   auth: {
  //     username: `${username}-country-ch-session-${session_id}`,
  //     password: password,
  //   },
  // };
  // const proxy = {
  //   host: "brd.superproxy.io",
  //   port: port,
  //   auth: {
  //     username: `${username}-country-ch-session-${session_id}`,
  //     password: password,
  //   },
  // };

  // Create an HTTPS agent with SSL verification disabled

  // const response = await fetch("https://cwebplus.ch/Test/Kule/api/1.0/de/Card?RCO=zh&PersNb=" + info.leginr + "&ExpiresAt=" + newDate, {
  //   headers: {
  //     Authorization:
  //       "Bearer KuLe.sg58LPrYk2yorR2ySkqEGN2dqY1dqNRak0nPlw0soK3ZR9qAEAqobFnJ15tWZ38qe2EbK73UosQITKcwpD1FeoP6brtjDO6FsD1DTnk9SyixWYTg55u2cq1BSBr",
  //   },
  //   proxy: "http://brd-customer-hl_2659f81f-zone-datacenter_proxy1-country-ch:mrktw2x0pck4@brd.superproxy.io:22225",
  // });
  // if (response.status !== 200) {
  //   res.json({ success: false });
  //   return;
  // }
  // await require("request-promise")({
  //   url: "https://cwebplus.ch/Test/Kule/api/1.0/de/Card?RCO=zh&PersNb=" + info.leginr + "&ExpiresAt=" + newDate,
  //   proxy: "http://brd-customer-hl_2659f81f-zone-datacenter_proxy1-country-ch:mrktw2x0pck4@brd.superproxy.io:22225",
  // }).then(
  //   function (data) {
  //     console.log("It worked");
  //   },
  //   function (err) {
  //     console.log("It didn't work", err.message);
  //   }
  // );
  try {
    const response = await axios.get("https://cwebplus.ch/Prod/Kule/api/1.0/de/Card?RCO=ZH&PersNb=" + info.leginr + "&ExpiresAt=" + newDate + " 00%3A00%3A00", {
      headers: {
        Authorization:
          "Bearer K/0Lw0ehOifVlesjTxhi0T2zu5Bd4KO0kNws6S0Hby+GK4mUEgz6TqtnR64VaqfRhRJw8APm3NK0t1LKOFddbWoJ72hH0+h8fzWSdm1b0TbPxYezpr7ETgxFkUCsxY+VdQXIn/EZ0WAkaAQm1RWxGPSDRe9m2+1yiCI2mwxICfI=",
      },
      // proxy: proxy,
      httpsAgent: agent, // Use the custom HTTPS agent
    });
    if (response.status !== 200) {
      res.json({ success: false });
      return;
    }
    console.log(`✅ 1. Try: Success`);
    res.json({ success: true, data: response.data });
  } catch (err) {
    console.log(`❌ 1. Try: ${err.message}`);
    try {
      const response2 = await axios.get(
        "https://cwebplus.ch/Prod/Kule/api/1.0/de/Card?RCO=SH&PersNb=" + info.leginr + "&ExpiresAt=" + newDate + " 00%3A00%3A00",
        {
          headers: {
            Authorization:
              "Bearer K/0Lw0ehOifVlesjTxhi0T2zu5Bd4KO0kNws6S0Hby+GK4mUEgz6TqtnR64VaqfRhRJw8APm3NK0t1LKOFddbWoJ72hH0+h8fzWSdm1b0TbPxYezpr7ETgxFkUCsxY+VdQXIn/EZ0WAkaAQm1RWxGPSDRe9m2+1yiCI2mwxICfI=",
          },
          // proxy: proxy,
          httpsAgent: agent, // Use the custom HTTPS agent
        }
      );

      if (response2.status !== 200) {
        res.json({ success: false });
        return;
      }
      console.log(`✅ 2. Try: Success`);
      res.json({ success: true, data: response2.data });
    } catch (err) {
      console.log(`❌ 2. Try: ${err.message}`);
      res.json({ success: false });
      return;
    }
  }
}
