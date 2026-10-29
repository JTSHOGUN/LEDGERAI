import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types';
import {
  Users2,
  Plus,
  Shield,
  Check,
  X,
  Mail,
  UserCheck
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { teamMembers, inviteTeamMember } = useApp();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Finance Manager');

  const permissionsMatrix = [
    { module: 'View Dashboard & Financial Reports', Owner: true, Admin: true, Accountant: true, 'Finance Manager': true, Employee: false, Viewer: true },
    { module: 'Record Transactions & Mobile Money Feeds', Owner: true, Admin: true, Accountant: true, 'Finance Manager': true, Employee: true, Viewer: false },
    { module: 'Create & Issue Invoices to Customers', Owner: true, Admin: true, Accountant: true, 'Finance Manager': true, Employee: true, Viewer: false },
    { module: 'Approve & Disburse Supplier Bills', Owner: true, Admin: true, Accountant: true, 'Finance Manager': true, Employee: false, Viewer: false },
    { module: 'Reconcile Bank & MoMo Statements', Owner: true, Admin: true, Accountant: true, 'Finance Manager': true, Employee: false, Viewer: false },
    { module: 'Export Tax Schedules & URA EFRIS Returns', Owner: true, Admin: true, Accountant: true, 'Finance Manager': false, Employee: false, Viewer: false },
    { module: 'Manage Organization Settings & Custom Domain', Owner: true, Admin: true, Accountant: false, 'Finance Manager': false, Employee: false, Viewer: false },
  ];

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    inviteTeamMember(name, email, role);
    setIsInviteOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Team Members & Role-Based Access
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage granular permissions across Owners, Admins, Accountants, and Employees
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">Authorized Workspace Users ({teamMembers.length})</h3>
        </div>

        <div className="divide-y divide-stone-100 text-xs">
          {teamMembers.map(member => (
            <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-stone-900 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-stone-900">{member.name}</p>
                  <p className="text-[11px] text-stone-500">{member.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono text-stone-400 text-[11px]">Last active: {member.lastActive}</span>
                <span className="px-2.5 py-1 rounded bg-stone-100 text-stone-800 font-semibold border border-stone-200">
                  {member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50">
          <h3 className="text-sm font-bold text-stone-900">Permissions Matrix</h3>
          <p className="text-xs text-stone-500">Access control rules per workspace role</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 text-[11px] uppercase tracking-wider font-semibold">
                <th className="p-3">Module Action</th>
                <th className="p-3 text-center">Owner</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Accountant</th>
                <th className="p-3 text-center">Finance Mgr</th>
                <th className="p-3 text-center">Employee</th>
                <th className="p-3 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {permissionsMatrix.map((p, idx) => (
                <tr key={idx} className="hover:bg-stone-50">
                  <td className="p-3 font-medium text-stone-800">{p.module}</td>
                  <td className="p-3 text-center">{p.Owner ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-3 text-center">{p.Admin ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-3 text-center">{p.Accountant ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-3 text-center">{p['Finance Manager'] ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-3 text-center">{p.Employee ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                  <td className="p-3 text-center">{p.Viewer ? <Check className="w-4 h-4 text-emerald-800 mx-auto" /> : <X className="w-4 h-4 text-stone-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h2 className="text-sm font-bold text-stone-900">Invite Team Member</h2>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 text-stone-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInviteSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Grace Akello"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Work Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="grace@freshsupplies.ug"
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-stone-700 font-semibold mb-1">Role Assignment</label>
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg"
                >
                  <option value="Admin">Admin</option>
                  <option value="Accountant">Accountant (CPA)</option>
                  <option value="Finance Manager">Finance Manager</option>
                  <option value="Employee">Employee (Invoicing & Receipts only)</option>
                  <option value="Viewer">Viewer (Read-only)</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 text-stone-600 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
