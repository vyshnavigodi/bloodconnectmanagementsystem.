import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Droplet,
  Phone,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

export const DonorAlerts: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptedIds, setAcceptedIds] = useState<string[]>([]);
  const [declinedIds, setDeclinedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEmergencyAlerts();
  }, []);

  const fetchEmergencyAlerts = async () => {
    try {
      const res = await api.get('/blood-requests?urgency=EMERGENCY');
      const data = res.data?.data || res.data || [];
      setAlerts(data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id: string, action: 'accept' | 'decline') => {
    if (action === 'accept') {
      setAcceptedIds((prev) => [...prev, id]);
      setMessage('Thank you for accepting! The hospital transfusion center has been notified of your availability.');
    } else {
      setDeclinedIds((prev) => [...prev, id]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
          <span>Emergency Blood Alerts & SOS Broadcasts</span>
        </h2>
        <p className="text-sm text-white/50">
          Real-time urgent transfusion requests broadcasted to compatible donors in your perimeter.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
          <ShieldCheck className="w-12 h-12 mx-auto text-emerald-400/40" />
          <p className="text-base font-semibold text-white/70">No critical emergency shortages in your area.</p>
          <p className="text-xs">Your readiness as a registered voluntary donor saves lives when trauma calls arise.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const isAccepted = acceptedIds.includes(alert._id || alert.requestId);
            const isDeclined = declinedIds.includes(alert._id || alert.requestId);

            return (
              <div
                key={alert._id || alert.requestId}
                className={`p-6 rounded-3xl glass-card border transition-all ${
                  isAccepted
                    ? 'border-emerald-500/40 bg-emerald-950/20'
                    : isDeclined
                    ? 'opacity-40 border-white/5'
                    : 'border-red-500/30 bg-red-950/10'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-red-600/20 rounded-xl text-red-400">
                        <AlertTriangle className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {alert.hospitalId?.name || alert.patientName || 'Emergency Trauma Center'}
                          <Badge variant="red" size="sm">{alert.urgency || 'EMERGENCY'}</Badge>
                        </h3>
                        <p className="text-xs text-white/50 flex items-center gap-1.5 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-red-400" />
                          <span>{alert.hospitalId?.address?.city || 'Emergency Trauma Ward'}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-white/80 max-w-2xl">
                      {alert.clinicalReason || 'Immediate transfusion required for critical surgical resuscitation.'}
                    </p>

                    <div className="flex items-center gap-6 text-xs text-white/60 pt-2 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-red-400" />
                        Blood Group: <strong className="text-white font-bold ml-1">{alert.bloodGroup}</strong>
                      </span>
                      <span>
                        Units Needed: <strong className="text-white font-bold">{alert.unitsRequired}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(alert.createdAt || Date.now()).toLocaleTimeString()}
                      </span>
                      {alert.contactPhone && (
                        <span className="flex items-center gap-1 text-emerald-400">
                          <Phone className="w-3.5 h-3.5" /> {alert.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    {isAccepted ? (
                      <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5 border border-emerald-500/30">
                        <CheckCircle className="w-4 h-4" /> Mobilized as Donor
                      </span>
                    ) : isDeclined ? (
                      <span className="text-xs text-white/40 italic">Declined</span>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAction(alert._id || alert.requestId, 'decline')}
                          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-xs transition-colors"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAction(alert._id || alert.requestId, 'accept')}
                          className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                        >
                          <Droplet className="w-4 h-4" />
                          <span>Respond & Donate</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DonorAlerts;
