'use client';

import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { mockWorkers, adminSystemStats } from '@/lib/mock-data';

export default function WorkersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Manage Workers</h2>
          <p className="text-foreground-secondary mt-1">Manage worker accounts and assignments</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Worker
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Total Workers</p>
              <p className="text-3xl font-bold text-foreground mt-2">{adminSystemStats.totalWorkers}</p>
              <p className="text-xs text-foreground-tertiary mt-2">All accounts</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-primary">{adminSystemStats.totalWorkers}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Active Workers</p>
              <p className="text-3xl font-bold text-success mt-2">{adminSystemStats.activeWorkers}</p>
              <p className="text-xs text-foreground-tertiary mt-2">Currently active</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-success">{adminSystemStats.activeWorkers}</span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Inactive Workers</p>
              <p className="text-3xl font-bold text-warning mt-2">
                {adminSystemStats.totalWorkers - adminSystemStats.activeWorkers}
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Need attention</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-warning">
                {adminSystemStats.totalWorkers - adminSystemStats.activeWorkers}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-background-secondary border border-border rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-foreground-secondary text-sm font-medium">Activation Rate</p>
              <p className="text-3xl font-bold text-info mt-2">
                {Math.round((adminSystemStats.activeWorkers / adminSystemStats.totalWorkers) * 100)}%
              </p>
              <p className="text-xs text-foreground-tertiary mt-2">Active ratio</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-info">
                {Math.round((adminSystemStats.activeWorkers / adminSystemStats.totalWorkers) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Workers List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Name</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Email</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Department</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Supervisor</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Helmets</th>
                <th className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockWorkers.map((worker) => (
                <tr key={worker.id} className="border-b border-border/50 hover:bg-background transition-colors">
                  <td className="py-3 px-4 text-foreground font-medium">{worker.name}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.email}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.department}</td>
                  <td className="py-3 px-4 text-foreground-secondary text-sm">{worker.supervisor}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        worker.status === 'active'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}
                    >
                      {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-foreground text-sm">{worker.helmets}</td>
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
