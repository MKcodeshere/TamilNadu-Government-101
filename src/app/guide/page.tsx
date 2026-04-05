"use client";

import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface GuideSection {
  id: string;
  icon: string;
  title: BilingualText;
  items: GuideItem[];
}

interface GuideItem {
  icon: string;
  term: BilingualText;
  definition: BilingualText;
  keyFact?: BilingualText;
  link?: string;
}

const sections: GuideSection[] = [
  {
    id: "voting",
    icon: "🗳️",
    title: { en: "Your Vote — The Basics", ta: "உங்கள் வாக்கு — அடிப்படைகள்" },
    items: [
      {
        icon: "🗳️",
        term: { en: "How Voting Works", ta: "வாக்களிப்பது எப்படி" },
        definition: {
          en: "If you are 18 or older and an Indian citizen, you can vote. You need a Voter ID card (EPIC). On election day, you go to your polling booth and press the button next to your preferred candidate on the EVM (Electronic Voting Machine). Your vote is secret — nobody can see who you voted for.",
          ta: "நீங்கள் 18 வயது அல்லது அதற்கு மேற்பட்டவராகவும் இந்தியக் குடிமகனாகவும் இருந்தால் வாக்களிக்கலாம். உங்களுக்கு வாக்காளர் அடையாள அட்டை (EPIC) தேவை. தேர்தல் நாளில், உங்கள் வாக்குச்சாவடிக்குச் சென்று EVM-ல் (மின்னணு வாக்குப்பதிவு இயந்திரம்) உங்கள் விருப்பமான வேட்பாளருக்கு அருகில் உள்ள பொத்தானை அழுத்துங்கள். உங்கள் வாக்கு ரகசியமானது.",
        },
        keyFact: { en: "TN has 5.67 Crore eligible voters", ta: "தமிழ்நாட்டில் 5.67 கோடி வாக்காளர்கள்" },
      },
      {
        icon: "📍",
        term: { en: "Constituency (தொகுதி)", ta: "தொகுதி (Constituency)" },
        definition: {
          en: "A constituency is a specific area on the map. All the people living in that area vote together to choose ONE representative (MLA) to speak for them in the state assembly. Think of it as your neighbourhood's voice in government. Tamil Nadu is divided into 234 such areas.",
          ta: "தொகுதி என்பது வரைபடத்தில் ஒரு குறிப்பிட்ட பகுதி. அந்தப் பகுதியில் வாழும் அனைத்து மக்களும் ஒன்றாக வாக்களித்து, மாநில சட்டமன்றத்தில் தங்களுக்காகப் பேச ஒரு பிரதிநிதியை (எம்.எல்.ஏ.) தேர்ந்தெடுப்பார்கள். தமிழ்நாடு 234 தொகுதிகளாகப் பிரிக்கப்பட்டுள்ளது.",
        },
        keyFact: { en: "234 constituencies in Tamil Nadu", ta: "தமிழ்நாட்டில் 234 தொகுதிகள்" },
        link: "/legislature",
      },
      {
        icon: "🏷️",
        term: { en: "Reserved Constituencies (SC/ST)", ta: "ஒதுக்கப்பட்ட தொகுதிகள் (SC/ST)" },
        definition: {
          en: "Some constituencies are 'reserved' — only candidates from Scheduled Caste (SC) or Scheduled Tribe (ST) communities can stand for election there. Everyone in that area still votes, but the candidates must be from SC/ST. This ensures representation for historically marginalized communities.",
          ta: "சில தொகுதிகள் 'ஒதுக்கப்பட்டவை' — அங்கு ஆதிதிராவிடர் (SC) அல்லது பழங்குடியினர் (ST) சமூகத்தைச் சேர்ந்த வேட்பாளர்கள் மட்டுமே போட்டியிட முடியும். அந்தப் பகுதியில் உள்ள அனைவரும் வாக்களிப்பார்கள், ஆனால் வேட்பாளர்கள் SC/ST-ஆக இருக்க வேண்டும்.",
        },
        keyFact: { en: "44 SC + 2 ST reserved seats in TN", ta: "தமிழ்நாட்டில் 44 SC + 2 ST ஒதுக்கீடு" },
      },
    ],
  },
  {
    id: "leaders",
    icon: "👑",
    title: { en: "Who Runs the Government?", ta: "அரசாங்கத்தை நடத்துவது யார்?" },
    items: [
      {
        icon: "👑",
        term: { en: "Governor (ஆளுநர்)", ta: "ஆளுநர் (Governor)" },
        definition: {
          en: "The Governor is the constitutional head of the state, appointed by the President of India (not elected by people). The Governor's main job is to invite the winning party's leader to form the government, sign bills into law, and represent the state formally. Day-to-day governance is done by the Chief Minister, not the Governor.",
          ta: "ஆளுநர் மாநிலத்தின் அரசியலமைப்புத் தலைவர், இந்திய குடியரசுத் தலைவரால் நியமிக்கப்படுவார் (மக்களால் தேர்ந்தெடுக்கப்படுவதில்லை). வெற்றிபெற்ற கட்சியின் தலைவரை அரசாங்கம் அமைக்க அழைப்பது, மசோதாக்களில் கையொப்பமிடுவது ஆகியவை ஆளுநரின் முக்கிய பணிகள். அன்றாட ஆட்சியை முதலமைச்சர் நடத்துவார்.",
        },
        link: "/formation",
      },
      {
        icon: "⭐",
        term: { en: "Chief Minister (முதலமைச்சர்)", ta: "முதலமைச்சர் (Chief Minister)" },
        definition: {
          en: "The Chief Minister (CM) is the real head of the state government — the person who actually runs Tamil Nadu. The CM is the leader of the party (or alliance) that wins the most seats in the election. The Governor formally invites the CM to form the government. The CM picks ministers, decides policies, and is answerable to the Legislative Assembly.",
          ta: "முதலமைச்சர் (முதல்வர்) மாநில அரசின் உண்மையான தலைவர் — தமிழ்நாட்டை உண்மையில் நிர்வகிப்பவர். தேர்தலில் அதிக இடங்களை வெற்றிபெறும் கட்சியின் (அல்லது கூட்டணியின்) தலைவர் முதலமைச்சர் ஆவார். முதலமைச்சர் அமைச்சர்களைத் தேர்ந்தெடுப்பார், கொள்கைகளை முடிவு செய்வார்.",
        },
        link: "/formation",
      },
      {
        icon: "📋",
        term: { en: "MLA (சட்டமன்ற உறுப்பினர்)", ta: "எம்.எல்.ஏ. (MLA)" },
        definition: {
          en: "MLA stands for Member of Legislative Assembly. This is the person YOU directly elect from your constituency. Their job is to represent your area's interests in the state assembly, raise local issues, and vote on laws. Each of the 234 constituencies has one MLA. They serve a 5-year term.",
          ta: "எம்.எல்.ஏ. என்பது சட்டமன்ற உறுப்பினர். இவர்தான் உங்கள் தொகுதியிலிருந்து நீங்கள் நேரடியாகத் தேர்ந்தெடுக்கும் நபர். உங்கள் பகுதியின் நலன்களை சட்டமன்றத்தில் பிரதிநிதித்துவப்படுத்துவது, உள்ளூர் பிரச்சினைகளை எழுப்புவது, சட்டங்களுக்கு வாக்களிப்பது ஆகியவை அவர்களின் பணி. பதவிக்காலம் 5 ஆண்டுகள்.",
        },
        keyFact: { en: "234 MLAs represent all of Tamil Nadu", ta: "234 எம்.எல்.ஏ.க்கள் தமிழ்நாடு முழுவதையும் பிரதிநிதித்துவப்படுத்துகின்றனர்" },
        link: "/legislature",
      },
      {
        icon: "🏛️",
        term: { en: "Speaker (சபாநாயகர்)", ta: "சபாநாயகர் (Speaker)" },
        definition: {
          en: "The Speaker is like the referee of the assembly. Elected by MLAs from among themselves, the Speaker maintains order during debates, decides who gets to speak, and ensures rules are followed. The Speaker does not usually vote except to break a tie.",
          ta: "சபாநாயகர் சட்டமன்றத்தின் நடுவர் போன்றவர். எம்.எல்.ஏ.க்களால் தங்களிடையே இருந்து தேர்ந்தெடுக்கப்படுவார். விவாதங்களின் போது ஒழுங்கைப் பேணுவது, யார் பேசலாம் என்பதை முடிவு செய்வது, விதிகள் பின்பற்றப்படுவதை உறுதி செய்வது ஆகியவை பணிகள்.",
        },
      },
      {
        icon: "📁",
        term: { en: "Cabinet Minister vs State Minister", ta: "அமைச்சரவை அமைச்சர் vs மாநில அமைச்சர்" },
        definition: {
          en: "Cabinet Ministers are senior — they attend cabinet meetings where major decisions are made and handle important departments like Finance, Health, Education. State Ministers (Ministers of State) are junior — they assist cabinet ministers and handle smaller portfolios. Both are appointed by the CM.",
          ta: "அமைச்சரவை அமைச்சர்கள் மூத்தவர்கள் — நிதி, சுகாதாரம், கல்வி போன்ற முக்கிய துறைகளை நிர்வகிப்பார்கள். மாநில அமைச்சர்கள் இளையவர்கள் — அமைச்சரவை அமைச்சர்களுக்கு உதவுவார்கள். இருவரையும் முதலமைச்சர் நியமிப்பார்.",
        },
        link: "/formation",
      },
    ],
  },
  {
    id: "assembly",
    icon: "🏛️",
    title: { en: "The Legislative Assembly", ta: "சட்டமன்றம்" },
    items: [
      {
        icon: "🏛️",
        term: { en: "Legislative Assembly (சட்டமன்றம்)", ta: "சட்டமன்றம் (Legislative Assembly)" },
        definition: {
          en: "This is where all 234 MLAs meet to debate and make laws for Tamil Nadu. Located at Fort St. George in Chennai, it is the highest law-making body of the state. The assembly meets in sessions, and any new law (Bill) must be debated and voted on here before it becomes an Act.",
          ta: "இங்குதான் 234 எம்.எல்.ஏ.க்கள் அனைவரும் சந்தித்து தமிழ்நாட்டிற்கான சட்டங்களை விவாதித்து இயற்றுவார்கள். சென்னை கோட்டை செயின்ட் ஜார்ஜில் அமைந்துள்ளது. எந்தவொரு புதிய சட்டமும் (மசோதா) இங்கு விவாதிக்கப்பட்டு வாக்களிக்கப்பட்ட பின்னரே சட்டமாகும்.",
        },
        keyFact: { en: "Located at Fort St. George, Chennai — built in 1640", ta: "சென்னை கோட்டை செயின்ட் ஜார்ஜில் — 1640-ல் கட்டப்பட்டது" },
        link: "/legislature",
      },
      {
        icon: "⚖️",
        term: { en: "High Court (உயர்நீதிமன்றம்)", ta: "உயர்நீதிமன்றம் (High Court)" },
        definition: {
          en: "The Madras High Court is the highest court in Tamil Nadu. It is independent of the government — neither the Governor nor the CM can tell the judges what to do. The court protects your fundamental rights and ensures the government follows the law. It has a bench in Madurai too.",
          ta: "சென்னை உயர்நீதிமன்றம் தமிழ்நாட்டின் மிக உயர்ந்த நீதிமன்றம். இது அரசாங்கத்திலிருந்து சுதந்திரமானது — ஆளுநரோ முதலமைச்சரோ நீதிபதிகளுக்கு என்ன செய்ய வேண்டும் என்று சொல்ல முடியாது. மதுரையிலும் ஒரு கிளை உள்ளது.",
        },
        keyFact: { en: "Established in 1862 — one of India's oldest High Courts", ta: "1862-ல் நிறுவப்பட்டது — இந்தியாவின் பழமையான உயர்நீதிமன்றங்களில் ஒன்று" },
      },
    ],
  },
  {
    id: "admin",
    icon: "🗺️",
    title: { en: "Administrative Divisions — Where You Live", ta: "நிர்வாகப் பிரிவுகள் — நீங்கள் வாழும் இடம்" },
    items: [
      {
        icon: "🗺️",
        term: { en: "District (மாவட்டம்)", ta: "மாவட்டம் (District)" },
        definition: {
          en: "Tamil Nadu is divided into 38 districts — large administrative areas, each headed by a District Collector (an IAS officer appointed by the government). The Collector manages law and order, revenue collection, disaster relief, and coordinates all government programs in the district.",
          ta: "தமிழ்நாடு 38 மாவட்டங்களாகப் பிரிக்கப்பட்டுள்ளது — ஒவ்வொன்றும் ஒரு மாவட்ட ஆட்சியரால் (அரசால் நியமிக்கப்பட்ட IAS அதிகாரி) தலைமையிடப்படுகின்றன. சட்டம் ஒழுங்கு, வருவாய் வசூல், பேரிடர் நிவாரணம், அரசுத் திட்டங்கள் ஒருங்கிணைப்பு ஆகியவற்றை ஆட்சியர் நிர்வகிப்பார்.",
        },
        keyFact: { en: "38 districts — from Chennai (smallest) to Villupuram (largest)", ta: "38 மாவட்டங்கள் — சென்னை (சிறியது) முதல் விழுப்புரம் (பெரியது) வரை" },
        link: "/districts",
      },
      {
        icon: "📐",
        term: { en: "Taluk (தாலுகா)", ta: "தாலுகா (Taluk)" },
        definition: {
          en: "A taluk is a sub-division of a district, used for revenue and land administration. Each taluk has a Tahsildar (revenue officer) who manages land records, property registration, and tax collection. Districts have between 3 to 17 taluks each.",
          ta: "தாலுகா என்பது மாவட்டத்தின் உட்பிரிவு, வருவாய் மற்றும் நில நிர்வாகத்திற்குப் பயன்படுத்தப்படுகிறது. ஒவ்வொரு தாலுகாவிலும் ஒரு தாசில்தார் (வருவாய் அதிகாரி) நில பதிவுகள், சொத்துப் பதிவு, வரி வசூல் ஆகியவற்றை நிர்வகிப்பார்.",
        },
      },
      {
        icon: "🏘️",
        term: { en: "District Collector (மாவட்ட ஆட்சியர்)", ta: "மாவட்ட ஆட்சியர் (District Collector)" },
        definition: {
          en: "The most powerful government official in a district. An IAS (Indian Administrative Service) officer, the Collector is responsible for maintaining law and order, collecting revenue, managing elections, disaster management, and implementing all government welfare schemes in the district.",
          ta: "ஒரு மாவட்டத்தில் மிகவும் சக்திவாய்ந்த அரசு அதிகாரி. IAS (இந்திய நிர்வாகச் சேவை) அதிகாரியான ஆட்சியர், சட்டம் ஒழுங்கு, வருவாய் வசூல், தேர்தல் நடத்துதல், பேரிடர் மேலாண்மை, அரசு நலத்திட்டங்களை செயல்படுத்துதல் ஆகியவற்றிற்குப் பொறுப்பு.",
        },
      },
    ],
  },
  {
    id: "local",
    icon: "🏠",
    title: { en: "Local Government — Closest to You", ta: "உள்ளாட்சி — உங்களுக்கு நெருக்கமானது" },
    items: [
      {
        icon: "🏠",
        term: { en: "Village Panchayat (கிராம பஞ்சாயத்து)", ta: "கிராம பஞ்சாயத்து (Village Panchayat)" },
        definition: {
          en: "The most basic unit of local government in rural areas. A group of villages forms a panchayat, governed by an elected Panchayat President and ward members. They handle village roads, streetlights, drinking water, sanitation, and local disputes. You directly elect your panchayat president.",
          ta: "கிராமப்புறங்களில் உள்ளாட்சியின் மிக அடிப்படையான அலகு. ஒரு குழு கிராமங்கள் ஒரு பஞ்சாயத்தை உருவாக்கும், தேர்ந்தெடுக்கப்பட்ட பஞ்சாயத்து தலைவர் மற்றும் வார்டு உறுப்பினர்களால் நிர்வகிக்கப்படும். கிராம சாலைகள், தெரு விளக்குகள், குடிநீர், சுகாதாரம் ஆகியவற்றை நிர்வகிப்பார்கள்.",
        },
        keyFact: { en: "12,620+ village panchayats across TN", ta: "தமிழ்நாடு முழுவதும் 12,620+ கிராம பஞ்சாயத்துகள்" },
      },
      {
        icon: "🏡",
        term: { en: "Town Panchayat (பேரூராட்சி)", ta: "பேரூராட்சி (Town Panchayat)" },
        definition: {
          en: "A town panchayat governs small towns that are bigger than villages but not big enough to be municipalities. They provide urban-like services: roads, drainage, street cleaning, markets, and birth/death certificates.",
          ta: "கிராமங்களை விட பெரிய ஆனால் நகராட்சிகளாக இருக்கும் அளவிற்கு பெரியதல்லாத சிறு நகரங்களை பேரூராட்சி நிர்வகிக்கிறது. சாலைகள், வடிகால், சந்தைகள், பிறப்பு/இறப்புச் சான்றிதழ்கள் போன்ற சேவைகளை வழங்குகிறது.",
        },
        keyFact: { en: "490 town panchayats in TN", ta: "தமிழ்நாட்டில் 490 பேரூராட்சிகள்" },
      },
      {
        icon: "🏙️",
        term: { en: "Municipality / Corporation", ta: "நகராட்சி / மாநகராட்சி" },
        definition: {
          en: "Municipalities govern larger towns, and Municipal Corporations govern big cities like Chennai, Coimbatore, and Madurai. They handle water supply, sewage, roads, urban planning, property tax, and public health. A Mayor heads each corporation, elected by the people.",
          ta: "நகராட்சிகள் பெரிய நகரங்களையும், மாநகராட்சிகள் சென்னை, கோயம்புத்தூர், மதுரை போன்ற பெருநகரங்களையும் நிர்வகிக்கின்றன. குடிநீர், கழிவுநீர், சாலைகள், நகர திட்டமிடல், சொத்து வரி, பொது சுகாதாரம் ஆகியவற்றை நிர்வகிக்கின்றன. ஒவ்வொரு மாநகராட்சிக்கும் மக்களால் தேர்ந்தெடுக்கப்பட்ட மேயர் தலைமை தாங்குவார்.",
        },
        keyFact: { en: "25 corporations + 138 municipalities", ta: "25 மாநகராட்சிகள் + 138 நகராட்சிகள்" },
      },
    ],
  },
  {
    id: "structure",
    icon: "📊",
    title: { en: "Who Reports to Whom?", ta: "யார் யாருக்கு அறிக்கை செய்கிறார்கள்?" },
    items: [
      {
        icon: "📊",
        term: { en: "Government Hierarchy", ta: "அரசாங்க படிநிலை" },
        definition: {
          en: "Governor (constitutional head) → Chief Minister (runs the government) → Cabinet Ministers (handle departments) → Secretaries (IAS officers who execute) → Department heads → District Collectors → Taluk officers → Local body heads. The judiciary (High Court) is independent and separate from this chain.",
          ta: "ஆளுநர் (அரசியலமைப்புத் தலைவர்) → முதலமைச்சர் (அரசை நடத்துபவர்) → அமைச்சரவை அமைச்சர்கள் (துறைகளை நிர்வகிப்பவர்கள்) → செயலாளர்கள் (IAS அதிகாரிகள்) → துறை தலைவர்கள் → மாவட்ட ஆட்சியர்கள் → தாலுகா அதிகாரிகள் → உள்ளாட்சி அமைப்பு தலைவர்கள். நீதித்துறை (உயர்நீதிமன்றம்) சுதந்திரமானது.",
        },
      },
      {
        icon: "🏘️",
        term: { en: "Local Body Hierarchy (Rural)", ta: "உள்ளாட்சி படிநிலை (கிராமம்)" },
        definition: {
          en: "Village Panchayat (village level) → Panchayat Union / Block (group of villages) → District Panchayat (district level). Each level has elected representatives. This three-tier system is called 'Panchayati Raj' and was designed to bring governance to the grassroots.",
          ta: "கிராம பஞ்சாயத்து (கிராம அளவு) → ஊராட்சி ஒன்றியம் / வட்டாரம் (கிராமங்களின் குழு) → மாவட்ட பஞ்சாயத்து (மாவட்ட அளவு). ஒவ்வொரு நிலையிலும் தேர்ந்தெடுக்கப்பட்ட பிரதிநிதிகள் உள்ளனர். இந்த மூன்று அடுக்கு அமைப்பு 'பஞ்சாயத்து ராஜ்' என்று அழைக்கப்படுகிறது.",
        },
      },
    ],
  },
];

function GuideCard({ item, lang }: { item: GuideItem; lang: "en" | "ta" }) {
  const t = (b: BilingualText) => (lang === "ta" ? b.ta : b.en);

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-[var(--color-text)] sm:text-lg leading-tight">
            {t(item.term)}
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {t(item.definition)}
          </p>
          {item.keyFact && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
              <span>💡</span> {t(item.keyFact)}
            </div>
          )}
          {item.link && (
            <Link
              href={item.link}
              className="mt-2 block text-xs font-medium text-[var(--color-accent)] hover:underline"
            >
              {lang === "en" ? "Explore this →" : "இதை ஆராயுங்கள் →"}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GuidePage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Hero */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)]/10 px-4 py-1.5 text-sm font-semibold text-[var(--color-accent)] mb-4">
            🗳️ {lang === "en" ? "First-Time Voter? Start Here!" : "முதல் முறை வாக்காளரா? இங்கே தொடங்குங்கள்!"}
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl lg:text-4xl">
            {lang === "en"
              ? "Government 101"
              : "அரசாங்கம் 101"}
          </h1>
          <p className="mt-1 text-base text-[var(--color-text)]">
            {lang === "en"
              ? "How Tamil Nadu's Government Works"
              : "தமிழ்நாடு அரசாங்கம் எவ்வாறு செயல்படுகிறது"}
          </p>
          <p className="mt-3 text-sm text-[var(--color-text-secondary)] max-w-xl mx-auto">
            {lang === "en"
              ? "A simple guide to understanding your state government — who does what, how elections work, and where you fit in. No jargon, just the facts."
              : "உங்கள் மாநில அரசாங்கத்தைப் புரிந்துகொள்ள எளிய வழிகாட்டி — யார் என்ன செய்கிறார்கள், தேர்தல்கள் எவ்வாறு நடக்கின்றன, நீங்கள் எங்கே பொருந்துவீர்கள்."}
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="mb-8 rounded-xl border border-[var(--color-border)] bg-white/80 p-4">
          <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">
            {lang === "en" ? "Jump to" : "செல்ல"}
          </p>
          <div className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] transition-colors"
              >
                {s.icon} {lang === "ta" ? s.title.ta : s.title.en}
              </a>
            ))}
          </div>
        </nav>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="mb-10 scroll-mt-20">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{section.icon}</span>
              <h2 className="text-lg font-bold text-[var(--color-text)] sm:text-xl">
                {lang === "ta" ? section.title.ta : section.title.en}
              </h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <GuideCard key={item.term.en} item={item} lang={lang} />
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <div className="mt-12 rounded-xl bg-gradient-to-r from-[#4A148C]/5 to-[#C84B31]/5 border border-[var(--color-border)] p-6 text-center">
          <p className="text-lg font-bold text-[var(--color-text)]">
            {lang === "en" ? "Ready to explore?" : "ஆராய தயாரா?"}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {lang === "en"
              ? "Now that you know the basics, dive into the interactive visualizations."
              : "அடிப்படைகளை அறிந்த பிறகு, ஊடாடும் காட்சிமயமாக்கல்களில் மூழ்குங்கள்."}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
              {lang === "en" ? "🏠 Home" : "🏠 முகப்பு"}
            </Link>
            <Link href="/districts" className="rounded-lg bg-[var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors">
              {lang === "en" ? "🔍 Find Your Area" : "🔍 உங்கள் பகுதியைக் கண்டறியுங்கள்"}
            </Link>
            <Link href="/elections" className="rounded-lg bg-[var(--color-accent)]/10 px-4 py-2 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors">
              {lang === "en" ? "🗳️ Elections 2026" : "🗳️ தேர்தல் 2026"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
