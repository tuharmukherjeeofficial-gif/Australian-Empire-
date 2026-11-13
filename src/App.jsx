import React, { useState } from 'react';
import { 
  Shield, Landmark, Users, Scroll, AlertTriangle, Play, 
  CheckCircle, FileText, UserCheck, Zap, Calendar, Layers, Vote, Award
} from 'lucide-react';

// --- CONSTITUTIONAL DEFINITIONS & STATE APPORTIONMENTS ---
const JURISDICTIONS = {
  NSW: { name: "New South Wales", peoples: 9, custody: 2, electoral: 11, leg: 27, region: 'state', baseVote: 1450000 },
  VIC: { name: "Victoria", peoples: 8, custody: 2, electoral: 10, leg: 24, region: 'state', baseVote: 1280000 },
  QLD: { name: "Queensland", peoples: 7, custody: 2, electoral: 9, leg: 21, region: 'state', baseVote: 1050000 },
  WA:  { name: "Western Australia", peoples: 6, custody: 2, electoral: 8, leg: 18, region: 'state', baseVote: 780000 },
  SA:  { name: "South Australia", peoples: 6, custody: 2, electoral: 8, leg: 18, region: 'state', baseVote: 640000 },
  TAS: { name: "Tasmania", peoples: 4, custody: 2, electoral: 6, leg: 12, region: 'state', baseVote: 310000 },
  NT:  { name: "Northern Territory", peoples: 4, custody: 2, electoral: 6, custodyType: '1 Voting + 1 Senator Custodian (Non-Voting)', leg: 12, region: 'territory', baseVote: 190000 },
  ACT: { name: "Australian Capital Territory", peoples: 2, custody: 1, electoral: 3, custodyType: 'Senator Custodian (Non-Voting)', leg: 4, region: 'territory', baseVote: 220000 }
};

const POLITICAL_PARTIES = [
  { id: 'royal_chambers', name: 'Royal Chambers', short: 'Royal Chambers', alignment: 'Right-Wing / Moderately Conservative', status: 'Oldest Party', base: 'National', ideology: 'Traditionalist, Conservative', color: 'text-sky-400 border-sky-500/40 bg-sky-950/30' },
  { id: 'orange_party', name: 'Orange Party', short: 'Orange Party', alignment: 'Left-Wing / Moderately Liberal', status: 'Active', base: 'National', ideology: 'Progressive, Social Liberal', color: 'text-orange-400 border-orange-500/40 bg-orange-950/30' },
  { id: 'ndp_australia', name: 'National Democratic Party of Australia', short: 'NDP Australia', alignment: 'Centrist', status: 'Active', base: 'National', ideology: 'Pragmatic Center, Moderate Reform', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/30' },
  { id: 'cebone', name: 'Cebone Party', short: 'Cebone Party', alignment: 'Local / Extremist Faction', status: 'Regional Active', base: 'New South Wales', ideology: 'Localist, Radical Extremist', color: 'text-rose-400 border-rose-500/40 bg-rose-950/30' },
  { id: 'severity_group', name: 'Severity Group', short: 'Severity Group', alignment: 'Alliance with Cebone / Extremist Faction', status: 'Regional Active', base: 'Victoria', ideology: 'Militant Localist, Radical', color: 'text-purple-400 border-purple-500/40 bg-purple-950/30' }
];

const INITIAL_ROLES = [
  { id: 'premier', title: 'The Premier', category: 'Executive', house: 'PRIME', occupant: 'AI Bot', isHuman: false },
  { id: 'chancellor', title: 'The Chancellor', category: 'Executive', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false },
  { id: 'speaker_peoples', title: "Speaker of People's House", category: 'Presiding Officer', house: 'PEOPLES', occupant: 'AI Bot', isHuman: false },
  { id: 'presiding_senate', title: 'Presiding Officer of Imperial Senate', category: 'Presiding Officer', house: 'SENATE', occupant: 'AI Bot', isHuman: false },
  { id: 'gov_nsw', title: 'Governor of New South Wales', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'NSW' },
  { id: 'gov_vic', title: 'Governor of Victoria', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'VIC' },
  { id: 'gov_qld', title: 'Governor of Queensland', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'QLD' },
  { id: 'gov_wa', title: 'Governor of Western Australia', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'WA' },
  { id: 'gov_sa', title: 'Governor of South Australia', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'SA' },
  { id: 'gov_tas', title: 'Governor of Tasmania', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'TAS' },
  { id: 'lt_gov_act', title: 'Lieutenant Governor of ACT', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'ACT' },
  { id: 'lt_gov_nt', title: 'Lieutenant Governor of NT', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, state: 'NT' },
  // 11 Cabinet Secretaries
  { id: 'sec_state', title: 'Secretary of State', category: 'Cabinet', house: 'SENATE', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_defense', title: 'Secretary of Defense', category: 'Cabinet', house: 'PRIME', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_treasury', title: 'Secretary of Treasury', category: 'Cabinet', house: 'PEOPLES', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_interior', title: 'Secretary of Interior', category: 'Cabinet', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_homeland', title: 'Secretary of Homeland Security', category: 'Cabinet', house: 'PRIME', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_agri', title: 'Secretary of Agriculture', category: 'Cabinet', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_transport', title: 'Secretary of Transport', category: 'Cabinet', house: 'PEOPLES', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_labour', title: 'Secretary of Labour', category: 'Cabinet', house: 'PEOPLES', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_hhs', title: 'Secretary of Health and Human Services', category: 'Cabinet', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_edu', title: 'Secretary of Education', category: 'Cabinet', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false },
  { id: 'sec_energy', title: 'Secretary of Energy', category: 'Cabinet', house: 'PRIME', occupant: 'AI Bot', isHuman: false }
];

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [activeTab, setActiveTab] = useState('lobby');

  const [bills, setBills] = useState([
    {
      id: 'BILL-2026-01',
      title: 'Imperial Energy Defense & Microgrid Fortification',
      originHouse: 'PRIME',
      description: 'Establishes militarized solar and nuclear relays across northern states.',
      sponsor: 'Governor of Western Australia',
      status: 'FLOOR DEBATE',
      speeches: ['Governor of WA: This microgrid secures energy autonomy for the northern frontier.'],
      amendments: [],
      votes: { for: 0, against: 0, abstain: 0 }
    }
  ]);

  const [newBillTitle, setNewBillTitle] = useState('');
  const [newBillHouse, setNewBillHouse] = useState('PEOPLES');
  const [newBillDesc, setNewBillDesc] = useState('');
  const [speechInputs, setSpeechInputs] = useState({});
  const [amendmentInputs, setAmendmentInputs] = useState({});

  const [addresses, setAddresses] = useState([]);
  const [addressSpeaker, setAddressSpeaker] = useState('The Premier');
  const [addressType, setAddressType] = useState('State of the Union Address');
  const [addressText, setAddressText] = useState('');

  const [budgets, setBudgets] = useState([]);
  const [budgetDept, setBudgetDept] = useState('Secretary of Treasury (Imperial Budget)');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetNotes, setBudgetNotes] = useState('');

  // Election Night Ranked-Choice & Electoral College Suspense State
  const [electionStage, setElectionStage] = useState(0); // 0 = Not started, 1 = 30% Reporting, 2 = 75% Reporting, 3 = Final Ranked Count
  const [electionResults, setElectionResults] = useState(null);

  const [logs, setLogs] = useState(["Simulation initialized for January 1, 2026. Real-time 24-hour calendar active."]);

  const addLog = (text) => {
    setLogs(prev => ["[" + currentDate.toDateString() + "] " + text, ...prev.slice(0, 99)]);
  };

  const advanceOneDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(nextDate);
    addLog("Calendar advanced to " + nextDate.toDateString() + ".");
  };

  const toggleRoleClaim = (roleId) => {
    setRoles(prev => prev.map(r => {
      if (r.id !== roleId) return r;
      const nextHuman = !r.isHuman;
      const nextOccupant = nextHuman ? "Player 1 (Human)" : "AI Bot";
      addLog(r.title + " is now occupied by " + nextOccupant + ".");
      return { ...r, isHuman: nextHuman, occupant: nextOccupant };
    }));
  };

  const handleIntroduceBill = (e) => {
    e.preventDefault();
    if (!newBillTitle.trim()) return;
    const id = "BILL-2026-0" + (bills.length + 1);
    const created = {
      id: id,
      title: newBillTitle,
      originHouse: newBillHouse,
      description: newBillDesc || "Standard legislative bill.",
      sponsor: "Human Delegate",
      status: "FLOOR DEBATE",
      speeches: [],
      amendments: [],
      votes: { for: 0, against: 0, abstain: 0 }
    };
    setBills([created, ...bills]);
    addLog("Introduced " + id + ": " + newBillTitle + " in " + newBillHouse + ".");
    setNewBillTitle('');
    setNewBillDesc('');
  };

  const submitSpeech = (billId) => {
    const text = speechInputs[billId];
    if (!text || !text.trim()) return;
    setBills(prev => prev.map(b => b.id === billId ? { ...b, speeches: [...b.speeches, text] } : b));
    addLog("Floor debate speech delivered on " + billId + ".");
    setSpeechInputs({ ...speechInputs, [billId]: '' });
  };

  const submitAmendment = (billId) => {
    const text = amendmentInputs[billId];
    if (!text || !text.trim()) return;
    setBills(prev => prev.map(b => b.id === billId ? { ...b, amendments: [...b.amendments, text] } : b));
    addLog("Amendment proposed on " + billId + ": " + text);
    setAmendmentInputs({ ...amendmentInputs, [billId]: '' });
  };

  const castVote = (billId, type) => {
    setBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      return { ...b, votes: { ...b.votes, [type]: b.votes[type] + 1 } };
    }));
    addLog("Recorded " + type.toUpperCase() + " vote on " + billId + ".");
  };

  const deliverAddress = (e) => {
    e.preventDefault();
    if (!addressText.trim()) return;
    const entry = {
      date: currentDate.toDateString(),
      speaker: addressSpeaker,
      type: addressType,
      text: addressText
    };
    setAddresses([entry, ...addresses]);
    addLog(addressSpeaker + " delivered " + addressType + ".");
    setAddressText('');
  };

  const submitBudget = (e) => {
    e.preventDefault();
    if (!budgetAmount.trim()) return;
    const entry = {
      date: currentDate.toDateString(),
      department: budgetDept,
      amount: budgetAmount,
      notes: budgetNotes || "Submitted to People's House for review."
    };
    setBudgets([entry, ...budgets]);
    addLog(budgetDept + " laid down budget (" + budgetAmount + ") before the People's House.");
    setBudgetAmount('');
    setBudgetNotes('');
  };

  // --- SUSPENSEFUL RANKED-CHOICE & ELECTORAL COLLEGE ENGINE ---
  const runElectionWave = () => {
    if (electionStage === 0 || electionStage === 3) {
      // Generate fresh randomized suspenseful election data
      const stateBreakdown = {};
      let firstPrefTotals = { royal_chambers: 0, orange_party: 0, ndp_australia: 0, cebone: 0, severity_group: 0 };

      Object.entries(JURISDICTIONS).forEach(([code, info]) => {
        const swing = () => 0.82 + Math.random() * 0.36;
        let rc = Math.round(info.baseVote * 0.32 * swing());
        let op = Math.round(info.baseVote * 0.31 * swing());
        let ndp = Math.round(info.baseVote * 0.21 * swing());
        let ceb = code === 'NSW' ? Math.round(info.baseVote * 0.26 * swing()) : Math.round(info.baseVote * 0.03 * swing());
        let sev = code === 'VIC' ? Math.round(info.baseVote * 0.25 * swing()) : Math.round(info.baseVote * 0.02 * swing());

        firstPrefTotals.royal_chambers += rc;
        firstPrefTotals.orange_party += op;
        firstPrefTotals.ndp_australia += ndp;
        firstPrefTotals.cebone += ceb;
        firstPrefTotals.severity_group += sev;

        // Ranked Choice Runoff inside each jurisdiction (Top 2 finalists after Cebone/Severity & NDP preferences)
        const cebSevPool = ceb + sev;
        const rcFinal = rc + Math.round(cebSevPool * 0.54) + Math.round(ndp * (0.45 + Math.random() * 0.12));
        const opFinal = op + Math.round(cebSevPool * 0.46) + Math.round(ndp * (0.43 + Math.random() * 0.12));

        const winner = rcFinal >= opFinal ? 'Royal Chambers' : 'Orange Party';
        stateBreakdown[code] = {
          name: info.name,
          electoral: info.electoral,
          rcFirst: rc,
          opFirst: op,
          ndpFirst: ndp,
          cebSevFirst: cebSevPool,
          rcFinal: rcFinal,
          opFinal: opFinal,
          winner: winner,
          margin: Math.abs(rcFinal - opFinal)
        };
      });

      // Compute Electoral College & National Ranked Popular Vote
      let rcElectoral = 0;
      let opElectoral = 0;
      let rcPopFinal = 0;
      let opPopFinal = 0;

      Object.values(stateBreakdown).forEach(st => {
        if (st.winner === 'Royal Chambers') rcElectoral += st.electoral;
        else opElectoral += st.electoral;
        rcPopFinal += st.rcFinal;
        opPopFinal += st.opFinal;
      });

      const popWinner = rcPopFinal >= opPopFinal ? 'Royal Chambers' : 'Orange Party';
      const ecWinner = rcElectoral >= 31 ? 'Royal Chambers' : (opElectoral >= 31 ? 'Orange Party' : 'Deadlock');
      const doubleMandateMet = popWinner === ecWinner && ecWinner !== 'Deadlock';

      setElectionResults({
        firstPrefTotals,
        stateBreakdown,
        rcElectoral,
        opElectoral,
        rcPopFinal,
        opPopFinal,
        popWinner,
        ecWinner,
        doubleMandateMet
      });
      setElectionStage(1);
      addLog("ELECTION NIGHT WAVE 1 (30% Reporting): Early first-preference ballots coming in...");
    } else if (electionStage === 1) {
      setElectionStage(2);
      addLog("ELECTION NIGHT WAVE 2 (75% Reporting): Cebone & Severity Group preferences triggering razor-thin swings in NSW & VIC!");
    } else if (electionStage === 2) {
      setElectionStage(3);
      if (electionResults.doubleMandateMet) {
        addLog("FINAL CERTIFIED RESULT: " + electionResults.ecWinner + " wins BOTH the Ranked Popular Vote and Electoral College (" + Math.max(electionResults.rcElectoral, electionResults.opElectoral) + "/61)!");
      } else {
        addLog("CONSTITUTIONAL CRISIS: Split verdict! Popular Vote won by " + electionResults.popWinner + " vs Electoral College won by " + electionResults.ecWinner + "!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
            👑
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              AUSTRALIAN EMPIRE
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-wider">TETRACAMERAL REAL-TIME PARLIAMENT</p>
          </div>
        </div>

        {/* REAL-TIME 24-HOUR CALENDAR CONTROLS */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <strong className="text-amber-400">{currentDate.toDateString()}</strong>
          </div>

          <button
            onClick={advanceOneDay}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Play className="w-4 h-4 fill-slate-950" /> Advance 1 Day
          </button>
        </div>
      </header>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 flex gap-2 overflow-x-auto">
        {[
          { id: 'lobby', label: 'Roles & Cabinet', icon: Users },
          { id: 'composition', label: 'Apportionment & EC', icon: Layers },
          { id: 'parties', label: 'Political Parties', icon: Landmark },
          { id: 'elections', label: 'Ranked Elections', icon: Vote },
          { id: 'deliberation', label: 'Floor Debate & Bills', icon: Scroll },
          { id: 'addresses', label: 'Addresses & Budgets', icon: FileText },
          { id: 'logs', label: 'Audit Log', icon: Shield }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={"flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap " + (isActive ? 'border-amber-400 text-amber-400 bg-slate-800/30' : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700')}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* BODY CONTENT */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* LOBBY TAB */}
        {activeTab === 'lobby' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" /> Executive, Presiding Officers & 11 Cabinet Departments
              </h2>
              <p className="text-xs text-slate-400 mt-1">Claim any office to play manually; unclaimed offices remain operated by AI.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <div key={role.id} className={"bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg transition " + (role.isHuman ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800')}>
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">{role.category}</span>
                    <h3 className="font-bold text-slate-100 text-sm mt-1">{role.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">Occupant: <strong className="text-slate-200">{role.occupant}</strong></p>
                  </div>
                  <button
                    onClick={() => toggleRoleClaim(role.id)}
                    className={"w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 " + (role.isHuman ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-amber-500 hover:bg-amber-400 text-slate-950')}
                  >
                    {role.isHuman ? <UserCheck className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    {role.isHuman ? 'Release Seat' : 'Claim Office'}
                  </button>
                </div>
              ))}
            </div>
    
