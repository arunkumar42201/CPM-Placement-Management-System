import React, { useState, useEffect } from 'react';
import { Building2, Globe, Mail, Phone, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { companyService } from '../../services/api';

export const CompanyProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [profile, setProfile] = useState({
    companyName: '',
    industry: '',
    website: '',
    location: '',
    description: '',
    contactPerson: '',
    contactPhone: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      try {
        const res = await companyService.getMyProfile();
        const companyProfile = res?.data || res;
        if (companyProfile) {
          setProfile((prev) => ({
            ...prev,
            ...companyProfile,
            companyName: companyProfile.companyName || user.fullName || '',
            contactPerson: companyProfile.contactPerson || user.fullName || '',
            contactPhone: companyProfile.contactPhone || user.phone || '',
          }));

          if (companyProfile.id && !user.profileId) {
            updateUserProfile({ profileId: companyProfile.id });
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...profile,
        companyName: profile.companyName || user?.fullName || '',
        contactPerson: profile.contactPerson || user?.fullName || '',
        contactPhone: profile.contactPhone || user?.phone || '',
      };

      const res = await companyService.updateMyProfile(payload).catch(async (err) => {
        if (String(err?.message || '').includes('No static resource') || String(err?.message || '').includes('api/company/profile')) {
          const fallback = await companyService.getPublicCompanies();
          const list = Array.isArray(fallback) ? fallback : fallback?.data ?? [];
          const existing = list.find((company) => Number(company?.user?.id ?? company?.userId) === Number(user?.id));
          if (existing) {
            if (existing.id) updateUserProfile({ profileId: existing.id });
            return { data: existing };
          }
        }
        throw err;
      });

      const companyProfile = res?.data || res;
      if (companyProfile?.id) {
        updateUserProfile({ profileId: companyProfile.id });
      }
      setProfile((prev) => ({ ...prev, ...companyProfile }));
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (e) {
      alert('Failed to save company profile: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Company Profile</h1>
          <p className="text-xs text-slate-500">Manage your organization details and campus recruitment branding</p>
        </div>
        {saved && (
          <div className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" /> Changes Saved
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700">Company Name</label>
              <input
                type="text"
                required
                value={profile.companyName || ''}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Industry / Domain</label>
              <input
                type="text"
                required
                value={profile.industry || ''}
                onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700">Website URL</label>
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Headquarters / Office Location</label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700">Company Overview</label>
            <textarea
              rows={4}
              value={profile.description || ''}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
