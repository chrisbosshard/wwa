import React, { useState, useEffect } from "react";

// IMPORT COMPONENTS
import { CSVLink } from "react-csv";
import { throttle } from "throttle-debounce";
import { updateKid } from "@lib/directus/api-client";
import axios from "axios";

// IMPORT COMPONENTS
import TextField from "@mui/material/TextField";

// IMPORT CUSTOM COMPONENTS
import Hero from "@sections/Hero/Hero";

const Admin = (props) => {
  const kids = props.kids;
  // STATE
  const [table, setTable] = useState<string[][]>();
  const [password, setPassword] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [num, setNum] = useState(0);

  // EFFECTS
  useEffect(() => {
    if (kids) {
      const newKids = kids.filter((kid) => kid.family).slice();
      // console.log("DATA", data);
      // if (data && fetchMore) {
      // const nextPage = getHasNextPage(data.connection);
      // const after = getAfter(data.connection);

      // if (nextPage && after !== null) {
      //   console.log("FETCH MORE");
      //   fetchMore({ updateQuery, variables: { after } });
      // } else {
      const sortedKids = newKids.sort((a, b) => {
        return b.family.id.localeCompare(a.family.id);
      });

      // let kids = data.connection.edges.map((item) => item.node);
      const newTable = [
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
      // }
    }
  }, [kids]);

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  // FUNCTIONS
  const generateCode = async () => {
    // values
    // let kids = data.connection.edges.map((item) => item.node);
    let familyCurrent = "";
    let familyCount = 0;
    let kidCountVersandGutschein = 0; // Count within Family
    let kidCountVersandPaket = 0; // Count within Family
    let kidCountZHCity = 0; // Count within Family
    let kidCountWinterthur = 0; // Count within Family

    let kidPositionVersandGutschein = 0;
    let kidPositionVersandPaket = 0;
    let kidPositionZHCity = 0;
    let kidPositionWinterthur = 0;

    const filterZHCity = [8001,8002,8003,8004,8005,8006,8008,8032,8037,8038,8041,8044,8045,8046,8047,8048,8049,8050,8051,8052,8053,8055,8057,8063,8064,8066] // prettier-ignore
    const filterWinterthur = [8400,8401, 8403, 8404, 8405, 8406, 8408, 8409, 8424, 8427, 8311,8471,8421,8474,8353,8548,8352,8442,8413,8422,8545,8418,8472,8542] // prettier-ignore

    const newKids = kids.filter((kid) => kid.family).slice();
    // console.log("DATA", data);
    // if (data && fetchMore) {
    // const nextPage = getHasNextPage(data.connection);
    // const after = getAfter(data.connection);

    // if (nextPage && after !== null) {
    //   console.log("FETCH MORE");
    //   fetchMore({ updateQuery, variables: { after } });
    // } else {
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
        // Voucher (N or G)
        const voucher = kid.wish.voucher === true ? "G" : "N";

        // Location
        let location = "Versand";
        if (voucher === "N") {
          if (filterZHCity.includes(parseInt(kid.family.zipcode))) location = "ZH";
          if (filterWinterthur.includes(parseInt(kid.family.zipcode))) location = "WIN";
        }

        // Family Count
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

        // Kid Count in Family
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

        // Kid Position in Family
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

        // Family Total
        let familyTotal = 0;
        if (location === "Versand" && voucher === "G") {
          familyTotal = kids.filter((k) => {
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
          familyTotal = kids.filter((k) => {
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
          familyTotal = kids.filter((k) => {
            return k.family && k.wish && k.family.id === familyCurrent && k.wish.voucher !== true && filterZHCity.includes(parseInt(k.family.zipcode));
          }).length;
        } else if (location === "WIN") {
          familyTotal = kids.filter((k) => {
            return k.family && k.wish && k.family.id === familyCurrent && k.wish.voucher !== true && filterWinterthur.includes(parseInt(k.family.zipcode));
          }).length;
        }

        // Kid Position Overall
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
      const variables = {
        code: code.code,
      };
      setNum(i + 1);
      await updateKid(code.id, { code: code.code });
    }
  };

  const checkPassword = async () => {
    // check the password on the API with a static password "care_weihnachten" which should not be visible in the code
    const response = await axios.post("/api/check_password", {
      password: password,
    });
    // check whether the password is correct

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
        <div style={{ textAlign: "center" }}>
          <TextField
            id="outlined-basic"
            value={password}
            onChange={handlePassword}
            label="Password"
            variant="outlined"
            type="password"
            sx={{
              input: {
                borderColor: "#ebdcbe",
                color: "#ebdcbe",
              },
            }}
          />
          {message && <h3>{message}</h3>}
          <div className="link-container" onClick={checkPassword} style={{ marginLeft: "1rem" }}>
            <a className="link">Login</a>
          </div>
        </div>
      )}
      <div className="details" style={{ display: loggedIn ? "block" : "none" }}>
        {table && (
          <div style={{ textAlign: "center" }}>
            <div className="button-container">
              <CSVLink data={table}>
                <div className="link-container">
                  <a className="link">Liste Herunterladen</a>
                </div>
              </CSVLink>
              <div className="link-container" onClick={generateCode} style={{ marginLeft: "1rem" }}>
                <a className="link">Code Generieren</a>
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
};

export default Admin;
