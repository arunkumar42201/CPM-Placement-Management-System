import React, { useState, useEffect } from 'react';
import { Award, Sparkles, Building2, User, DollarSign, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { placementCellService } from '../../services/api';

export const PlacementResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await placementCellService.getAllResults();
        if (res.success && res.data) {
          setResults(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800">Placement Offers & Success Wall</h1>
            <button
              onClick={triggerCelebration}
              className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 hover:bg-amber-200 transition"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-spin" /> Celebrate!
            </button>
          </div>
          <p className="text-xs text-slate-500">Official registry of confirmed employment offers and student achievements</p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No placement results recorded yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600">{r.companyName}</span>
                  <h3 className="text-base font-bold text-slate-800 mt-0.5">{r.studentName}</h3>
                  <p className="text-[11px] text-slate-400">{r.designation}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                  <Award className="h-5 w-5" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Package: </span>
                  <span className="font-extrabold text-emerald-600 text-sm">₹{r.packageLpa} LPA</span>
                </div>
                <div className="text-slate-500">
                  {r.offerDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementResults;
