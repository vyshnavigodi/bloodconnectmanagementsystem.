import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  Heart,
  Activity,
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  Clock,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  MapPin,
  Calendar,
  ChevronRight,
  Languages,
  AlertCircle,
  X
} from 'lucide-react';
import api from '../services/api';

// Three.js and Fiber lazy or defensive import
function ThreeScene() {
  const [Component, setComponent] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    let isMounted = true;
    import('@react-three/fiber').then((fiber) => {
      import('@react-three/drei').then((drei) => {
        if (!isMounted) return;

        const { Canvas } = fiber;
        const { Sphere, MeshDistortMaterial, Float, Stars } = drei;

        function BloodDrop() {
          return (
            <Float speed={2.5} rotationIntensity={1.2} floatIntensity={2}>
              <Sphere args={[1.3, 64, 64]}>
                <MeshDistortMaterial
                  color="#dc2626"
                  emissive="#7f1d1d"
                  roughness={0.15}
                  metalness={0.85}
                  distort={0.35}
                  speed={2}
                />
              </Sphere>
            </Float>
          );
        }

        setComponent(
          <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
              <pointLight position={[-10, -10, -5]} intensity={1.5} color="#ef4444" />
              <Stars radius={50} depth={50} count={1200} factor={4} saturation={0.5} fade speed={1.5} />
              <BloodDrop />
            </Canvas>
          </div>
        );
      }).catch(() => {
        if (isMounted) setComponent(<CSSFallbackBloodDrop />);
      });
    }).catch(() => {
      if (isMounted) setComponent(<CSSFallbackBloodDrop />);
    });

    return () => { isMounted = false; };
  }, []);

  if (!Component) {
    return <CSSFallbackBloodDrop />;
  }

  return <>{Component}</>;
}

function CSSFallbackBloodDrop() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="relative animate-float">
        <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-red-600 via-red-500 to-rose-400 blur-sm opacity-80 animate-pulse-glow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplet className="w-28 h-28 text-white fill-white drop-shadow-2xl" />
        </div>
      </div>
    </div>
  );
}

// Translations
const translations = {
  en: {
    heroTitle: "Every Drop Counts. Every Life Matters.",
    heroSub: "Experience the future of blood donation and rapid hospital emergency matching. Seamlessly connect certified donors with verified patients in under 90 seconds.",
    findBlood: "Find Blood",
    becomeDonor: "Become a Donor",
    availabilityTitle: "Live Blood Group Availability",
    availabilitySub: "Real-time stock across regional blood banks and hospital reserves.",
    nearbyTitle: "Nearby Verified Facilities",
    nearbySub: "Licensed blood banks and verified medical trauma centers in our network.",
    campsTitle: "Upcoming Donation Drives & Camps",
    campsSub: "Join local community drives to save lives in your neighborhood.",
    emergencyBanner: "Need Blood Urgently?",
    emergencySub: "Our automated dispatch notifies verified compatible donors and on-call trauma teams in your perimeter.",
    raiseSOS: "Raise Instant SOS Request",
    howItWorks: "How BloodConnect Works",
    liveImpact: "Live Impact",
    registerTitle: "01 Register & Verify",
    registerDesc: "Join as a donor or healthcare facility with basic credentials and blood typing details.",
    matchTitle: "02 Smart Match Algorithm",
    matchDesc: "When a request is submitted, preliminary matching instantly discovers compatible inventory.",
    certTitle: "03 Save Lives & Certify",
    certDesc: "Complete verified transfusions and receive cryptographic QR-linked certificates.",
  },
  te: {
    heroTitle: "ప్రతి రక్తపు బొట్టు విలువైనది. ప్రతి ప్రాణం ముఖ్యం.",
    heroSub: "ఆధునిక బ్లడ్ బ్యాంక్ నెట్‌వర్క్ ద్వారా 90 సెకన్లలో రక్తదాతలను అవసరమైన రోగులతో మరియు అత్యవసర ఆసుపత్రులతో అనుసంధానించండి.",
    findBlood: "రక్తాన్ని శోధించండి",
    becomeDonor: "రక్తదాతగా చేరండి",
    availabilityTitle: "లైవ్ బ్లడ్ గ్రూప్ లభ్యత",
    availabilitySub: "ప్రాంతీయ బ్లడ్ బ్యాంకుల నుండి రియల్ టైమ్ డేటా.",
    nearbyTitle: "సమీపంలోని ధృవీకరించబడిన కేంద్రాలు",
    nearbySub: "మా నెట్‌వర్క్‌లోని గుర్తింపు పొందిన బ్లడ్ బ్యాంకులు మరియు ఆసుపత్రులు.",
    campsTitle: "రాబోయే రక్తదాన శిబిరాలు",
    campsSub: "మీ ప్రాంతంలో జరిగే రక్తదాన శిబిరాలలో పాల్గొని ప్రాణాలను కాపాడండి.",
    emergencyBanner: "అత్యవసరంగా రక్తం అవసరమా?",
    emergencySub: "మా ఆటోమేటెడ్ సిస్టమ్ సమీపంలోని అనుకూల దాతలను తక్షణమే అప్రమత్తం చేస్తుంది.",
    raiseSOS: "తక్షణ SOS అభ్యర్థన పంపండి",
    howItWorks: "బ్లడ్‌కనెక్ట్ ఎలా పనిచేస్తుంది",
    liveImpact: "లైవ్ ఇంపాక్ట్",
    registerTitle: "01 నమోదు మరియు ధృవీకరణ",
    registerDesc: "రక్తదాతగా లేదా ఆరోగ్య సంస్థగా సులభంగా నమోదు చేసుకోండి.",
    matchTitle: "02 స్మార్ట్ మ్యాచింగ్ అల్గోరిథం",
    matchDesc: "అభ్యర్థన వచ్చిన వెంటనే అనుకూలమైన రక్త సమూహాలను గుర్తిస్తుంది.",
    certTitle: "03 ప్రాణాలను రక్షించండి మరియు సర్టిఫికేట్ పొందండి",
    certDesc: "రక్తదానం పూర్తయిన తర్వాత QR-కోడ్ ఆధారిత అధికారిక సర్టిఫికేట్ పొందండి.",
  },
  hi: {
    heroTitle: "हर एक बूँद कीमती है। हर एक जान अनमोल है।",
    heroSub: "रक्तदाताओं और अस्पतालों को 90 सेकंड में जोड़ने वाला भारत का सबसे भरोसेमंद 3D डिजिटल ब्लड बैंक प्लेटफॉर्म।",
    findBlood: "रक्त खोजें",
    becomeDonor: "रक्तदाता बनें",
    availabilityTitle: "लाइव ब्लड ग्रुप उपलब्धता",
    availabilitySub: "क्षेत्रीय ब्लड बैंकों और अस्पतालों से सीधा रियल-टाइम स्टॉक।",
    nearbyTitle: "निकटवर्ती सत्यापित केंद्र",
    nearbySub: "हमारे नेटवर्क के प्रमाणित ब्लड बैंक और आपातकालीन ट्रॉमा केंद्र।",
    campsTitle: "आगामी रक्तदान शिविर",
    campsSub: "अपने नजदीकी शिविर में रक्तदान कर किसी का जीवन बचाएं।",
    emergencyBanner: "क्या आपको तुरंत रक्त चाहिए?",
    emergencySub: "हमारा स्वचालित सिस्टम निकटवर्ती संगत दाताओं को तुरंत सूचित करता है।",
    raiseSOS: "तत्काल SOS अनुरोध भेजें",
    howItWorks: "ब्लडकनेक्ट कैसे काम करता है",
    liveImpact: "लाइव प्रभाव",
    registerTitle: "01 पंजीकरण और सत्यापन",
    registerDesc: "रक्तदाता या अस्पताल के रूप में आसान और सुरक्षित पंजीकरण।",
    matchTitle: "02 स्मार्ट मैचिंग एल्गोरिदम",
    matchDesc: "अनुरोध प्राप्त होते ही तुरंत संगत ब्लड यूनिट्स का पता लगाता है।",
    certTitle: "03 जीवन बचाएं और प्रमाण पत्र पाएं",
    certDesc: "सत्यापित रक्तदान के बाद क्यूआर-लिंक्ड डिजिटल प्रमाण पत्र प्राप्त करें।",
  }
};

export const LandingPage: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'te' | 'hi'>('en');
  const t = translations[lang];

  const [stats, setStats] = useState({
    totalDonors: '12,480+',
    unitsAvailable: '3,850',
    partnerHospitals: '140+',
    requestsFulfilled: '99.4%',
  });

  const [stockCounts, setStockCounts] = useState<Record<string, number>>({
    'A+': 42, 'A-': 18, 'B+': 56, 'B-': 12, 'AB+': 24, 'AB-': 8, 'O+': 78, 'O-': 22
  });

  const [bloodBanks, setBloodBanks] = useState<any[]>([]);
  const [camps, setCamps] = useState<any[]>([]);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Emergency Form State
  const [emergencyForm, setEmergencyForm] = useState({
    patientName: '',
    bloodGroup: 'O+',
    unitsRequired: 1,
    hospitalName: '',
    contactPhone: '',
    clinicalReason: '',
  });
  const [sosSubmitting, setSosSubmitting] = useState(false);
  const [sosSuccess, setSosSuccess] = useState<string | null>(null);
  const [sosError, setSosError] = useState<string | null>(null);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    // 1. Fetch live KPIs
    api.get('/analytics/kpis')
      .then((res) => {
        const d = res.data?.data || res.data;
        if (d) {
          setStats({
            totalDonors: d.totalDonors ? `${d.totalDonors.toLocaleString()}+` : '12,480+',
            unitsAvailable: d.availableUnits ? `${d.availableUnits.toLocaleString()}` : '3,850',
            partnerHospitals: d.totalHospitals ? `${d.totalHospitals}+` : '140+',
            requestsFulfilled: '99.4%',
          });
        }
      })
      .catch(() => {});

    // 2. Fetch inventory summary for live group counts
    api.get('/inventory/summary')
      .then((res) => {
        const groups = res.data?.data?.byBloodGroup;
        if (Array.isArray(groups)) {
          const map: Record<string, number> = {};
          groups.forEach((g: any) => {
            const avail = g.statuses?.find((s: any) => s.status === 'AVAILABLE')?.count || g.totalUnits || 0;
            map[g._id] = avail;
          });
          setStockCounts((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});

    // 3. Fetch nearby blood banks
    api.get('/blood-banks?limit=4')
      .then((res) => {
        setBloodBanks(res.data?.data || []);
      })
      .catch(() => {});

    // 4. Fetch upcoming camps
    api.get('/camps?limit=3')
      .then((res) => {
        setCamps(res.data?.data || []);
      })
      .catch(() => {});
  }, []);

  const handleSosSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSosSubmitting(true);
    setSosError(null);
    setSosSuccess(null);

    try {
      const res = await api.post('/blood-requests/emergency', {
        patientName: emergencyForm.patientName,
        bloodGroup: emergencyForm.bloodGroup,
        unitsRequired: Number(emergencyForm.unitsRequired),
        requiredDate: new Date(),
        urgency: 'EMERGENCY',
        contactPhone: emergencyForm.contactPhone,
        clinicalReason: `${emergencyForm.hospitalName ? `Hospital: ${emergencyForm.hospitalName}. ` : ''}${emergencyForm.clinicalReason || 'Immediate emergency transfusion request'}`,
      });

      const reqId = res.data?.data?.requestId || 'EMG-BROADCAST';
      setSosSuccess(`SOS Request Logged Successfully! Request ID: ${reqId}. Matched donors and trauma staff have been alerted.`);
      setEmergencyForm({
        patientName: '',
        bloodGroup: 'O+',
        unitsRequired: 1,
        hospitalName: '',
        contactPhone: '',
        clinicalReason: '',
      });
    } catch (err: any) {
      setSosError(err.response?.data?.message || 'Failed to submit emergency request. Please call helpline directly.');
    } finally {
      setSosSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white selection:bg-red-500 selection:text-white overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-navy-900/70 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Droplet className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
              BloodConnect
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
            <a href="#how-it-works" className="hover:text-white transition-colors">{t.howItWorks}</a>
            <a href="#availability" className="hover:text-white transition-colors">{t.availabilityTitle}</a>
            <a href="#facilities" className="hover:text-white transition-colors">{t.nearbyTitle}</a>
            <a href="#camps" className="hover:text-white transition-colors">{t.campsTitle}</a>
            <a href="#stats" className="hover:text-white transition-colors">{t.liveImpact}</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1 text-xs">
              <Languages className="w-3.5 h-3.5 text-white/60 mr-1" />
              <button
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded ${lang === 'en' ? 'bg-red-600 text-white font-bold' : 'text-white/60 hover:text-white'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('te')}
                className={`px-1.5 py-0.5 rounded ${lang === 'te' ? 'bg-red-600 text-white font-bold' : 'text-white/60 hover:text-white'}`}
              >
                తె
              </button>
              <button
                onClick={() => setLang('hi')}
                className={`px-1.5 py-0.5 rounded ${lang === 'hi' ? 'bg-red-600 text-white font-bold' : 'text-white/60 hover:text-white'}`}
              >
                हि
              </button>
            </div>

            <Link
              to="/login"
              className="text-sm font-semibold text-white/80 hover:text-white px-3 py-2 rounded-xl transition-colors"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm flex items-center gap-2 px-4 py-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Smart Blood Dispatch System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              {t.heroTitle.split('.')[0]}. <span className="bg-gradient-to-r from-red-500 via-rose-400 to-red-600 bg-clip-text text-transparent">{t.heroTitle.split('.')[1] || ''}</span>
            </h1>

            <p className="text-lg text-white/70 max-w-2xl leading-relaxed">
              {t.heroSub}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => setShowEmergencyModal(true)}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2.5 px-7 py-3.5 text-base shadow-lg shadow-red-600/30"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{t.findBlood} / SOS</span>
              </button>
              <Link
                to="/register"
                className="w-full sm:w-auto btn-secondary flex items-center justify-center gap-2 px-7 py-3.5 text-base"
              >
                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                <span>{t.becomeDonor}</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">&lt; 90s</p>
                <p className="text-xs text-white/50">Emergency Match</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-white/50">Verified Donors</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24 / 7</p>
                <p className="text-xs text-white/50">Rapid Response</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column 3D Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 h-[420px] sm:h-[480px] w-full relative rounded-3xl glass-card border border-white/10 flex items-center justify-center overflow-hidden glow-red"
          >
            <ThreeScene />
            <div className="absolute bottom-4 left-4 right-4 bg-navy-900/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 text-xs flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-semibold text-white">Interactive 3D Living Cell</span>
              </div>
              <span className="text-white/50">Drag to rotate</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 bg-navy-800/40 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="glass-card p-6 rounded-2xl text-center border-red-500/20">
              <Users className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.totalDonors}</h3>
              <p className="text-sm text-white/60 mt-1">Active Donors</p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center border-red-500/20">
              <Droplet className="w-8 h-8 text-rose-400 mx-auto mb-3 fill-rose-400/20" />
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.unitsAvailable}</h3>
              <p className="text-sm text-white/60 mt-1">Blood Units Ready</p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center border-red-500/20">
              <Building2 className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.partnerHospitals}</h3>
              <p className="text-sm text-white/60 mt-1">Hospitals Connected</p>
            </div>
            <div className="glass-card p-6 rounded-2xl text-center border-red-500/20">
              <Activity className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="text-3xl font-extrabold text-white tracking-tight">{stats.requestsFulfilled}</h3>
              <p className="text-sm text-white/60 mt-1">Fulfillment Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blood Group Availability Grid */}
      <section id="availability" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.availabilityTitle}</h2>
          <p className="text-white/60 text-sm mt-3">
            {t.availabilitySub}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {bloodGroups.map((group) => {
            const count = stockCounts[group] || 0;
            const isLow = count < 10;
            return (
              <div
                key={group}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-white group-hover:text-red-400 transition-colors">
                    {group}
                  </span>
                  <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${isLow ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {isLow ? 'Urgent Need' : 'Available'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-600 to-rose-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, Math.max(15, count * 5))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Verified stock</span>
                    <span className="text-white font-medium">{count} Units</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Nearby Verified Facilities Section */}
      <section id="facilities" className="py-16 bg-navy-800/30 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white">{t.nearbyTitle}</h2>
            <p className="text-white/60 text-sm mt-2">{t.nearbySub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bloodBanks.length > 0 ? (
              bloodBanks.map((b) => (
                <div key={b._id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                        Verified Bank
                      </span>
                      <span className="text-xs text-white/50 font-mono">{b.licenseNumber || 'LIC-VERIFIED'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{b.name}</h3>
                    <p className="text-xs text-white/60 flex items-center gap-1.5 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>{b.address?.city || 'Hyderabad'}, {b.address?.state || 'Telangana'}</span>
                    </p>
                    <p className="text-xs text-white/50">{b.address?.street}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-white/60">Help: {b.contactPhone || '108'}</span>
                    <Link to="/patient/request" className="text-red-400 hover:text-red-300 font-semibold">Request Units &rarr;</Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-white/50 text-sm">
                No nearby blood bank records found.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Donation Camps Section */}
      <section id="camps" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.campsTitle}</h2>
          <p className="text-white/60 text-sm mt-2">{t.campsSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.length > 0 ? (
            camps.map((camp) => (
              <div key={camp._id} className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      {camp.status || 'UPCOMING'}
                    </span>
                    <span className="text-xs text-white/50 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-red-400" />
                      {camp.date ? new Date(camp.date).toLocaleDateString() : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{camp.title}</h3>
                  <p className="text-sm text-white/60 mb-3">{camp.description}</p>
                  <p className="text-xs text-white/70 flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" />
                    <span>{camp.venue}, {camp.city}</span>
                  </p>
                  <p className="text-xs text-white/50 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white/40" />
                    <span>{camp.startTime} - {camp.endTime}</span>
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/50">Target: {camp.targetDonations} Donors</span>
                  <Link
                    to="/register"
                    className="btn-primary text-xs px-4 py-2"
                  >
                    Register as Donor
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-white/50 text-sm">
              Check back soon for upcoming donation camps in your city.
            </div>
          )}
        </div>
      </section>

      {/* Emergency Request Banner */}
      <section id="emergency" className="py-16 max-w-7xl mx-auto px-6">
        <div className="rounded-3xl bg-gradient-to-r from-red-950/60 via-red-900/40 to-navy-900 p-8 sm:p-12 border border-red-500/30 glow-red flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/30 text-red-200 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 animate-spin" />
              Critical Emergency Dispatch
            </div>
            <h3 className="text-3xl font-extrabold text-white">{t.emergencyBanner}</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {t.emergencySub}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={() => setShowEmergencyModal(true)}
              className="btn-primary text-center px-8 py-4 text-base font-bold flex items-center justify-center gap-2 shadow-xl shadow-red-600/40"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.raiseSOS}</span>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white">{t.howItWorks}</h2>
          <p className="text-white/60 text-sm mt-3">
            Streamlined in 3 seamless steps to save maximum lives without friction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xl mb-6">
              01
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.registerTitle}</h4>
            <p className="text-sm text-white/60 leading-relaxed">{t.registerDesc}</p>
          </div>

          <div className="glass-card p-8 rounded-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xl mb-6">
              02
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.matchTitle}</h4>
            <p className="text-sm text-white/60 leading-relaxed">{t.matchDesc}</p>
          </div>

          <div className="glass-card p-8 rounded-2xl relative">
            <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xl mb-6">
              03
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{t.certTitle}</h4>
            <p className="text-sm text-white/60 leading-relaxed">{t.certDesc}</p>
          </div>
        </div>
      </section>

      {/* SOS Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-card p-6 sm:p-8 rounded-3xl border border-red-500/40 glow-red relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/40">
                  <PhoneCall className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Emergency SOS Blood Request</h3>
                  <p className="text-xs text-white/60">Instant dispatch to matched donors & facilities</p>
                </div>
              </div>

              {sosSuccess && (
                <div className="mb-4 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{sosSuccess}</span>
                </div>
              )}

              {sosError && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{sosError}</span>
                </div>
              )}

              <form onSubmit={handleSosSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Patient full name"
                    value={emergencyForm.patientName}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, patientName: e.target.value })}
                    className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Blood Group Required</label>
                    <select
                      value={emergencyForm.bloodGroup}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, bloodGroup: e.target.value })}
                      className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      {bloodGroups.map((g) => (
                        <option key={g} value={g} className="bg-navy-900">{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Units Required</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={emergencyForm.unitsRequired}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, unitsRequired: Number(e.target.value) })}
                      className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Hospital / Clinic</label>
                    <input
                      type="text"
                      placeholder="e.g. Apollo Hospital"
                      value={emergencyForm.hospitalName}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, hospitalName: e.target.value })}
                      className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/70 block mb-1">Emergency Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91-XXXXXXXXXX"
                      value={emergencyForm.contactPhone}
                      onChange={(e) => setEmergencyForm({ ...emergencyForm, contactPhone: e.target.value })}
                      className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1">Clinical Note / Room No.</label>
                  <textarea
                    rows={2}
                    placeholder="Brief details (e.g. Emergency surgery, ICU bed 12)"
                    value={emergencyForm.clinicalReason}
                    onChange={(e) => setEmergencyForm({ ...emergencyForm, clinicalReason: e.target.value })}
                    className="w-full bg-navy-950/70 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <p className="text-[11px] text-white/40 italic">
                  * Note: Medical personnel will verify eligibility and blood compatibility prior to transfusion.
                </p>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={sosSubmitting}
                    className="w-full btn-primary py-3 font-bold text-sm flex items-center justify-center gap-2"
                  >
                    {sosSubmitting ? (
                      <span>Broadcasting SOS to Network...</span>
                    ) : (
                      <>
                        <PhoneCall className="w-4 h-4" />
                        <span>Broadcast Emergency SOS</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-white">BloodConnect</span>
          </div>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} BloodConnect Platform. All rights reserved. Every Drop Counts.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <Link to="/verify/CERT-2026-9901" className="hover:text-white transition-colors">Verify Certificate</Link>
            <Link to="/seed" className="hover:text-white transition-colors">Dev Seed</Link>
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
