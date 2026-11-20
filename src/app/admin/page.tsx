"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  Layers,
  Wrench,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useAtlasStore } from "@/lib/store";

export default function AdminPage() {
  const { user, setRole } = useAtlasStore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalTools: 0, totalModels: 0 });
  const [loading, setLoading] = useState(true);

  const fetchAdminData = () => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.submissions) setSubmissions(data.submissions);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        setStats({ totalTools: data.totalTools, totalModels: data.totalModels });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleApprove = async (submissionId: string) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", submissionId }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (user.role !== "admin") {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-white">Administrator Access Required</h2>
        <p className="text-xs text-atlas-textMuted leading-relaxed">
          The Admin Control Center is protected by role-based authorization. Your current active role is &ldquo;<span className="text-white font-mono">{user.role}</span>&rdquo;.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setRole("admin")}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs font-mono shadow-sm transition-all"
          >
            Switch to Admin Role (Testing Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-atlas-border pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">
              Admin Control Center
            </h1>
          </div>
          <p className="text-xs text-atlas-textMuted font-mono">
            Platform governance, community submission moderation, and immutable audit logs.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-atlas-surface border border-atlas-border text-xs font-mono text-atlas-textMuted hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-atlas-card border border-atlas-border space-y-1">
          <span className="text-xs font-mono text-atlas-textFaint">Total Verified Tools</span>
          <div className="text-2xl font-heading font-bold text-white">{stats.totalTools}</div>
        </div>
        <div className="p-5 rounded-2xl bg-atlas-card border border-atlas-border space-y-1">
          <span className="text-xs font-mono text-atlas-textFaint">Total AI Models</span>
          <div className="text-2xl font-heading font-bold text-atlas-cyan">{stats.totalModels}</div>
        </div>
        <div className="p-5 rounded-2xl bg-atlas-card border border-atlas-border space-y-1">
          <span className="text-xs font-mono text-atlas-textFaint">Pending Submissions</span>
          <div className="text-2xl font-heading font-bold text-amber-400">
            {submissions.filter((s) => s.status === "pending").length}
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-atlas-card border border-atlas-border space-y-1">
          <span className="text-xs font-mono text-atlas-textFaint">Total Audit Events</span>
          <div className="text-2xl font-heading font-bold text-emerald-400">{auditLogs.length}</div>
        </div>
      </div>

      {/* Community Submission Approval Queue */}
      <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-4">
        <div className="flex items-center justify-between border-b border-atlas-border/60 pb-3">
          <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-atlas-blue" />
            Community Moderation Queue
          </h2>
          <span className="text-xs font-mono text-atlas-textFaint">
            {submissions.length} Total Submissions
          </span>
        </div>

        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-4 rounded-2xl bg-atlas-surface border border-atlas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">{sub.title}</span>
                  <span className="px-2 py-0.5 rounded bg-atlas-card border border-atlas-border text-atlas-cyan text-[10px] uppercase">
                    {sub.type}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      sub.status === "approved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
                <div className="text-atlas-textMuted text-[11px]">
                  Submitted: {sub.submittedAt}
                </div>
              </div>

              {sub.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all shadow-sm"
                  >
                    Approve & Publish
                  </button>
                </div>
              )}
            </div>
          ))}

          {submissions.length === 0 && (
            <div className="py-8 text-center text-xs text-atlas-textFaint">
              No pending community submissions in moderation queue.
            </div>
          )}
        </div>
      </div>

      {/* Immutable Audit Logs Table */}
      <div className="p-6 rounded-3xl bg-atlas-card border border-atlas-border space-y-4">
        <div className="flex items-center justify-between border-b border-atlas-border/60 pb-3">
          <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            System Audit Logs
          </h2>
          <span className="text-xs font-mono text-atlas-textFaint">Chronological Order</span>
        </div>

        <div className="divide-y divide-atlas-border/40 font-mono text-xs">
          {auditLogs.slice(0, 10).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-atlas-cyan font-bold">{log.action}</span>
                <span className="text-atlas-textMuted text-[11px] truncate max-w-md">
                  {JSON.stringify(log.details)}
                </span>
              </div>
              <span className="text-[11px] text-atlas-textFaint shrink-0">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
