import React from 'react';
import { Award, BookOpen, Code, Lightbulb, CheckCircle2, ExternalLink } from 'lucide-react';

export const TeacherPlacementPrep = () => {
  const prepModules = [
    {
      title: 'Top 50 Data Structures & Algorithms Patterns',
      category: 'Technical Interview',
      tips: [
        'Master Two Pointers and Sliding Window techniques for array strings.',
        'Revise Tree Traversal (Inorder, Preorder, Postorder, BFS Level-Order).',
        'Practice Dynamic Programming: 0/1 Knapsack, Longest Common Subsequence.',
        'Graph Shortest Paths: Dijkstra, Bellman-Ford, and Topo Sort.'
      ]
    },
    {
      title: 'Operating Systems & Concurrency Essentials',
      category: 'Core Engineering',
      tips: [
        'Process Synchronization: Semaphores, Mutex, Deadlock conditions.',
        'Memory Management: Virtual Memory, Paging, Thrashing, Page Replacement algorithms.',
        'CPU Scheduling: Round Robin, Preemptive SJF.',
        'Inter-Process Communication and Thread Lifecycles.'
      ]
    },
    {
      title: 'Database Management Systems & SQL Mastery',
      category: 'Database Architecture',
      tips: [
        'ACID Properties and Transaction Isolation Levels.',
        'Indexing: B-Trees vs Hash Indexing and performance trade-offs.',
        'Complex SQL: Window Functions (ROW_NUMBER, RANK, DENSE_RANK), Self Joins.',
        'Database Normalization (1NF through BCNF) and Denormalization use-cases.'
      ]
    },
    {
      title: 'Behavioral & HR Interview Framework (STAR Method)',
      category: 'Soft Skills',
      tips: [
        'Situation: Set the scene and describe the specific scenario.',
        'Task: Explain the challenge and your specific responsibility.',
        'Action: Describe the precise technical steps and decisions you took.',
        'Result: Quantify your impact (e.g. "improved latency by 25%").'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Placement Preparation & Interview Guides</h1>
        <p className="text-xs text-slate-500">Faculty-curated roadmaps, technical question banks, and behavioral guidance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {prepModules.map((mod, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                {mod.category}
              </span>
              <Lightbulb className="h-4 w-4 text-amber-500" />
            </div>

            <h3 className="text-base font-bold text-slate-800">{mod.title}</h3>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              {mod.tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherPlacementPrep;
