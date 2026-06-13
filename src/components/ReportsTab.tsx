import React, { useState } from 'react';
import { Task, Report, Staff, UserRole } from '../types';
import { ClipboardList, FileText, Plus, User, Check, Send, Sparkles, LayoutGrid, Calendar, CalendarCheck } from 'lucide-react';

interface ReportsTabProps {
  role: UserRole;
  username: string;
  tasks: Task[];
  reports: Report[];
  staff: Staff[];
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void;
  onCompleteTask: (id: string) => void;
  onAddReport: (report: Omit<Report, 'id' | 'date'>) => void;
}

export default function ReportsTab({
  role,
  username,
  tasks,
  reports,
  staff,
  onAddTask,
  onCompleteTask,
  onAddReport,
}: ReportsTabProps) {
  // Task state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStaffId, setTaskStaffId] = useState(staff[0]?.id || 's1');
  const [taskPriority, setTaskPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [taskDueDate, setTaskDueDate] = useState('2026-06-15');

  // Report state
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportSummary, setReportSummary] = useState('');

  // Submit report handler
  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim() || !reportSummary.trim()) return;

    // Get current uploader branch
    const matchedEmployee = staff.find(s => s.name.toLowerCase() === username.toLowerCase());
    const mBranch = matchedEmployee ? matchedEmployee.branchName : 'General Node';

    onAddReport({
      title: reportTitle,
      summary: reportSummary,
      uploaderName: username,
      branchName: mBranch,
    });

    setReportTitle('');
    setReportSummary('');
    setShowReportForm(false);
  };

  // Submit task handler
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDesc.trim()) return;

    onAddTask({
      title: taskTitle,
      description: taskDesc,
      staffId: taskStaffId,
      dueDate: taskDueDate,
      priority: taskPriority,
    });

    setTaskTitle('');
    setTaskDesc('');
    setShowTaskForm(false);
  };

  // Filters tasks for currently logged in staff (Abraham is s1)
  const loggedInStaffId = staff.find((s) => s.name.toLowerCase() === username.toLowerCase())?.id || 's1';
  const displayedTasks = role === 'Admin' ? tasks : tasks.filter((t) => t.staffId === loggedInStaffId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* COLUMN 1: Task Checklist Panel */}
      <div className="bg-white p-5 rounded-sm border border-slate-205 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                <ClipboardList size={16} className="text-blue-600" />
                <span>Assigned Workspace Tasks</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {role === 'Admin' ? 'Assign focus tasks to personnel' : 'Your pending operational checklists'}
              </p>
            </div>

            {role === 'Admin' && (
              <button
                onClick={() => setShowTaskForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] uppercase px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Assign Task</span>
              </button>
            )}
          </div>

          {/* Form to assign task as Admin */}
          {showTaskForm && role === 'Admin' && (
            <form onSubmit={handleTaskSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-3.5 text-xs text-slate-700 font-semibold shadow-inner">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">Create Task Node</span>
              
              <div className="space-y-1.5">
                <label className="block">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Count standing fans in showroom"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block">Detailed Guidelines</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Check the model number and cross reference with Alaba warehouse registry ledger sheet."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 text-[10px]">
                <div>
                  <label className="block mb-1">Assign To</label>
                  <select
                    value={taskStaffId}
                    onChange={(e) => setTaskStaffId(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1 outline-none"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1 outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-sm px-2 py-1 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskForm(false)}
                  className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 py-1.5 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-sm cursor-pointer"
                >
                  Confirm Assign
                </button>
              </div>
            </form>
          )}

          {/* Checklist queue */}
          <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
            {displayedTasks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12 font-medium">No active tasks logs found.</p>
            ) : (
              displayedTasks.map((t) => {
                const isCompleted = t.status === 'Completed';
                const assigneeName = staff.find((s) => s.id === t.staffId)?.name || 'Staff';

                return (
                  <div key={t.id} className={`p-4 rounded-sm border transition-all ${
                    isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-65'
                      : 'bg-white border-slate-200 hover:border-blue-200 shadow-xs'
                  }`}>
                    <div className="flex justify-between items-start gap-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm ${
                            t.priority === 'High' ? 'bg-red-50 text-red-705' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {t.priority} priority
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Due: {t.dueDate}</span>
                        </div>
                        <h4 className={`font-bold text-sm text-slate-850 capitalize ${isCompleted ? 'line-through text-slate-400' : ''}`}>
                          {t.title}
                        </h4>
                        <p className={`text-[11px] ${isCompleted ? 'text-slate-405' : 'text-slate-550'} leading-relaxed`}>{t.description}</p>
                        
                        {role === 'Admin' && (
                          <div className="text-[10px] text-slate-400 font-semibold pt-1">
                            Assigned to: <span className="text-slate-700 capitalize font-bold">{assigneeName}</span>
                          </div>
                        )}
                      </div>

                      {!isCompleted && (
                        <button
                          onClick={() => onCompleteTask(t.id)}
                          className="bg-blue-50 hover:bg-blue-105 border border-blue-200 p-1.5 rounded-sm text-blue-700 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                          title="Mark completed"
                        >
                          <Check size={14} className="stroke-[3]" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* COLUMN 2: Reports Hub Column */}
      <div className="bg-white p-5 rounded-sm border border-slate-205 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 font-sans">
                <FileText size={16} className="text-slate-800" />
                <span>Daily Operational Reports</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {role === 'Admin' ? 'Review daily notes from branch managers' : 'Submit daily activity overview to headquarters'}
              </p>
            </div>

            {role === 'Staff' && (
              <button
                onClick={() => setShowReportForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] uppercase px-3 py-1.5 rounded-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>Submit Report</span>
              </button>
            )}
          </div>

          {/* Form to upload report as Staff */}
          {showReportForm && role === 'Staff' && (
            <form onSubmit={handleReportSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-sm space-y-4 text-xs text-slate-700 font-semibold shadow-inner">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest block">Compose Daily Memo</span>

              <div className="space-y-1.5">
                <label className="block font-medium">Report Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Village Friday Summary"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs focus:border-blue-500 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-medium">Activity Summary Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Record what happened today, highlights, stock levels, sales velocity or issues..."
                  value={reportSummary}
                  onChange={(e) => setReportSummary(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-sm px-2.5 py-1.5 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 py-2 rounded-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-sm cursor-pointer flex items-center justify-center gap-1 font-semibold"
                >
                  <Send size={12} />
                  <span>Transmit Report</span>
                </button>
              </div>
            </form>
          )}

          {/* Chronological list of uploads */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
            {reports.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12 font-medium">No daily reports uploaded yet.</p>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-50 rounded-sm border border-slate-200 hover:bg-slate-100/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 text-xs text-slate-500 mb-2 border-b border-slate-150 pb-2">
                    <div className="flex items-center space-x-1 font-sans">
                      <User size={12} className="text-blue-605" />
                      <span className="text-slate-800 font-extrabold capitalize">{r.uploaderName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">at</span>
                      <span className="text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded-sm text-[10px]">{r.branchName}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{r.date}</span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-850 leading-snug mb-2">{r.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap bg-white p-3.5 rounded-sm border border-slate-200">
                    {r.summary}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
