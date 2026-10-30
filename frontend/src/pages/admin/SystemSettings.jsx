import React, { useState } from 'react';
import { Settings, Save, ShieldCheck, Database, Bell, CheckCircle2 } from 'lucide-react';

export const SystemSettings = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    academicYear: '2026-2027',
    activePlacementSeason: true,
    minAttendancePercent: 75,
    enableSelfRegistration: true,
    emailAlertsEnabled: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">System & Academic Settings</h1>
          <p className="text-xs text-slate-500">Configure global parameters, attendance thresholds, and placement season status</p>
        </div>
        {saved && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> Settings Updated
          </span>
        )}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700">Active Academic Year</label>
            <input
              type="text"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Minimum Exam & Placement Attendance Cutoff (%)</label>
            <input
              type="number"
              min="50"
              max="100"
              value={settings.minAttendancePercent}
              onChange={(e) => setSettings({ ...settings, minAttendancePercent: Number(e.target.value) })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
            />
          </div>

          <div className="pt-2 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.activePlacementSeason}
                onChange={(e) => setSettings({ ...settings, activePlacementSeason: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Enable Live Campus Placement Season 2026-27</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSelfRegistration}
                onChange={(e) => setSettings({ ...settings, enableSelfRegistration: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Allow Student and Corporate Self-Registration</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlertsEnabled}
                onChange={(e) => setSettings({ ...settings, emailAlertsEnabled: e.target.checked })}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
              />
              <span className="font-semibold text-slate-700">Enable Real-Time Email Notification Dispatch</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
            >
              <Save className="h-4 w-4" /> Save System Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
