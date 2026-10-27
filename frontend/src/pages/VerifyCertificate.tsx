import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ArrowLeft, Droplet, User, Building, Calendar, CheckCircle2 } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import api from '../services/api';

export const VerifyCertificate: React.FC = () => {
  const { certId } = useParams();
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!certId) {
      setError('No certificate ID specified.');
      setLoading(false);
      return;
    }

    api.get(`/certificates/${certId}`)
      .then((res) => {
        setCertificate(res.data?.data || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Certificate record not found in BloodConnect registry.');
        setLoading(false);
      });
  }, [certId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 flex flex-col items-center justify-center p-6 text-white">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-white/60">Verifying cryptographic record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-900 bg-hero-gradient flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-lg glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
        {certificate ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-9 h-9" />
              </div>
              <Badge variant="green" size="md">
                Cryptographically Verified Genuine
              </Badge>
              <h2 className="text-2xl font-extrabold text-white mt-3">Authentic Certificate</h2>
              <p className="text-xs text-white/50">Verified directly against BloodConnect immutable records</p>
            </div>

            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 text-sm">
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Certificate ID</span>
                <span className="font-mono font-bold text-red-400">{certificate.certificateId}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Blood Unit Code</span>
                <span className="font-mono text-white">{certificate.bloodUnitCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Blood Group</span>
                <span className="font-bold text-red-400">{certificate.bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Component Type</span>
                <span className="text-white">{certificate.component?.replace(/_/g, ' ') || 'WHOLE BLOOD'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Authorized Facility</span>
                <span className="text-white">{certificate.authorizedBloodBank?.name || 'Verified Blood Bank'}</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-white/10">
                <span className="text-white/50 text-xs">Certification Date</span>
                <span className="text-white">
                  {certificate.certificationDate ? new Date(certificate.certificationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                </span>
              </div>
              {certificate.qrDataUrl && (
                <div className="flex flex-col items-center py-3 border-t border-white/10">
                  <span className="text-white/50 text-xs mb-2">Registry QR Verification Stamp</span>
                  <img src={certificate.qrDataUrl} alt="QR Code" className="w-28 h-28 rounded-lg bg-white p-1" />
                </div>
              )}
              <div className="py-2">
                <span className="text-white/50 text-xs block mb-1">SHA-256 Integrity Hash</span>
                <span className="font-mono text-[10px] text-white/40 break-all">{certificate.sha256IntegrityHash || 'N/A'}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <Badge variant="red" size="md">
              Unverified / Not Found
            </Badge>
            <h2 className="text-2xl font-extrabold text-white mt-3">Certificate Not Found</h2>
            <p className="text-xs text-white/50 mt-2 max-w-sm mx-auto">
              {error || 'The certificate identifier could not be verified in our records.'}
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to BloodConnect Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
