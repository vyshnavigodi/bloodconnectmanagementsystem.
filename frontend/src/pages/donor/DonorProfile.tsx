import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Droplet, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const DonorProfile: React.FC = () => {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Certified Donor',
    email: user?.email || 'donor@bloodconnect.org',
    bloodGroup: user?.bloodGroup || 'O+',
    phoneNumber: user?.phoneNumber || '+1 555-0199',
    city: user?.city || 'New York',
    availableForEmergency: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white">Donor Profile & Medical Preferences</h2>
        <p className="text-sm text-white/50">Keep your contact and availability details up-to-date for quick emergency dispatch.</p>
      </div>

      <form onSubmit={handleSave} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-white/10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-red-600/30">
            {formData.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{formData.fullName}</h3>
            <p className="text-sm text-white/50">{user?.role} Account &bull; Verified Donor</p>
            <span className="inline-block mt-2 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-300 rounded-lg text-xs font-bold">
              Blood Type: {formData.bloodGroup}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Full Legal Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              disabled
              value={formData.email}
              className="input-field opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">Primary City / Region</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        {/* Emergency Availability Toggle */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-white">Emergency On-Call Dispatch</h4>
            <p className="text-xs text-white/50">Allow local hospitals to send push notifications during critical blood shortages</p>
          </div>
          <input
            type="checkbox"
            checked={formData.availableForEmergency}
            onChange={(e) => setFormData({ ...formData, availableForEmergency: e.target.checked })}
            className="w-5 h-5 accent-red-600 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          {saved && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" /> Profile changes saved successfully
            </span>
          )}
          <div className="ml-auto">
            <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-3">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
