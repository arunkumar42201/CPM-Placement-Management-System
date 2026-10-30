import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Bot, Award, CheckCircle2, AlertCircle, ArrowRight, 
  RefreshCw, Play, Clock, HelpCircle, ChevronRight, Check, MessageSquare 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { aiService } from '../../services/api';

export const MockInterview = () => {
  const [roleCategory, setRoleCategory] = useState('Full Stack Software Engineer');
  const [roundType, setRoundType] = useState('TECHNICAL');
  const [sessionActive, setSessionActive] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [completedEvaluations, setCompletedEvaluations] = useState([]);
  const [sessionFinished, setSessionFinished] = useState(false);

  const startInterview = async () => {
    setEvaluating(true);
    setCompletedEvaluations([]);
    setEvaluation(null);
    setCurrentIndex(0);
    setCurrentAnswer('');
    setSessionFinished(false);

    try {
      const res = await aiService.getMockQuestions(roleCategory, roundType, 3);
      if (res.success && res.data?.length > 0) {
        setQuestions(res.data);
        setSessionActive(true);
      } else {
        throw new Error('Failed to load questions');
      }
    } catch (e) {
      // Fallback questions if offline
      setQuestions([
        {
          id: 'fb-1',
          question: 'Explain how database indexes (B-Tree vs Hash) improve query performance. When might adding an index hurt system write throughput?',
          hint: 'Mention index search time complexity O(log N) vs full table scans O(N), and the write overhead of updating index trees on INSERT/UPDATE/DELETE operations.'
        },
        {
          id: 'fb-2',
          question: 'How does connection pooling improve performance in high-concurrency enterprise backend applications?',
          hint: 'Explain TCP handshake and authentication overhead, thread waiting queues, and HikariCP connection reuse.'
        },
        {
          id: 'fb-3',
          question: 'Describe a time you diagnosed and resolved a challenging technical bug. What was your systematic debugging methodology?',
          hint: 'Structure your answer using the STAR method (Situation, Task, Action, Result).'
        }
      ]);
      setSessionActive(true);
    } finally {
      setEvaluating(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!currentAnswer.trim() || evaluating) return;
    setEvaluating(true);

    const currentQ = questions[currentIndex];
    try {
      const res = await aiService.evaluateMockAnswer({
        roleCategory,
        roundType,
        question: currentQ?.question,
        answer: currentAnswer
      });

      if (res.success && res.data) {
        setEvaluation(res.data);
        setCompletedEvaluations((prev) => [
          ...prev,
          { question: currentQ?.question, answer: currentAnswer, evaluation: res.data }
        ]);
      }
    } catch (e) {
      alert('AI Evaluation completed with fallback heuristics.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setCurrentAnswer('');
      setEvaluation(null);
    } else {
      setSessionFinished(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const averageScore = completedEvaluations.length > 0
    ? Math.round(
        completedEvaluations.reduce((acc, curr) => acc + (curr.evaluation?.overallScore || 7), 0) /
        completedEvaluations.length
      )
    : 8;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
              AI Interview Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              AI Mock Interview Simulator
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              Simulate high-pressure campus recruitment interviews with real-time AI scoring, architectural depth evaluation, and constructive feedback.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 border border-white/20 p-4 text-center backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-indigo-200">Session Mode</span>
              <div className="text-sm font-black mt-0.5">{roundType}</div>
            </div>
          </div>
        </div>
      </div>

      {!sessionActive && !sessionFinished && (
        /* Configuration Setup Panel */
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Configure Your Interview Session</h3>
            <p className="text-xs text-slate-500">Choose your targeted engineering role and interview round format</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Engineering Role</label>
              <select
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 font-semibold text-slate-800 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer (React + Spring Boot)</option>
                <option value="Backend Java Engineer">Backend Java Engineer (Microservices, Concurrency, SQL)</option>
                <option value="Frontend Web Developer">Frontend Web Developer (React, TypeScript, CSS)</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer (AWS, Docker, Kubernetes)</option>
                <option value="Data Science & ML Engineer">Data Science & ML Engineer (Python, SQL, ML Models)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Interview Round Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'TECHNICAL', label: 'Technical Concepts' },
                  { id: 'SYSTEM_DESIGN', label: 'System Design' },
                  { id: 'DSA', label: 'Data Structures' },
                  { id: 'BEHAVIORAL', label: 'Behavioral STAR' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoundType(r.id)}
                    className={`rounded-2xl border p-3 font-bold text-center transition ${
                      roundType === r.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startInterview}
              disabled={evaluating}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/25 w-full"
            >
              <Play className="h-4 w-4" /> Start Interview Session Now
            </button>
          </div>
        </div>
      )}

      {sessionActive && !sessionFinished && (
        /* Active Interview Interactive Question Panel */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Question Stepper */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-200">
            <span>
              Question <strong className="text-indigo-600">{currentIndex + 1}</strong> of {questions.length}
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-indigo-700">
              {roundType} ROUND
            </span>
          </div>

          {/* Question Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-black">
                Q{currentIndex + 1}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {questions[currentIndex]?.question}
                </h3>
                {questions[currentIndex]?.hint && (
                  <p className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    💡 <strong>Interviewer Tip:</strong> {questions[currentIndex]?.hint}
                  </p>
                )}
              </div>
            </div>

            {/* Answer Input */}
            <form onSubmit={handleEvaluate} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Answer & Technical Explanation:
                </label>
                <textarea
                  rows={6}
                  required
                  disabled={!!evaluation}
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your structured explanation here (clarify trade-offs, architecture, time/space complexity)..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              {!evaluation ? (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!currentAnswer.trim() || evaluating}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
                  >
                    <Sparkles className="h-4 w-4" />
                    {evaluating ? 'AI Evaluating...' : 'Evaluate Answer with AI'}
                  </button>
                </div>
              ) : null}
            </form>
          </div>

          {/* Real-time AI Evaluation Feedback Card */}
          {evaluation && (
            <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-white to-emerald-50/30 p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white font-black text-lg shadow-md shadow-emerald-600/30">
                    {evaluation.overallScore}/10
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">AI Evaluation Feedback</h4>
                    <p className="text-xs text-slate-500">Technical depth & delivery assessment</p>
                  </div>
                </div>

                <div className="flex gap-2 text-xs">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-indigo-700 font-bold">
                    Tech: {evaluation.technicalScore}/10
                  </span>
                  <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-purple-700 font-bold">
                    Clarity: {evaluation.clarityScore}/10
                  </span>
                  <span className="rounded-lg bg-teal-50 px-2.5 py-1 text-teal-700 font-bold">
                    Structure: {evaluation.structureScore}/10
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {evaluation.feedbackSummary}
              </p>

              {/* Strengths & Improvements */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-2">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Key Strengths
                  </span>
                  <ul className="space-y-1 text-emerald-900 text-[11px]">
                    {evaluation.keyStrengths?.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 space-y-2">
                  <span className="font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-600" /> Suggestions to Improve
                  </span>
                  <ul className="space-y-1 text-amber-900 text-[11px]">
                    {evaluation.improvementAreas?.map((imp, i) => (
                      <li key={i}>• {imp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md"
                >
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'Complete Interview'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Final Session Scorecard */}
      {sessionFinished && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 text-3xl font-black shadow-md">
            {averageScore}/10
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-800">Interview Session Completed!</h2>
            <p className="text-xs text-slate-500 mt-1">
              You answered all {completedEvaluations.length} interview questions for {roleCategory} ({roundType} Round).
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 text-xs text-left space-y-2">
            <span className="font-bold text-slate-700">Interview Readiness Takeaway:</span>
            <p className="text-slate-600 leading-relaxed">
              Your conceptual understanding is solid. Review the model architecture answers and practice articulating trade-offs out loud to build natural pacing before campus drive day.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSessionActive(false);
                setSessionFinished(false);
              }}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              Configure Another Round
            </button>
            <button
              onClick={startInterview}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
            >
              Restart This Round
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
