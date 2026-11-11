```react
import React, { useState, useEffect } from 'react';
import { 
  Shield, Landmark, Users, Scroll, Crown, AlertTriangle, Play, 
  Plus, CheckCircle, XCircle, Clock, ChevronRight, Vote, RefreshCw, Sparkles,
  BookOpen, Layers, Award, FileText, Bot, UserCheck, User, Zap, Lock, Unlock, Cpu
} from 'lucide-react';

// --- CONSTITUTIONAL DEFINITIONS ---
const HOUSES = {
  PEOPLES: { 
    id: 'PEOPLES', 
    name: "People's House", 
    domain: "Budgets & National Operations", 
    term: "6-Month Terms (2 per Turn)", 
    chair: "Speaker of the House", 
    color: "border-sky-500/40 bg-sky-950/30 text-sky-400",
    seats: 150
  },
  CUSTODY: { 
    id: 'CUSTODY', 
    name: "States Custody", 
    domain: "Health, Education & Domestic Affairs", 
    term: "1 Year (1/3 Staggered)", 
    chair: "The Chancellor", 
    color: "border-emerald-500/40 bg-emerald-950/30 text-emerald-400",
    seats: 12
  },
  PRIME: { 
    id: 'PRIME', 
    name: "Prime Council", 
    domain: "Defense, Energy & Strategic Assets", 
    term: "State Governors (Ex-Officio)", 
    chair: "The Premier", 
    color: "border-amber-500/40 bg-amber-950/30 text-amber-400",
    seats: 6
  },
  SENATE: { 
    id: 'SENATE', 
    name: "Imperial Senate", 
    domain: "Foreign Affairs & Grand Veto", 
    term: "State Appointed / Direct", 
    chair: "Ex-Premier (Presiding Officer)", 
    color: "border-purple-500/40 bg-purple-950/30 text-purple-400",
    seats: 24
  }
};

const INITIAL_ROLES = [
  { id: 'premier', title: 'The Premier', category: 'Executive', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Imperial Loyalist', description: 'Head of Government & President of the Prime Council' },
  { id: 'chancellor', title: 'The Chancellor', category: 'Executive', house: 'CUSTODY', occupant: 'AI Bot', isHuman: false, personality: 'Welfare Reformer', description: 'Second-in-command & Chairperson of States Custody' },
  { id: 'expremier', title: 'Senate Presiding Officer', category: 'Legislative', house: 'SENATE', occupant: 'Ex-Premier Harrison', isHuman: false, personality: 'Constitutional Strict Constructionist', description: 'Immediate Ex-Premier leading the Senate' },
  { id: 'speaker', title: "Speaker of People's House", category: 'Legislative', house: 'PEOPLES', occupant: 'AI Bot', isHuman: false, personality: 'Moderate Populist', description: 'Leads parliamentary procedure for budget votes' },
  { id: 'gov_nsw', title: 'Governor of New South Wales', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Fiscal Conservative', state: 'NSW' },
  { id: 'gov_vic', title: 'Governor of Victoria', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Social Progressive', state: 'VIC' },
  { id: 'gov_qld', title: 'Governor of Queensland', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'State Autonomist', state: 'QLD' },
  { id: 'gov_wa', title: 'Governor of Western Australia', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Resource Hawk', state: 'WA' },
  { id: 'gov_sa', title: 'Governor of South Australia', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Diplomatic Centrist', state: 'SA' },
  { id: 'gov_tas', title: 'Governor of Tasmania', category: 'Governor', house: 'PRIME', occupant: 'AI Bot', isHuman: false, personality: 'Environmental Defense Specialist', state: 'TAS' },
  { id: 'sec_defense', title: 'Secretary of Defense', category: 'Cabinet', house: 'SENATE', occupant: 'AI Bot', isHuman: false, personality: 'Defense Hawk', description: 'Non-voting advisory seat in Senate' },
  { id: 'sec_treasury', title: 'Secretary of Treasury', category: 'Cabinet', house: 'SENATE', occupant: 'AI Bot', isHuman: false, personality: 'Balanced Budget Pragmatist', description: 'Non-voting advisory seat in Senate' }
];

const INITIAL_BILLS = [
  {
    id: 'BILL-2026-01',
    title: 'Imperial Energy Defense & Microgrid Grid Fortification',
    originHouse: 'PRIME',
    domain: 'Defense, Energy & Strategic Assets',
    description: 'Establishes militarized solar and nuclear relays across northern states with direct funding allocated under Prime Council command.',
    sponsor: 'Governor of Western Australia',
    weeksInSenate: 1,
    status: 'SENATE_REVIEW', // SENATE_REVIEW, PASSED, RETURNED_REVISION, DEADLOCK_JOINT_SITTING, FAILED
    originVotes: { for: 5, against: 1 },
    senateVotes: null,
    jointSittingVotes: null,
    history: ['Introduced in Prime Council', 'Passed Prime Council (5-1)', 'Submitted to Imperial Senate for Ratification']
  },
  {
    id: 'BILL-2026-02',
    title: 'Universal Medical & Education Standardization Act',
    originHouse: 'CUSTODY',
    domain: 'Health, Education & Domestic Affairs',
    description: 'Sets federal standards for healthcare worker pay and guarantees federal education subsidies across all 6 imperial states.',
    sponsor: 'The Chancellor',
    weeksInSenate: 3, // Exceeds 2-week timer
    status: 'DEADLOCK_JOINT_SITTING',
    originVotes: { for: 10, against: 2 },
    senateVotes: { for: 10, against: 14 },
    jointSittingVotes: null,
    history: [
      'Passed States Custody (10-2)',
      'Senate delayed action > 2 weeks (Mandatory Constitutional Timer Expired)',
      'Automatically escalated to Joint Sitting of Union Legislature'
    ]
  }
];

export default function App() {
  // --- STATE ---
  const [year, setYear] = useState(2026);
  const [premierTerm, setPremierTerm] = useState(1);
  const [roles, setRoles] = useState(INITIAL_ROLES);
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [activeTab, setActiveTab] = useState('lobby');
  const [apiKey, setApiKey] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [logs, setLogs] = useState([
    "Empire Political Simulation Engine Initialized.",
    "System set to 1-Year Annual Cycles with automated AI fallback for vacant roles."
  ]);

  // Form State
  const [newBill, setNewBill] = useState({
    title: '',
    originHouse: 'PEOPLES',
    description: '',
    sponsor: ''
  });

  const addLog = (text) => {
    setLogs(prev => [`[YEAR ${year}] ${text}`, ...prev.slice(0, 99)]);
  };

  // --- ROLE CLAIMING HANDLERS ---
  const toggleRoleClaim = (roleId, humanName = "Player 1") => {
    setRoles(prevRoles => prevRoles.map(r => {
      if (r.id === roleId) {
        const newlyHuman = !r.isHuman;
        const newOccupant = newlyHuman ? `${humanName} (Human)` : 'AI Bot';
        addLog(`Role Update: ${r.title} is now controlled by ${newOccupant}.`);
        return { ...r, isHuman: newlyHuman, occupant: newOccupant };
      }
      return r;
    }));
  };

  // --- GEMINI / AI SIMULATION INTEGRATION ---
  const generateAIVotesForTurn = async (activeBills) => {
    setIsAiProcessing(true);
    addLog(`🧠 AI ENGINE: Evaluating legislative agenda for vacant AI seats...`);

    // We process each bill in SENATE_REVIEW
    let updatedBills = [...activeBills];

    for (let i = 0; i < updatedBills.length; i++) {
      let b = updatedBills[i];
      if (b.status === 'SENATE_REVIEW') {
        let aiResult = null;

        // Attempt Gemini API call if key is provided
        if (apiKey) {
          try {
            const prompt = `You are acting as the AI Senate of the Australian Empire under a tetracameral constitution. 
              Evaluate this bill: "${b.title} - ${b.description}".
              Respond in JSON format with properties "decision" (either "RATIFY" or "REJECT") and "reason" (short sentence).`;

            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
              })
            });
            const data = await res.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              aiResult = JSON.parse(text);
            }
          } catch (e) {
            console.warn("API call failed, falling back to personality algorithm:", e);
          }
        }

        // Fallback or standard algorithmic AI vote
        if (!aiResult) {
          const aiGovernors = roles.filter(r => !r.isHuman && r.category === 'Governor');
          const yesWeight = aiGovernors.reduce((acc, r) => {
            if (r.personality.includes('Conservative') && b.originHouse === 'PRIME') return acc + 2;
            if (r.personality.includes('Progressive') && b.originHouse === 'CUSTODY') return acc + 2;
            return acc + 1;
          }, 0);

          const decision = yesWeight >= 5 ? 'RATIFY' : 'REJECT';
          aiResult = {
            decision,
            reason: decision === 'RATIFY' ? 'Passed with AI faction consensus.' : 'Rejected by Senate AI coalition.'
          };
        }

        if (aiResult.decision === 'RATIFY') {
          b = {
            ...b,
            status: 'PASSED',
            senateVotes: { for: 17, against: 7 },
            history: [...b.history, `Senate AI Vote: RATIFIED (${aiResult.reason})`]
          };
          addLog(`✅ SENATE AI RATIFIED [${b.id}] "${b.title}" (${aiResult.reason})`);
        } else {
          b = {
            ...b,
            status: 'RETURNED_REVISION',
            senateVotes: { for: 8, against: 16 },
            history: [...b.history, `Senate AI Vote: REJECTED & RETURNED (${aiResult.reason})`]
          };
          addLog(`🛑 SENATE AI RETURNED [${b.id}] for revision (${aiResult.reason})`);
        }
        updatedBills[i] = b;
      }
    }

    setIsAiProcessing(false);
    return updatedBills;
  };

  // --- 1-YEAR TURN EXECUTION ENGINE ---
  const executeAnnualTurn = async () => {
    const nextYear = year + 1;
    addLog(`⏳ ADVANCING SIMULATION: Executing Year ${year} -> Year ${nextYear}...`);
    addLog(`🗳️ ELECTIONS: 2 Mid-Year & End-Year cycles executed for People's House (6-month terms).`);
    addLog(`🗳️ ELECTIONS: Annual election completed for 1/3 States Custody and State Governors.`);

    // 1. Process AI Voting on Pending Bills
    let processedBills = await generateAIVotesForTurn(bills);

    // 2. Check 2-Week Senate Review Timers & Trigger Joint Sittings
    processedBills = processedBills.map(bill => {
      if (bill.status === 'SENATE_REVIEW') {
        const weeks = bill.weeksInSenate + 1;
        if (weeks >= 2) {
          addLog(`⚠️ DEADLOCK DETECTED: [${bill.id}] exceeded 2-week Senate window. Referred to Joint Sitting!`);
          return {
            ...bill,
            weeksInSenate: weeks,
            status: 'DEADLOCK_JOINT_SITTING',
            history: [...bill.history, 'Senate 2-week review window expired. Referred to Joint Sitting.']
          };
        }
        return { ...bill, weeksInSenate: weeks };
      }
      return bill;
    });

    // 3. Handle Executive Term Limits
    let newTerm = premierTerm + 1;
    if (newTerm > 2) {
      addLog(`👑 CONSTITUTIONAL LIMIT: Premier completed 2 consecutive 1-year terms. Stepping down to Senate Presiding Officer.`);
      setPremierTerm(1);
    } else {
      setPremierTerm(newTerm);
      addLog(`👑 EXECUTIVE ELECTION: Premier re-elected for Term ${newTerm}/2.`);
    }

    setBills(processedBills);
    setYear(nextYear);
  };

  // --- JOINT SITTING DEADLOCK RESOLUTION ---
  const runJointSitting = (billId) => {
    // Total seats: Peoples (150) + Custody (12) + Prime (6) + Senate (24) = 192 Seats
    const humanGovernors = roles.filter(r => r.isHuman);
    const humanWeight = humanGovernors.length * 10; 
    
    // Simulating vote tally
    const baseFor = 105 + humanWeight;
    const finalFor = Math.min(192, baseFor);
    const finalAgainst = 192 - finalFor;
    const passed = finalFor > 96;

    setBills(prev => prev.map(b => {
      if (b.id !== billId) return b;
      return {
        ...b,
        status: passed ? 'PASSED' : 'FAILED',
        jointSittingVotes: { for: finalFor, against: finalAgainst },
        history: [...b.history, `Joint Sitting Vote (192 Seats): ${finalFor} FOR / ${finalAgainst} AGAINST. Result: ${passed ? 'PASSED & ENACTED' : 'FAILED'}.`]
      };
    }));

    addLog(`🏛️ JOINT SITTING CONVENED for [${billId}]: ${finalFor} FOR vs ${finalAgainst} AGAINST (${passed ? 'ENACTED INTO LAW' : 'REJECTED'}).`);
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    if (!newBill.title || !newBill.description) return;

    const house = HOUSES[newBill.originHouse];
    const billObj = {
      id: `BILL-${year}-${Math.floor(10 + Math.random() * 90)}`,
      title: newBill.title,
      originHouse: newBill.originHouse,
      domain: house.domain,
      description: newBill.description,
      sponsor: newBill.sponsor || 'Human Delegate',
      weeksInSenate: 0,
      status: 'SENATE_REVIEW',
      originVotes: { for: 8, against: 2 },
      senateVotes: null,
      jointSittingVotes: null,
      history: [`Introduced in ${house.name} during Year ${year}`, `Forwarded to Imperial Senate for Ratification`]
    };

    setBills([billObj, ...bills]);
    addLog(`📜 NEW BILL: [${billObj.id}] introduced in ${house.name} by ${billObj.sponsor}.`);
    setNewBill({ title: '', originHouse: 'PEOPLES', description: '', sponsor: '' });
    setActiveTab('pipeline');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* IMPERIAL HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black text-xl">
            👑
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              AUSTRALIAN EMPIRE
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 font-mono tracking-wider">CONSTITUTIONAL SIMULATION & AI ENGINE</p>
          </div>
        </div>

        {/* 1-YEAR TURN ENGINE CONTROLS */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-mono flex items-center gap-3">
            <div><span className="text-slate-500">CYCLE:</span> <strong className="text-amber-400 text-sm">{year}</strong></div>
            <div className="border-l border-slate-800 pl-3">
              <span className="text-slate-500">PREMIER TERM:</span> <strong className="text-slate-200">{premierTerm}/2 Yrs</strong>
            </div>
          </div>

          <button
            onClick={executeAnnualTurn}
            disabled={isAiProcessing}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {isAiProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-slate-950" />}
            Execute 1-Year Turn
          </button>
        </div>
      </header>

      {/* API KEY & ENGINE STATUS STRIP */}
      <section className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Engine Status: <strong className="text-emerald-400">Hybrid AI / Human Active</strong></span>
          <span className="text-slate-600">|</span>
          <span>Human Seats Claimed: <strong className="text-amber-400">{roles.filter(r => r.isHuman).length} / {roles.length}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <input
            type="password"
            placeholder="Optional Gemini API Key (for live LLM votes)..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 w-64 focus:outline-none focus:border-purple-500"
          />
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <div className="border-b border-slate-800 bg-slate-900/40 px-4 flex gap-2 overflow-x-auto">
        {[
          { id: 'lobby', label: 'Seat Claiming Lobby', icon: Users },
          { id: 'pipeline', label: 'Legislative Pipeline', icon: Scroll },
          { id: 'create', label: 'Draft New Bill', icon: Plus },
          { id: 'constitution', label: 'Constitutional Charter', icon: BookOpen },
          { id: 'logs', label: 'Simulation Logs', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-medium border-b-2 transition whitespace-nowrap ${
                isActive 
                  ? 'border-amber-400 text-amber-400 bg-slate-800/30' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">

        {/* TAB 1: SEAT CLAIMING LOBBY */}
        {activeTab === 'lobby' && (
          <div className="space-y-6">
            <div className="flex justify-between items-start flex-wrap gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" /> Constitutional Role & Seat Lobby
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                  Claim any executive or legislative office to control it manually during the 1-year turn cycle. 
                  All unassigned seats are dynamically driven by AI bots programmed with distinct political personalities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map(role => (
                <div 
                  key={role.id} 
                  className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-lg transition ${
                    role.isHuman ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
                        {role.category}
                      </span>
                      <h3 className="font-bold text-slate-100 text-sm mt-1">{role.title}</h3>
                    </div>
                    {role.isHuman ? (
         
