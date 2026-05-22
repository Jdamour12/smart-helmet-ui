'use client';

import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { mockSupervisors, adminSystemStats } from '@/lib/mock-data';

export default function SupervisorsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manage Supervisors</h2>
          <p className="text-foreground-secondary mt-1">View, edit, and manage supervisor accounts</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Supervisor
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Supervisors</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.totalSupervisors}</p>
              <p className="text-xs text-foreground-tertiary mt-2">All accounts</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{adminSystemStats.totalSupervisors}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Active Supervisors</p>
              <p className="text-3xl font-bold text-success mt-2">{adminSystemStats.activeSupervisors}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Currently active</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-success">{adminSystemStats.activeSupervisors}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Workers Assigned</p>
              <p className="text-3xl font-bold text-foreground mt-2">
                {Math.round(adminSystemStats.totalWorkers / adminSystemStats.totalSupervisors)}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Per supervisor</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-info">
                {Math.round(adminSystemStats.totalWorkers / adminSystemStats.totalSupervisors)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Avg Gateways</p>
              <p className="text-3xl font-bold text-warning mt-2">
                {Math.round(adminSystemStats.totalGateways / adminSystemStats.totalSupervisors)}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Per supervisor</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-warning">
                {Math.round(adminSystemStats.totalGateways / adminSystemStats.totalSupervisors)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Supervisors Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Supervisors List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Location</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Workers</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Last Active</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockSupervisors.map((supervisor) => (
                <tr key={supervisor.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{supervisor.name}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{supervisor.email}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{supervisor.location}</td>
                  <td className="py-3 px-4 text-foreground text-sm">{supervisor.assignedWorkers}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        supervisor.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {supervisor.status.charAt(0).toUpperCase() + supervisor.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">
                    {new Date(supervisor.lastActive).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-background rounded transition-colors" title="View">
                        <Eye className="w-4 h-4 text-info" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 text-primary" />
                      </button>
                      <button className="p-2 hover:bg-background rounded transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-critical" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
