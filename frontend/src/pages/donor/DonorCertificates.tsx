import React from 'react';
import { Award, ShieldCheck, Download, ExternalLink, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const DonorCertificates: React.FC = () => {
  const { user } = useAuth();

  const certificates = [
    {
      id: 'CERT-2026-9901',
      date: 'August 10, 2026',
      bloodGroup: user?.bloodGroup || 'O+',
      units: '1 Unit Whole Blood',
      center: 'Metropolitan Central Blood Bank',
      hash: '0x8f2a991c4be8...392d',
    },
    {
      id: 'CERT-2026-7742',
      date: 'May 14, 2026',
      bloodGroup: user?.bloodGroup || 'O+',
      units: '1 Unit Whole Blood',
      center: 'St. Jude Community Clinic',
      hash: '0x3c1b782e9fa1...b410',
    },
    {
      id: 'CERT-2026-4419',
      date: 'February 02, 2026',
      bloodGroup: user?.bloodGroup || 'O+',
      units: '1 Unit Platelets',
      center: 'Metropolitan Central Blood Bank',
      hash: '0x17ea008f43ac...98d2',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Donation Certificates</h2>
        <p className="text-sm text-white/50">
          Cryptographically issued certificates acknowledging your lifesaving contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="glass-card p-6 rounded-3xl border border-white/10 hover:border-red-500/40 transition-all flex flex-col justify-between relative overflow-hidden group"
          >
            {/* Certificate Header Banner */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2 text-red-400">
                <Award className="w-5 h-5" />
                <span className="font-bold text-sm tracking-wide">CERTIFICATE OF LIFE</span>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded text-white/70">
                {cert.id}
              </span>
            </div>

            {/* Certificate Body */}
            <div className="py-6 space-y-4">
              <p className="text-xs text-white/60 leading-relaxed">
                This certifies that <strong className="text-white">{user?.fullName || 'Certified Donor'}</strong> has generously donated blood, bringing immediate emergency relief.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-white/40 block">Date of Donation</span>
                  <span className="font-semibold text-white">{cert.date}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Blood Group</span>
                  <span className="font-semibold text-red-400">{cert.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Donation Facility</span>
                  <span className="font-semibold text-white truncate block">{cert.center}</span>
                </div>
                <div>
                  <span className="text-white/40 block">Volume</span>
                  <span className="font-semibold text-white">{cert.units}</span>
                </div>
              </div>

              {/* QR Verification Badge */}
              <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3 border border-white/10">
                <div className="p-2 bg-white rounded-lg shrink-0">
                  <QrCode className="w-6 h-6 text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                  </p>
                  <p className="text-[10px] text-white/40 font-mono truncate">{cert.hash}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                to={`/verify/${cert.id}`}
                className="text-xs text-white/70 hover:text-white flex items-center gap-1.5 transition-colors font-medium"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Verify Public Record</span>
              </Link>
              <button
                onClick={() => alert(`Certificate ${cert.id} downloaded.`)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
