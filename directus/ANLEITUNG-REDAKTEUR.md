# Weihnachtswunschaktion — Inhalte online bearbeiten

Diese Anleitung ist für **Freiwillige ohne Programmierkenntnisse**.

## Anmelden

1. Öffnen Sie den Link, den Ihnen Ihr Ansprechpartner geschickt hat (z. B. `https://wwa-directus.onrender.com/admin`)
2. E-Mail und Passwort eingeben
3. Sie landen im **Directus-Admin** — das ist Ihr «Redaktions-Cockpit»

> **Tipp:** Speichern Sie den Link als Lesezeichen im Browser.

## Was Sie bearbeiten können

| Bereich | Wofür | Menüpunkt |
|--------|--------|-----------|
| **Seiten** | Texte auf Info, Hilfe, Kontakt, Team, … | Inhalt → Page |
| **Seiten-Abschnitte** | Spalten-Blöcke (1, 2 oder 3 Spalten je nach Seite) | Inhalt → Page Section |
| **Seiten-Phasentexte** | Status-Texte je nach Kampagnenphase (Anmelden, Wunsch erfüllen, …) | Inhalt → Page State Block |
| **Seiten-Buttons** | Call-to-Action-Buttons unter dem Text (Info, Hilfe, Done, …) | Inhalt → Page Button |
| **Partner / Sponsoren** | Logos und Links der Partnerfirmen | Inhalt → Sponsor |
| **Wünsche** | Geschenk-Katalog (Bild, Beschreibung, Altersgruppe) | Inhalt → Wish |
| **Kategorien** | Kategorien für Wünsche (Spielzeug, Erlebnis, …) | Inhalt → Category |
| **Einstellungen** | Kontaktadresse, E-Mail, Wunsch-Limit, feste Fortschrittszahl | Inhalt → Global Setting |
| **Kampagnenstatus** | Phase der Aktion (Anmeldung, Wunscherfüllung, …) | Inhalt → Application → State |
| **Startseiten-Texte** | Texte im weissen Bereich unter dem Hero (pro Phase) | Inhalt → Campaign Content |

## Typische Aufgaben

### Text auf der Info-Seite ändern

1. **Inhalt → Page** → Eintrag **info**
2. **Body** bearbeiten (Rich-Text-Editor)
3. **Seiten-Buttons** unter **Inhalt → Page Button** (Filter: Page = info) für «Wunsch anmelden» / «Wunsch erfüllen»
4. **Speichern**

### Seitenlayout (1, 2 oder 3 Spalten)

Jede Unterseite hat ein **Layout**-Feld in **Page**:

| Layout | Bedeutung | Beispiel-Seiten |
|--------|-----------|-----------------|
| **simple** | Fliesstext + optional Buttons | Info, Hilfe, Partner, Legihelp |
| **one_column** | Einleitung + Abschnitte untereinander | (selten) |
| **two_column** | Einleitung + 2 Spalten | Anmelden, Team |
| **three_column** | 3 Spalten nebeneinander | Kontakt, Impressum |

Bei **two_column** / **three_column**: Abschnitte in **Page Section** mit **Column** = 1, 2 oder 3 zuweisen.

### Seite «Wunsch anmelden» bearbeiten

Die Anmeldeseite hat **strukturierte Felder** — das Layout (2 Spalten, Abstände) bleibt gleich, nur die Texte sind editierbar.

1. **Inhalt → Page** → Eintrag **anmelden** (Layout: **two_column**)
   - **Lead** — Einleitungstext unter der Überschrift
   - **Footnote** — Disclaimer am Seitenende (mit `*`)
   - **Icon** — Dateiname des Icons (z. B. `icon1.png`), normalerweise nicht ändern

2. **Inhalt → Page Section** — die vier Info-Blöcke (Teilnahmebedingungen, Was, Geschenkübergabe, Hilfe …)
   - **Title** — Überschrift des Blocks
   - **Body** — Text (Links können im Editor gesetzt werden)
   - **Column** — `1` = linke Spalte, `2` = rechte Spalte, `3` = dritte Spalte (nur bei 3-Spalten-Seiten)
   - **Sort** — Reihenfolge innerhalb der Spalte
   - **Page** — muss «anmelden» sein

3. **Inhalt → Page State Block** — Texte die **je nach Kampagnenphase** erscheinen
   - **State** — Phase (`pre_registration`, `registration`, `waitinglist`, `wish_fulfilment`, `closed`, …)
   - **Title** — optional: überschreibt den Seiten-Titel (H1) für diese Phase
   - **Notification** — optional: Hinweis-Box unter dem Inhalt (grauer Rahmen mit Icon), z. B. «Sobald alle Wünsche registriert …»
   - **Lead** — optional: überschreibt den **Lead** der Seite für diese Phase
   - **Body** — optional: überschreibt den **Body** der Seite für diese Phase
   - **Button Label** / **Button Url** — optionaler Button (z. B. «Warteliste» → `/warteliste`)
   - **Page** — muss zur jeweiligen Unterseite passen (z. B. «wunscherfuellen»)

> **Wichtig:** Die Seite (**Page**) liefert die Standard-Texte (**Title**, **Lead**, **Body**). Felder im **Page State Block** überschreiben nur, wenn sie ausgefüllt sind — leere Felder im Phasenblock = Seitenwert bleibt sichtbar. Welche Phase aktiv ist, steuert **Application → State**.

### Neuen Partner hinzufügen

1. **Inhalt → Sponsor → Erstellen**
2. **Name**, **Link** (URL) und **Logo** hochladen
3. Optional:
   - **Partner Tier** — «Hauptpartner (oben)» erscheinen zuerst auf `/partner` und im Footer (mit Trennlinie)
   - **Pin in Footer** — Logo erscheint zusätzlich im Footer (nach den Hauptpartnern)
   - **Featured** — kann im Footer rotieren (max. 4 Logos, zufällige Auswahl pro Seitenaufruf)
   - **Sort** — Reihenfolge innerhalb der Stufe (niedrigere Zahl = weiter links)
4. Speichern

**Logo wird nicht angezeigt?** Seite neu laden (Hard Refresh). Wenn das Logo-Feld leer bleibt, obwohl Sie eine Datei gewählt haben: oben rechts **Speichern** (Häkchen) nicht vergessen. Bei anhaltendem Problem IT bitten, `npm run directus:fix-sponsor` auszuführen.

Alle Sponsor-Einträge mit Name, Link und Logo erscheinen auf der Seite **Unsere Partner** (`/partner`).

### Wunsch deaktivieren

1. **Inhalt → Wish**
2. Wunsch öffnen
3. **Active** auf «aus» setzen
4. Speichern

### Kampagnenphase umstellen

1. **Inhalt → Application** (nur ein Eintrag)
2. **State** wählen:
   - `pre_registration` — vor Anmeldestart
   - `registration` — Familien können sich anmelden
   - `wish_fulfilment` — Spender können Wünsche erfüllen
   - `closed` — Aktion beendet
3. Speichern

### Startseiten-Texte bearbeiten

1. **Inhalt → Campaign Content**
2. Den Eintrag mit der passenden **State**-Phase öffnen (z. B. `closed` für «Aktion beendet»)
3. Felder anpassen:
   - **Lead** — Haupttext
   - **Body** — zweiter Absatz (optional)
   - **Show Progress** / **Progress Title** / **Progress Max** — Fortschrittsanzeige
   - **Button 1–3** — Beschriftung, Link und «External» für externe URLs
4. Speichern

Welcher Text auf der Website erscheint, hängt vom **Application → State** ab (aktuelle Kampagnenphase).

### Fortschrittsanzeige manuell setzen

1. **Inhalt → Global Setting**
2. **Wish Limit** — maximale Anzahl (z. B. 3500), bestimmt die volle Breite des Balkens
3. **Fixed Wish Count** — optional: feste Anzahl **erfüllter** Wünsche für die Fortschrittsanzeige (z. B. 1200). Überschreibt die Live-Zählung, solange das Feld ausgefüllt ist. Leer lassen = echte Anzahl aus der Datenbank.

## Was Sie **nicht** sehen sollten

Persönliche Daten von Familien und Spendern (Adressen, E-Mails) sind für die Rolle **Redakteur** ausgeblendet. Bei Fragen wenden Sie sich an den Administrator.

## Hilfe

Technische Probleme (Login, Bild-Upload): Ansprechpartner Caritas / IT  
Inhaltliche Fragen: Projektleitung Weihnachtswunschaktion
