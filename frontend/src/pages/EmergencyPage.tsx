import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Droplet,
  PhoneCall,
  ShieldAlert,
  Clock,
  CheckCircle2,
  ArrowRight,
  Hospital,
  User,
  Phone,
  FileText
} from 'lucide-react';
import api from '../services/api';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const COMPONENTS = [
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PACKED_RED_CELLS', label: 'Packed Red Cells (RBC)' },
  { value: 'PLATELETS', label: 'Platelets' },
  { value: 'FRESH_FROZEN_PLASMA', label: 'Fresh Frozen Plasma (FFP)' }
];

export const EmergencyPage: React.FC = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O+',
    component: 'WHOLE_BLOOD',
    unitsRequired: 1,
    hospitalName: '',
    contactPhone: '',
    clinicalReason: ''
  });

  const [loading, setLoading] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/blood-requests/emergency', {
        ...formData,
        urgency: 'EMERGENCY',
        requiredDate: new Date()
      });

      const data = res.data?.data || res.data;
      setSubmittedRequest(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Emergency request submission failed. Please call our 24/7 hotline directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 text-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-red-600 px-4 py-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span>Priority 1 Trauma Dispatch & Emergency Blood Network</span>
      </div>

      <header className="border-b border-white/10 bg-navy-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30">
              <Droplet className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-white">BloodConnect</span>
            <span className="text-xs bg-red-500/20 text-red-400 font-semibold px-2 py-0.5 rounded-full border border-red-500/30">
              SOS Mode
            </span>
          </Link>
          <a
            href="tel:108"
            className="flex items-center gap-2 text-red-400 font-bold text-sm bg-red-600/10 px-3 py-1.5 rounded-xl border border-red-500/20"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Emergency Dial: 108</span>
          </a>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submittedRequest ? (
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Priority SOS Dispatched
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white">
                Emergency Request Active
              </h2>
              <p className="text-sm text-white/70 max-w-md mx-auto">
                Tracking Code: <strong className="font-mono text-red-400 text-base">{submittedRequest.requestId || 'REQ-EMERGENCY'}</strong>
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 max-w-lg mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-white/40">Blood Group:</span>
                <span className="font-bold text-red-400 text-sm">{submittedRequest.bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Units Requested:</span>
                <span className="font-bold text-white">{submittedRequest.unitsRequired} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Patient:</span>
                <span className="font-bold text-white">{submittedRequest.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Contact Hotline:</span>
                <span className="font-bold text-white">{submittedRequest.contactPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/40">Donor Alert Broadcast:</span>
                <span className="font-bold text-emerald-400">
                  {submittedRequest.donorAlertBroadcasted ? 'Broadcasted to Compatible Donors' : 'Queued with Trauma Team'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setSubmittedRequest(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all"
              >
                Submit Another Emergency
              </button>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-all"
              >
                Return to Live Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold uppercase">
                <ShieldAlert className="w-3.5 h-3.5" /> Fast-Track Trauma Admission
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Immediate Emergency Blood Requisition
              </h1>
              <p className="text-xs md:text-sm text-white/60">
                No preliminary registration required. Submissions instantly alert nearby blood banks and compatible voluntary donors in your perimeter.
              </p>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 rounded-3xl border border-red-500/30 space-y-6 bg-red-950/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-red-400" /> Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-400" /> Attending Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-red-400" /> Blood Group *
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 font-bold"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Blood Component
                  </label>
                  <select
                    value={formData.component}
                    onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                    className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                  >
                    {COMPONENTS.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 block mb-1.5">
                    Units Required *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.unitsRequired}
                    onChange={(e) => setFormData({ ...formData, unitsRequired: Number(e.target.value) })}
                    className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-red-400" /> Hospital / Emergency Facility Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apollo Jubilee Hills, Trauma Unit 3"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-white/70 block mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-red-400" /> Clinical Reason / Urgency Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. High-risk postpartum hemorrhage, immediate surgical transfusion requested"
                  value={formData.clinicalReason}
                  onChange={(e) => setFormData({ ...formData, clinicalReason: e.target.value })}
                  className="w-full bg-navy-800 border border-white/20 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all uppercase tracking-wider"
                >
                  {loading ? (
                    <span>Broadcasting SOS Dispatch...</span>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Broadcast Emergency SOS Request Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmergencyPage;
