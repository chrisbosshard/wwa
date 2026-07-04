"use client";

import React, { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import { updateKid } from "@lib/directus/api-client";
import axios from "axios";
import Hero from "@sections/Hero/Hero";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/components/providers/CartProvider";
import { buttonContainer, link, linkContainer } from "@/lib/ui-classes";

export default function AdminPage() {
  const { kids } = useCart();

  const [table, setTable] = useState<(string | boolean)[][]>();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [num, setNum] = useState(0);

  useEffect(() => {
    if (kids) {
      const typedKids = kids as Array<{
        family?: {
          id: string;
          prename: string;
          surname: string;
          street: string;
          nr: string;
          zipcode: string;
          city: string;
          phone: string;
          email: string;
          origin: string;
          contactPermission: boolean;
          leginr: string;
          comment: string;
        };
        wish?: {
          code: string;
          description: string;
          article: string;
          category?: { name: string };
          link: string;
          voucher: boolean;
        };
        code?: string;
        prename: string;
        age: string;
        active: boolean;
        createdAt: string;
        id: string;
      }>;
      const newKids = typedKids.filter((kid) => kid.family).slice();

      const sortedKids = newKids.sort((a, b) => {
        return b.family.id.localeCompare(a.family.id);
      });

      const newTable: (string | boolean)[][] = [
        [
          "Code",
          "Code - Abholnummer",
          "Code - Familienposition",
          "Code - Kindposition",
          "Code - Kind in Familie",
          "Code - Lokation",
          "Code - Voucher",
          "Code - Id",
          "Vorname",
          "Alter",
          "Vorname Familie",
          "Nachname",
          "Strasse",
          "Nr",
          "PLZ",
          "Stadt",
          "Telefon",
          "Email",
          "Wunsch Code",
          "Wunsch",
          "Wunsch Artikel",
          "Wunsch Kategorie",
          "Wunsch Link",
          "Von der Aktion erfahren",
          "Kom. CH",
          "KL Mitgliednummer",
          "Kommentar",
          "Voucher",
          "Aktive",
          "Erstellt am",
          "Datenbank ID",
        ],
      ];
      sortedKids.forEach((kid) => {
        if (kid.family && kid.wish && kid.code) {
          const voucher = kid.wish.voucher === true ? true : false;
          const contact = kid.family.contactPermission === true ? true : false;
          const status = kid.active === true ? true : false;
          const code = kid.code.split("-");
          const abholnummer = code[0] ? code[0] : "";
          const codeFamilyposition = code[1] ? code[1] : "";
          const codeKidposition = code[2] ? code[2] : "";
          const codeKidcount = code[3] ? code[3] : "";
          const codeLocation = code[4] ? code[4] : "";
          const codeVoucher = code[5] ? code[5] : "";
          const id = code[6] ? code[6] : "";

          const item = [
            kid.code,
            abholnummer,
            codeFamilyposition,
            codeKidposition,
            codeKidcount,
            codeLocation,
            codeVoucher,
            id,
            kid.prename,
            kid.age,
            kid.family.prename,
            kid.family.surname,
            kid.family.street,
            kid.family.nr,
            kid.family.zipcode,
            kid.family.city,
            kid.family.phone,
            kid.family.email,
            kid.wish.code,
            kid.wish.description,
            kid.wish.article,
            kid.wish.category ? kid.wish.category.name : "",
            kid.wish.link,
            kid.family.origin,
            contact,
            kid.family.leginr,
            kid.family.comment,
            voucher,
            status,
            kid.active,
            kid.createdAt,
            kid.id,
          ];
          newTable.push(item);
        }
      });
      setTable(newTable);
    }
  }, [kids]);

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const generateCode = async () => {
    let familyCurrent = "";
    let familyCount = 0;
    let kidCountVersandGutschein = 0;
    let kidCountVersandPaket = 0;
    let kidCountZHCity = 0;
    let kidCountWinterthur = 0;

    let kidPositionVersandGutschein = 0;
    let kidPositionVersandPaket = 0;
    let kidPositionZHCity = 0;
    let kidPositionWinterthur = 0;

    const filterZHCity = [8001,8002,8003,8004,8005,8006,8008,8032,8037,8038,8041,8044,8045,8046,8047,8048,8049,8050,8051,8052,8053,8055,8057,8063,8064,8066] // prettier-ignore
    const filterWinterthur = [8400,8401, 8403, 8404, 8405, 8406, 8408, 8409, 8424, 8427, 8311,8471,8421,8474,8353,8548,8352,8442,8413,8422,8545,8418,8472,8542] // prettier-ignore

    const typedKids = kids as Array<{
      family?: { id: string; zipcode: string };
      wish?: { voucher: boolean };
      id: string;
    }>;
    const newKids = typedKids.filter((kid) => kid.family).slice();

    const sortedKids = newKids.sort((a, b) => {
      return b.family.id.localeCompare(a.family.id);
    });

    const codes = [];
    let idVersandPaket = 30000;
    let idVersandGutschein = 40000;
    let idAbholungZH = 10000;
    let idAbholungWinterthur = 20000;
    sortedKids.map((kid, index) => {
      if (kid.family && kid.wish) {
        const voucher = kid.wish.voucher === true ? "G" : "N";

        let location = "Versand";
        if (voucher === "N") {
          if (filterZHCity.includes(parseInt(kid.family.zipcode))) location = "ZH";
          if (filterWinterthur.includes(parseInt(kid.family.zipcode))) location = "WIN";
        }

        if (kid.family.id !== familyCurrent) {
          kidCountVersandGutschein = 0;
          kidCountVersandPaket = 0;
          kidCountZHCity = 0;
          kidCountWinterthur = 0;
          familyCount++;
          familyCurrent = kid.family.id;
          kidPositionVersandGutschein = 0;
          kidPositionVersandPaket = 0;
          kidPositionZHCity = 0;
          kidPositionWinterthur = 0;
        }

        if (kid.family.id === familyCurrent) {
          if (location === "Versand" && voucher === "G") {
            kidCountVersandGutschein++;
          } else if (location === "Versand" && voucher === "N") {
            kidCountVersandPaket++;
          } else if (location === "ZH") {
            kidCountZHCity++;
          } else if (location === "WIN") {
            kidCountWinterthur++;
          }
        }

        let kidCount = 0;
        if (location === "Versand" && voucher === "G") {
          kidCount = kidCountVersandGutschein;
        } else if (location === "Versand" && voucher === "N") {
          kidCount = kidCountVersandPaket;
        } else if (location === "ZH") {
          kidCount = kidCountZHCity;
        } else if (location === "WIN") {
          kidCount = kidCountWinterthur;
        }

        let familyTotal = 0;
        if (location === "Versand" && voucher === "G") {
          familyTotal = typedKids.filter((k) => {
            return (
              k.family &&
              k.wish &&
              k.family.id === familyCurrent &&
              k.wish.voucher === true &&
              !filterZHCity.includes(parseInt(k.family.zipcode)) &&
              !filterWinterthur.includes(parseInt(k.family.zipcode))
            );
          }).length;
        } else if (location === "Versand" && voucher === "N") {
          familyTotal = typedKids.filter((k) => {
            return (
              k.family &&
              k.wish &&
              k.family.id === familyCurrent &&
              k.wish.voucher !== true &&
              !filterZHCity.includes(parseInt(k.family.zipcode)) &&
              !filterWinterthur.includes(parseInt(k.family.zipcode))
            );
          }).length;
        } else if (location === "ZH") {
          familyTotal = typedKids.filter((k) => {
            return k.family && k.wish && k.family.id === familyCurrent && k.wish.voucher !== true && filterZHCity.includes(parseInt(k.family.zipcode));
          }).length;
        } else if (location === "WIN") {
          familyTotal = typedKids.filter((k) => {
            return k.family && k.wish && k.family.id === familyCurrent && k.wish.voucher !== true && filterWinterthur.includes(parseInt(k.family.zipcode));
          }).length;
        }

        let kidPosition = 0;
        if (location === "Versand" && voucher === "G") {
          kidPositionVersandGutschein++;
          kidPosition = kidPositionVersandGutschein;
        } else if (location === "Versand" && voucher === "N") {
          kidPositionVersandPaket++;
          kidPosition = kidPositionVersandPaket;
        } else if (location === "ZH") {
          kidPositionZHCity++;
          kidPosition = kidPositionZHCity;
        } else if (location === "WIN") {
          kidPositionWinterthur++;
          kidPosition = kidPositionWinterthur;
        }
        let id = 0;
        if (location === "Versand" && voucher === "G") {
          idVersandGutschein = idVersandGutschein + 1;
          id = idVersandGutschein;
        } else if (location === "Versand" && voucher === "N") {
          idVersandPaket = idVersandPaket + 1;
          id = idVersandPaket;
        } else if (location === "ZH") {
          idAbholungZH = idAbholungZH + 1;
          id = idAbholungZH;
        } else if (location === "WIN") {
          idAbholungWinterthur = idAbholungWinterthur + 1;
          id = idAbholungWinterthur;
        }

        const code = id + "-" + familyCount + "-" + kidPosition  + "-" + familyTotal + "-" + location +"-"+ voucher+"-"+(index+1); // prettier-ignore
        codes.push({ code: code, id: kid.id });
      }
    });

    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      setNum(i + 1);
      await updateKid(code.id, { code: code.code });
    }
  };

  const checkPassword = async () => {
    const response = await axios.post("/api/check_password", {
      password: password,
    });

    if (response.data.success) {
      setLoggedIn(true);
      setMessage("");
    } else {
      setMessage("Passwort is inkorrekt");
    }
  };

  let numKids = kids ? kids.length : 0;

  return (
    <div>
      <Hero />
      {!loggedIn && (
        <div className="mx-auto max-w-sm space-y-4 px-4 text-center">
          <div className="space-y-2 text-left">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" value={password ?? ""} onChange={handlePassword} type="password" />
          </div>
          {message && <h3>{message}</h3>}
          <div className={linkContainer} onClick={checkPassword}>
            <a className={link}>Login</a>
          </div>
        </div>
      )}
      <div className="details" style={{ display: loggedIn ? "block" : "none" }}>
        {table && (
          <div style={{ textAlign: "center" }}>
            <div className={buttonContainer}>
              <CSVLink data={table}>
                <div className={linkContainer}>
                  <a className={link}>Liste Herunterladen</a>
                </div>
              </CSVLink>
              <div className={linkContainer} onClick={generateCode} style={{ marginLeft: "1rem" }}>
                <a className={link}>Code Generieren</a>
              </div>
            </div>
            {num > 0 && (
              <h3>
                {num} / {numKids}
              </h3>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
