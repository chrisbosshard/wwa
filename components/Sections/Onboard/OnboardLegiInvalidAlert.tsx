import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { inlineLink, cmsAlphaList } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";

export const onboardStepAlert =
  "mb-8 w-full rounded-xl border border-[#f0c4c4] bg-[#fef5f5] px-6 py-6 sm:px-8 sm:py-8";

const listStyles = cmsAlphaList;

export function OnboardLegiInvalidAlert({ className }: { className?: string }) {
  return (
    <div className={cn(onboardStepAlert, className)} role="alert">
      <div className="flex gap-4 md:gap-5">
        <ExclamationCircleIcon className="mt-0.5 h-7 w-7 shrink-0 text-caritas-red md:h-8 md:w-8" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-[#242424] md:text-lg">Deine KulturLegi-Angaben sind ungültig</p>
          <p className="mt-2 text-sm leading-relaxed text-[#575656] md:text-[0.9375rem]">
            Deine KulturLegi-Karte ist inaktiv und die Prüfung deiner KulturLegi-Angaben fehlgeschlagen. Eine Wunschanmeldung ist daher nicht möglich.
          </p>

          <ol className={listStyles}>
            <li>
              Ist deine KulturLegi abgelaufen? Dann verlängere diese mit aktuellen Unterlagen per{" "}
              <a
                className={inlineLink}
                href="https://www.kulturlegi.ch/zuerich/kulturlegi-beantragen/online-antrag"
                target="_blank"
                rel="noopener noreferrer"
              >
                Online-Antrag
              </a>{" "}
              oder persönlich im{" "}
              <a
                className={inlineLink}
                href="https://www.kulturlegi.ch/zuerich/ueber-uns/kontakt"
                target="_blank"
                rel="noopener noreferrer"
              >
                KulturLegi-Büro
              </a>
              .
            </li>
            <li>
              Du wohnst nicht im Kanton Zürich oder Kanton Schaffhausen, dann kannst du leider nicht an der Aktion teilnehmen.
            </li>
            <li>
              Du besitzt keine KulturLegi? Die Berechtigungskriterien und weitere Informationen zur KulturLegi findest du unter{" "}
              <a className={inlineLink} href="https://www.kulturlegi.ch/zuerich" target="_blank" rel="noopener noreferrer">
                www.kulturlegi.ch/zuerich
              </a>
              .
            </li>
          </ol>

          <p className="mt-6 text-sm leading-relaxed text-[#575656] md:text-[0.9375rem]">
            Brauchst du Hilfe? Telefonisch sind wir unter 044 366 68 48 erreichbar oder sind persönlich im KulturLegi-Büro, im Digi-Treff oder in den
            Lernstuben vom Kanton Zürich für dich da.
          </p>
        </div>
      </div>
    </div>
  );
}
