import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  CheckCircle2,
  Droplet,
  ArrowRight,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const CampsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredCampIds, setRegisteredCampIds] = useState<string[]>([]);
  const [registeringId, setRegisteringId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await api.get('/camps');
      const data = res.data?.data || res.data || [];
      setCamps(data);

      if (user) {
        const alreadyRegistered = data
          .filter((c: any) => c.registeredDonors?.some((d: any) => d === user.id || d?._id === user.id))
          .map((c: any) => c._id || c.campId);
        setRegisteredCampIds(alreadyRegistered);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (campId: string) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRegisteringId(campId);
    setMessage(null);

    try {
      await api.post(`/camps/${campId}/register`);
      setRegisteredCampIds((prev) => [...prev, campId]);
      setMessage({
        text: 'Successfully registered for this donation camp! You will receive confirmation reminders.',
        type: 'success'
      });
      fetchCamps();
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || 'Failed to register. Please try again.',
        type: 'error'
      });
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-red-400" />
            <span>Voluntary Blood Donation Drives & Camps</span>
          </h2>
          <p className="text-sm text-white/50">
            Join community blood donation camps organized by certified healthcare facilities
          </p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            message.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : camps.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-white/10 text-white/50 space-y-3">
          <Calendar className="w-12 h-12 mx-auto text-white/20" />
          <p className="text-base font-semibold text-white/70">No upcoming donation drives scheduled currently.</p>
          <p className="text-xs">Check back soon or visit a certified blood bank center directly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {camps.map((camp) => {
            const isRegistered = registeredCampIds.includes(camp._id || camp.campId);
            const dateStr = new Date(camp.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={camp._id || camp.campId}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-red-400 transition-colors">
                        {camp.title}
                      </h3>
                      <p className="text-xs text-white/50 flex items-center gap-1.5 mt-1">
                        <Building2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Organized by {camp.organizer || 'BloodConnect Medical Guild'}</span>
                      </p>
                    </div>
                    <Badge variant={camp.status === 'UPCOMING' ? 'green' : 'blue'} size="sm">
                      {camp.status || 'UPCOMING'}
                    </Badge>
                  </div>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {camp.description || 'Community voluntary blood donation drive providing emergency reserves.'}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-white/5 p-3.5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-white/80">
                      <Calendar className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{dateStr}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{camp.startTime || '09:00 AM'} - {camp.endTime || '05:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 col-span-2">
                      <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="truncate">{camp.venue}, {camp.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/50 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-white/40" />
                      Target: <strong className="text-white font-bold">{camp.targetDonations || 100} Donors</strong>
                    </span>
                    <span>
                      Registered: <strong className="text-emerald-400 font-bold">{camp.registeredDonors?.length || 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-white/40 font-mono">
                    ID: {camp.campId || 'CAMP'}
                  </span>

                  {isRegistered ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Registered
                    </span>
                  ) : (
                    <button
                      onClick={() => handleRegister(camp._id)}
                      disabled={registeringId === camp._id}
                      className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                    >
                      {registeringId === camp._id ? (
                        <span>Registering...</span>
                      ) : (
                        <>
                          <Droplet className="w-3.5 h-3.5" />
                          <span>Volunteer & Register</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CampsPage;
