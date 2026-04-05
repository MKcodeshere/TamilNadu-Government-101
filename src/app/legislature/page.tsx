"use client";

import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface LegislativeStep {
  number: number;
  title: { en: string; ta: string };
  summary: { en: string; ta: string };
  details: { en: string[]; ta: string[] };
  icon: string;
}

const legislativeSteps: LegislativeStep[] = [
  {
    number: 1,
    title: { en: "Drafting", ta: "வரைவு" },
    summary: {
      en: "Bill drafted by the sponsoring department",
      ta: "சம்பந்தப்பட்ட துறையால் மசோதா வரையப்படுகிறது",
    },
    details: {
      en: [
        "The sponsoring department prepares the initial draft of the bill",
        "The draft is sent to the Law Department for legal vetting",
        "The Law Department checks for constitutional validity and consistency with existing laws",
        "The vetted draft is placed before the Cabinet for approval",
        "Once Cabinet approves, the bill is ready for introduction in the Assembly",
      ],
      ta: [
        "சம்பந்தப்பட்ட துறை மசோதாவின் ஆரம்ப வரைவை தயாரிக்கிறது",
        "வரைவு சட்டத் துறைக்கு அனுப்பப்படுகிறது",
        "சட்டத் துறை அரசியலமைப்பு செல்லுபடியாகும் தன்மையை சரிபார்க்கிறது",
        "அமைச்சரவை ஒப்புதலுக்காக வைக்கப்படுகிறது",
        "அமைச்சரவை ஒப்புதல் அளித்தவுடன் சட்டமன்றத்தில் அறிமுகம் செய்ய தயார்",
      ],
    },
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  },
  {
    number: 2,
    title: { en: "Introduction / First Reading", ta: "அறிமுகம் / முதல் வாசிப்பு" },
    summary: {
      en: "Minister introduces the bill in the Legislative Assembly",
      ta: "அமைச்சர் சட்டமன்றத்தில் மசோதாவை அறிமுகம் செய்கிறார்",
    },
    details: {
      en: [
        "The Minister in charge moves for leave to introduce the bill",
        "The title and objectives of the bill are read out",
        "The bill is published in the Tamil Nadu Government Gazette",
        "Copies are circulated to all members",
        "No detailed discussion takes place at this stage",
      ],
      ta: [
        "பொறுப்பு அமைச்சர் மசோதாவை அறிமுகப்படுத்த அனுமதி கோருகிறார்",
        "மசோதாவின் தலைப்பும் நோக்கங்களும் வாசிக்கப்படுகின்றன",
        "தமிழ்நாடு அரசிதழில் வெளியிடப்படுகிறது",
        "அனைத்து உறுப்பினர்களுக்கும் நகல்கள் அனுப்பப்படுகின்றன",
        "இந்த கட்டத்தில் விரிவான விவாதம் நடைபெறாது",
      ],
    },
    icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z",
  },
  {
    number: 3,
    title: { en: "General Discussion / Second Reading", ta: "பொது விவாதம் / இரண்டாம் வாசிப்பு" },
    summary: {
      en: "Principles and general provisions of the bill are debated",
      ta: "மசோதாவின் கொள்கைகள் மற்றும் பொது விதிகள் விவாதிக்கப்படுகின்றன",
    },
    details: {
      en: [
        "Members debate the general principles and policy behind the bill",
        "No clause-by-clause discussion at this stage",
        "The bill may be referred to a Select Committee for detailed examination",
        "The Select Committee submits its report with recommendations",
        "If referred to committee, the bill returns to the House with committee recommendations",
      ],
      ta: [
        "உறுப்பினர்கள் மசோதாவின் கொள்கைகளை விவாதிக்கின்றனர்",
        "இந்த கட்டத்தில் பிரிவு வாரியான விவாதம் இல்லை",
        "விரிவான ஆய்வுக்கு தேர்வுக் குழுவுக்கு அனுப்பப்படலாம்",
        "தேர்வுக் குழு பரிந்துரைகளுடன் அறிக்கை சமர்ப்பிக்கிறது",
        "குழுவின் பரிந்துரைகளுடன் மசோதா சபைக்கு திரும்புகிறது",
      ],
    },
    icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155",
  },
  {
    number: 4,
    title: { en: "Clause-by-Clause Discussion", ta: "பிரிவு வாரியான விவாதம்" },
    summary: {
      en: "Each clause of the bill is discussed and voted upon",
      ta: "மசோதாவின் ஒவ்வொரு பிரிவும் விவாதிக்கப்பட்டு வாக்களிக்கப்படுகிறது",
    },
    details: {
      en: [
        "Each clause of the bill is taken up individually",
        "Members can propose amendments to specific clauses",
        "Amendments are debated and voted upon",
        "The Speaker decides whether an amendment is admissible",
        "New clauses may also be proposed and added",
      ],
      ta: [
        "மசோதாவின் ஒவ்வொரு பிரிவும் தனித்தனியாக எடுக்கப்படுகிறது",
        "குறிப்பிட்ட பிரிவுகளுக்கு உறுப்பினர்கள் திருத்தங்களை முன்மொழியலாம்",
        "திருத்தங்கள் விவாதிக்கப்பட்டு வாக்களிக்கப்படுகின்றன",
        "திருத்தம் ஏற்கத்தக்கதா என்பதை சபாநாயகர் தீர்மானிக்கிறார்",
        "புதிய பிரிவுகளும் முன்மொழியப்படலாம்",
      ],
    },
    icon: "M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
  },
  {
    number: 5,
    title: { en: "Third Reading / Voting", ta: "மூன்றாம் வாசிப்பு / வாக்கெடுப்பு" },
    summary: {
      en: "The bill is put to a final vote in the Assembly",
      ta: "சட்டமன்றத்தில் இறுதி வாக்கெடுப்பு நடத்தப்படுகிறது",
    },
    details: {
      en: [
        "The bill, as amended, is put to vote as a whole",
        "Simple majority is needed: more than half of members present and voting",
        "In Tamil Nadu, with 234 MLAs, the absolute majority mark is 118",
        "Voting is usually by voice vote; division can be demanded",
        "If passed, the bill is sent to the Governor for assent",
      ],
      ta: [
        "திருத்தப்பட்ட மசோதா முழுமையாக வாக்கெடுப்புக்கு வைக்கப்படுகிறது",
        "சாதாரண பெரும்பான்மை தேவை: ஆஜரான உறுப்பினர்களில் பாதிக்கு மேல்",
        "234 எம்.எல்.ஏக்களில் முழுமையான பெரும்பான்மை எண் 118",
        "வாக்கெடுப்பு பொதுவாக குரல் வாக்கு மூலம்; பிரிவு கோரலாம்",
        "நிறைவேற்றப்பட்டால் ஆளுநர் ஒப்புதலுக்கு அனுப்பப்படுகிறது",
      ],
    },
    icon: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    number: 6,
    title: { en: "Governor's Assent", ta: "ஆளுநர் ஒப்புதல்" },
    summary: {
      en: "Governor signs the bill into law or returns it",
      ta: "ஆளுநர் மசோதாவில் கையொப்பமிடுகிறார் அல்லது திருப்பி அனுப்புகிறார்",
    },
    details: {
      en: [
        "The Governor can give assent — the bill becomes an Act",
        "The Governor can withhold assent (rare in practice)",
        "The Governor can return the bill to the Assembly for reconsideration",
        "If the Assembly passes it again, the Governor must give assent",
        "The Governor can reserve the bill for the President of India's consideration",
        "Once assented, the Act is published in the Gazette and comes into force",
      ],
      ta: [
        "ஆளுநர் ஒப்புதல் அளிக்கலாம் — மசோதா சட்டமாகிறது",
        "ஆளுநர் ஒப்புதலை நிறுத்தி வைக்கலாம் (நடைமுறையில் அரிது)",
        "மசோதாவை மறுபரிசீலனைக்கு திருப்பி அனுப்பலாம்",
        "சட்டமன்றம் மீண்டும் நிறைவேற்றினால் ஆளுநர் ஒப்புதல் அளிக்க வேண்டும்",
        "குடியரசுத் தலைவரின் பரிசீலனைக்கு ஒதுக்கி வைக்கலாம்",
        "ஒப்புதல் அளித்தவுடன் அரசிதழில் வெளியிடப்பட்டு நடைமுறைக்கு வரும்",
      ],
    },
    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z",
  },
];

interface BillType {
  title: { en: string; ta: string };
  description: { en: string; ta: string };
}

const billTypes: BillType[] = [
  {
    title: { en: "Government Bills", ta: "அரசு மசோதாக்கள்" },
    description: {
      en: "Introduced by a Minister on behalf of the government. Most legislation falls under this category.",
      ta: "அரசின் சார்பாக அமைச்சரால் அறிமுகப்படுத்தப்படுகிறது. பெரும்பாலான சட்டங்கள் இதில் அடங்கும்.",
    },
  },
  {
    title: { en: "Private Member Bills", ta: "தனியார் உறுப்பினர் மசோதாக்கள்" },
    description: {
      en: "Introduced by any MLA who is not a Minister. Rarely passed but can influence government policy.",
      ta: "அமைச்சர் அல்லாத எம்.எல்.ஏவால் அறிமுகப்படுத்தப்படுகிறது. அரிதாகவே நிறைவேற்றப்படும்.",
    },
  },
  {
    title: { en: "Money Bills", ta: "நிதி மசோதாக்கள்" },
    description: {
      en: "Deals with taxation, government spending, or borrowing. Can only be introduced by the government with Governor's recommendation.",
      ta: "வரிவிதிப்பு, அரசு செலவு, கடன் தொடர்பானது. ஆளுநர் பரிந்துரையுடன் அரசால் மட்டுமே அறிமுகப்படுத்த முடியும்.",
    },
  },
  {
    title: { en: "Ordinances", ta: "அவசரச் சட்டங்கள்" },
    description: {
      en: "Issued by the Governor when the Assembly is not in session. Has the same force as law but must be ratified within 6 weeks of the next session.",
      ta: "சட்டமன்றம் கூடாத போது ஆளுநரால் வெளியிடப்படுகிறது. சட்டத்திற்கு சமமான வலிமை. அடுத்த கூட்டத்தொடரின் 6 வாரங்களுக்குள் அங்கீகரிக்கப்பட வேண்டும்.",
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function LegislaturePage() {
  const { t, lang } = useLanguage();
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const toggleStep = (num: number) => {
    setExpandedStep(expandedStep === num ? null : num);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
            {lang === "en"
              ? "How Laws are Made"
              : "சட்டங்கள் எவ்வாறு உருவாகின்றன"}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] sm:text-base">
            {lang === "en"
              ? "TN has a unicameral legislature (single house) — the Tamil Nadu Legislative Assembly with 234 members."
              : "தமிழ்நாடு ஒரு அவைக் குழு முறையைக் கொண்டுள்ளது — 234 உறுப்பினர்கள் கொண்ட சட்டமன்றம்."}
          </p>
        </div>

        {/* Legislative Process Steps */}
        <div className="mb-12">
          <div className="relative">
            {legislativeSteps.map((step, idx) => {
              const isExpanded = expandedStep === step.number;
              const isLast = idx === legislativeSteps.length - 1;
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
                  <div
                    className={`flex-1 cursor-pointer rounded-xl border border-[var(--color-border)] bg-white shadow-sm transition-all hover:shadow-md ${
                      isExpanded ? "ring-1 ring-[var(--color-accent)]/30" : ""
                    }`}
                    onClick={() => toggleStep(step.number)}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-3">
                        <svg
                          className="h-5 w-5 shrink-0 text-[var(--color-accent)]"
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
                          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                            {t(step.summary)}
                          </p>
                        </div>
                        <svg
                          className={`h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className="mt-4 border-t border-[var(--color-border)]/50 pt-3">
                          <ul className="space-y-2">
                            {(lang === "en" ? step.details.en : step.details.ta).map((detail, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                                <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Types of Bills */}
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Types of Bills" : "மசோதா வகைகள்"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {billTypes.map((bt) => (
              <div
                key={bt.title.en}
                className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-5"
              >
                <h3 className="text-sm font-semibold text-[var(--color-text)] sm:text-base">
                  {t(bt.title)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                  {t(bt.description)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Facts */}
        <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-sm sm:p-6">
          <h2 className="mb-3 text-lg font-semibold text-[var(--color-text)] sm:text-xl">
            {lang === "en" ? "Key Facts" : "முக்கிய உண்மைகள்"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                label: { en: "Total MLAs", ta: "மொத்த எம்.எல்.ஏக்கள்" },
                value: "234",
              },
              {
                label: { en: "Quorum (10%)", ta: "குறைந்தபட்ச எண்ணிக்கை (10%)" },
                value: "24",
              },
              {
                label: { en: "Simple Majority", ta: "சாதாரண பெரும்பான்மை" },
                value: "118 / 234",
              },
            ].map((fact) => (
              <div key={fact.label.en} className="text-center">
                <p className="text-2xl font-bold text-[var(--color-accent)] sm:text-3xl">
                  {fact.value}
                </p>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] sm:text-sm">
                  {lang === "en" ? fact.label.en : fact.label.ta}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
