"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface FormationStep {
  number: number;
  title: { en: string; ta: string };
  date?: { en: string; ta: string };
  description: { en: string; ta: string };
  icon: string;
}

const formationSteps: FormationStep[] = [
  {
    number: 1,
    title: { en: "Election Day", ta: "தேர்தல் நாள்" },
    date: { en: "April 23, 2026", ta: "ஏப்ரல் 23, 2026" },
    description: {
      en: "Voters across 234 constituencies in Tamil Nadu cast their ballots. Each constituency elects one MLA through first-past-the-post voting. EVMs and VVPATs are used for voting.",
      ta: "234 தொகுதிகளிலும் வாக்காளர்கள் தங்கள் வாக்குகளை அளிக்கின்றனர். ஒவ்வொரு தொகுதியிலும் ஒரு எம்.எல்.ஏ தேர்ந்தெடுக்கப்படுகிறார். EVM மற்றும் VVPAT பயன்படுத்தப்படுகிறது.",
    },
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    number: 2,
    title: { en: "Vote Counting", ta: "வாக்கு எண்ணிக்கை" },
    date: { en: "May 4, 2026", ta: "மே 4, 2026" },
    description: {
      en: "Votes are counted at designated counting centres under the supervision of Returning Officers. Results are declared constituency by constituency. The Election Commission oversees the entire process.",
      ta: "நியமிக்கப்பட்ட எண்ணும் மையங்களில் வாக்குகள் எண்ணப்படுகின்றன. தொகுதி வாரியாக முடிவுகள் அறிவிக்கப்படுகின்றன. தேர்தல் ஆணையம் முழு செயல்முறையையும் மேற்பார்வையிடுகிறது.",
    },
    icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
  },
  {
    number: 3,
    title: { en: "Results Declared", ta: "முடிவுகள் அறிவிப்பு" },
    description: {
      en: "The party or alliance winning 118 or more seats out of 234 secures a simple majority. This is the magic number needed to form the government.",
      ta: "234 இடங்களில் 118 அல்லது அதற்கு மேல் வென்ற கட்சி அல்லது கூட்டணி சாதாரண பெரும்பான்மை பெறுகிறது. அரசை அமைக்க இது தேவையான எண்.",
    },
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    number: 4,
    title: { en: "Governor Invites Majority Leader", ta: "ஆளுநர் பெரும்பான்மைத் தலைவரை அழைக்கிறார்" },
    description: {
      en: "The Governor of Tamil Nadu invites the leader of the party or alliance that has the majority to form the government. The leader is asked to prove their majority on the floor of the Assembly.",
      ta: "பெரும்பான்மை பெற்ற கட்சி அல்லது கூட்டணியின் தலைவரை அரசு அமைக்க ஆளுநர் அழைக்கிறார். சட்டமன்றத்தில் பெரும்பான்மையை நிரூபிக்கக் கேட்கப்படுகிறார்.",
    },
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  },
  {
    number: 5,
    title: { en: "Chief Minister Sworn In", ta: "முதலமைச்சர் பதவியேற்பு" },
    description: {
      en: "The Chief Minister is sworn in by the Governor at Raj Bhavan, Chennai. The CM takes the oath of office and secrecy as per the Third Schedule of the Constitution.",
      ta: "சென்னை ராஜ்பவனில் ஆளுநரால் முதலமைச்சர் பதவியேற்கிறார். அரசியலமைப்பின் மூன்றாவது அட்டவணையின்படி பதவி மற்றும் இரகசியக் காப்பு பிரமாணம் எடுக்கிறார்.",
    },
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
  },
  {
    number: 6,
    title: { en: "Council of Ministers Appointed", ta: "அமைச்சரவை நியமனம்" },
    description: {
      en: "The CM recommends a list of Ministers to the Governor. Ministers are drawn from the elected MLAs. The Council includes Cabinet Ministers and Ministers of State.",
      ta: "முதலமைச்சர் அமைச்சர்களின் பட்டியலை ஆளுநருக்கு பரிந்துரைக்கிறார். தேர்ந்தெடுக்கப்பட்ட எம்.எல்.ஏக்களிலிருந்து அமைச்சர்கள் நியமிக்கப்படுகிறார்கள்.",
    },
    icon: "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z",
  },
  {
    number: 7,
    title: { en: "Portfolio Allocation", ta: "துறை ஒதுக்கீடு" },
    description: {
      en: "The CM allocates portfolios (departments) to each Minister. Key portfolios include Finance, Home, Health, Education, and Public Works. The CM may retain important portfolios.",
      ta: "முதலமைச்சர் ஒவ்வொரு அமைச்சருக்கும் துறைகளை ஒதுக்குகிறார். நிதி, உள்துறை, சுகாதாரம், கல்வி, பொதுப்பணி ஆகியவை முக்கிய துறைகள்.",
    },
    icon: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z",
  },
];

interface HistoricalCM {
  name: string;
  party: string;
  period: string;
}

const historicalCMs: HistoricalCM[] = [
  { name: "C.N. Annadurai", party: "DMK", period: "1967-1969" },
  { name: "M. Karunanidhi", party: "DMK", period: "1969-1971" },
  { name: "M.G. Ramachandran", party: "AIADMK", period: "1977-1987" },
  { name: "Janaki Ramachandran", party: "AIADMK", period: "1988 (brief)" },
  { name: "M. Karunanidhi", party: "DMK", period: "1989-1991" },
  { name: "J. Jayalalithaa", party: "AIADMK", period: "1991-1996" },
  { name: "M. Karunanidhi", party: "DMK", period: "1996-2001" },
  { name: "J. Jayalalithaa", party: "AIADMK", period: "2001-2006" },
  { name: "M. Karunanidhi", party: "DMK", period: "2006-2011" },
  { name: "J. Jayalalithaa", party: "AIADMK", period: "2011-2016" },
  { name: "O. Panneerselvam", party: "AIADMK", period: "2016-2017" },
  { name: "Edappadi K. Palaniswami", party: "AIADMK", period: "2017-2021" },
  { name: "M.K. Stalin", party: "DMK", period: "2021-present" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function FormationPage() {
  const { t, lang } = useLanguage();
  const [showHungExplainer, setShowHungExplainer] = useState(false);

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en"
              ? "How Government Forms"
              : "அரசு எவ்வாறு அமைகிறது"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en"
              ? "The step-by-step process of government formation after a state election in Tamil Nadu"
              : "தமிழ்நாட்டில் மாநிலத் தேர்தலுக்குப் பின் அரசு அமைக்கும் படிப்படியான செயல்முறை"}
          </p>
        </div>

        {/* Formation Steps */}
        <div className="mb-12">
          <div className="relative">
            {formationSteps.map((step, idx) => {
              const isLast = idx === formationSteps.length - 1;
              return (
                <div key={step.number} className="relative flex gap-4 pb-8">
                  {/* Vertical connector line */}
                  {!isLast && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-[var(--color-border)]" />
                  )}

                  {/* Step number circle */}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-sm font-bold text-white shadow-md">
                    {step.number}
                  </div>

                  {/* Step card */}
                  <div className="flex-1 rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-accent)]"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                        </svg>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
                            {t(step.title)}
                          </h3>
                          {step.date && (
                            <p className="mt-0.5 text-xs font-medium text-[var(--color-accent)]">
                              {lang === "en" ? step.date.en : step.date.ta}
                            </p>
                          )}
                          <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                            {t(step.description)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hung Assembly Explainer */}
        <div className="mb-12">
          <div
            className="cursor-pointer rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-all hover:shadow-md"
            onClick={() => setShowHungExplainer(!showHungExplainer)}
          >
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[var(--color-text)] sm:text-lg">
                  {lang === "en"
                    ? "What if no party gets a majority?"
                    : "எந்தக் கட்சிக்கும் பெரும்பான்மை கிடைக்கவில்லை என்றால்?"}
                </h2>
                <svg
                  className={`h-5 w-5 shrink-0 text-[var(--color-text-secondary)] transition-transform ${
                    showHungExplainer ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              {showHungExplainer && (
                <div className="mt-4 space-y-3 border-t border-[var(--color-border)]/50 pt-4">
                  {[
                    {
                      en: "Hung Assembly: When no single party or pre-election alliance wins 118+ seats, it is called a hung assembly.",
                      ta: "தொங்கு சட்டமன்றம்: எந்த ஒரு கட்சியோ அல்லது தேர்தலுக்கு முந்தைய கூட்டணியோ 118+ இடங்களை வெல்லவில்லை என்றால், அது தொங்கு சட்டமன்றம் எனப்படும்.",
                    },
                    {
                      en: "The Governor invites the party/alliance with the most seats to try to form a government by securing support from other parties.",
                      ta: "அதிக இடங்களைப் பெற்ற கட்சி/கூட்டணியை மற்ற கட்சிகளின் ஆதரவைப் பெற்று அரசை அமைக்குமாறு ஆளுநர் அழைக்கிறார்.",
                    },
                    {
                      en: "Post-election coalition: Parties negotiate to form a coalition that crosses the 118-seat majority mark.",
                      ta: "தேர்தலுக்குப் பிந்தைய கூட்டணி: 118 இடங்கள் பெரும்பான்மை எல்லையைத் தாண்டும் கூட்டணியை அமைக்க கட்சிகள் பேச்சுவார்த்தை நடத்துகின்றன.",
                    },
                    {
                      en: "Floor test: The CM-designate must prove majority through a floor test (confidence vote) in the Assembly within a specified timeframe.",
                      ta: "நம்பிக்கை வாக்கெடுப்பு: குறிப்பிட்ட காலக்கெடுவுக்குள் சட்டமன்றத்தில் பெரும்பான்மையை நிரூபிக்க வேண்டும்.",
                    },
                    {
                      en: "If no party can prove majority, fresh elections may be called — known as President's rule under Article 356.",
                      ta: "எந்தக் கட்சியும் பெரும்பான்மையை நிரூபிக்க முடியாவிட்டால், 356-வது பிரிவின் கீழ் குடியரசுத் தலைவர் ஆட்சி விதிக்கப்பட்டு புதிய தேர்தல் நடத்தப்படலாம்.",
                    },
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                      <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                      {lang === "en" ? point.en : point.ta}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historical CMs */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en"
              ? "Chief Ministers of Tamil Nadu (since 1967)"
              : "தமிழ்நாடு முதலமைச்சர்கள் (1967 முதல்)"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[var(--color-border)]/10">
                    <th className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {lang === "en" ? "Name" : "பெயர்"}
                    </th>
                    <th className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {lang === "en" ? "Party" : "கட்சி"}
                    </th>
                    <th className="px-4 py-3 font-semibold text-[var(--color-text)]">
                      {lang === "en" ? "Period" : "காலம்"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicalCMs.map((cm, idx) => (
                    <tr
                      key={`${cm.name}-${cm.period}`}
                      className={`border-b border-[var(--color-border)]/30 ${
                        idx % 2 === 0 ? "" : "bg-[var(--color-border)]/5"
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-[var(--color-text)]">
                        {cm.name}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                          style={{
                            backgroundColor:
                              cm.party === "DMK" ? "#E31E24" : "#00A650",
                          }}
                        >
                          {cm.party}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--color-text-secondary)]">
                        {cm.period}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
