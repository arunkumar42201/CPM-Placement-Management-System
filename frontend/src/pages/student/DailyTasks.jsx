import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Trash2, CheckCircle2, Clock, Flame, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { taskService, studentService } from '../../services/api';

export const DailyTasks = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Add Task Modal
  const [showModal, setShowModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', category: 'CODING', dueDate: new Date().toISOString().split('T')[0] });

  const loadTasks = async () => {
    if (!user?.id) return;
    try {
      const profRes = await studentService.getByUserId(user.id);
      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
        const [taskListRes, sumRes] = await Promise.all([
          taskService.getStudentTasks(profRes.data.id),
          taskService.getTaskSummary(profRes.data.id),
        ]);
        if (taskListRes.success) setTasks(taskListRes.data || []);
        if (sumRes.success) setSummary(sumRes.data || {});
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [user]);

  const handleToggle = async (taskId) => {
    try {
      await taskService.toggleTask(taskId);
      loadTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      loadTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!profile?.id || !taskForm.title) return;
    try {
      await taskService.createTask(profile.id, taskForm);
      setShowModal(false);
      setTaskForm({ title: '', category: 'CODING', dueDate: new Date().toISOString().split('T')[0] });
      loadTasks();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredTasks = tasks.filter((t) =>
    selectedCategory === 'ALL' ? true : t.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800">Placement Preparation Checklist</h1>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
              <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              7 Day Streak
            </span>
          </div>
          <p className="text-xs text-slate-500">Track daily coding exercises, aptitude drills, and academic milestones</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Preparation Task
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Tasks</span>
          <div className="mt-1 text-2xl font-black text-slate-800">{summary.totalTasks}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Completed</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">{summary.completedTasks}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Pending</span>
          <div className="mt-1 text-2xl font-black text-amber-600">{summary.pendingTasks}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Completion Rate</span>
          <div className="mt-1 text-2xl font-black text-indigo-600">{summary.completionRate || 0}%</div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        {['ALL', 'CODING', 'APTITUDE', 'ACADEMIC', 'INTERVIEW_PREP'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No tasks found in this category. Click "+ Add Preparation Task" to create one!
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between rounded-2xl border p-4 transition ${
                task.completed
                  ? 'border-slate-100 bg-slate-50/70 text-slate-400'
                  : 'border-slate-200 bg-white shadow-sm hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggle(task.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className={`text-xs font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                      {task.category}
                    </span>
                    <span>Due: {task.dueDate || 'Today'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-500 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Preparation Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Solve 3 Graph Algorithm Problems on LeetCode"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  >
                    <option value="CODING">Coding & DSA</option>
                    <option value="APTITUDE">Aptitude & Reasoning</option>
                    <option value="ACADEMIC">Academic Studies</option>
                    <option value="INTERVIEW_PREP">Interview Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-600">Target Due Date</label>
                  <input
                    type="date"
                    required
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyTasks;
