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
| **Seiten** | Texte auf Info, Hilfe, Kontakt, Impressum | Inhalt → Page |
| **Partner / Sponsoren** | Logos und Links der Partnerfirmen | Inhalt → Sponsor |
| **Wünsche** | Geschenk-Katalog (Bild, Beschreibung, Altersgruppe) | Inhalt → Wish |
| **Kategorien** | Kategorien für Wünsche (Spielzeug, Erlebnis, …) | Inhalt → Category |
| **Einstellungen** | Kontaktadresse, E-Mail, Anmeldelimit | Inhalt → Global Setting |
| **Kampagnenstatus** | Phase der Aktion (Anmeldung, Wunscherfüllung, …) | Inhalt → Application → State |
| **Startseiten-Texte** | Texte im weissen Bereich unter dem Hero (pro Phase) | Inhalt → Campaign Content |

## Typische Aufgaben

### Text auf der Info-Seite ändern

1. **Inhalt → Page**
2. Eintrag «info» (oder «Über die Aktion») öffnen
3. Feld **Body** bearbeiten (Rich-Text-Editor)
4. **Speichern** (Häkchen oben rechts)

### Neuen Partner hinzufügen

1. **Inhalt → Sponsor → Erstellen**
2. Name, Link (URL) und Logo-Bild hochladen
3. Speichern

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

## Was Sie **nicht** sehen sollten

Persönliche Daten von Familien und Spendern (Adressen, E-Mails) sind für die Rolle **Redakteur** ausgeblendet. Bei Fragen wenden Sie sich an den Administrator.

## Hilfe

Technische Probleme (Login, Bild-Upload): Ansprechpartner Caritas / IT  
Inhaltliche Fragen: Projektleitung Weihnachtswunschaktion
