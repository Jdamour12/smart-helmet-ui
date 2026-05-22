'use client';

import { useState } from 'react';
import { Bell, Sliders, Eye } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [notifications, setNotifications] = useState({
    critical: true,
    warning: true,
    info: false,
  });

  const [thresholds, setThresholds] = useState({
    co_warning: 20,
    co_critical: 40,
    ch4_warning: 0.8,
    ch4_critical: 1.5,
    temp_warning: 30,
    temp_critical: 35,
  });

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'thresholds', label: 'Safety Thresholds', icon: Sliders },
    { id: 'display', label: 'Display', icon: Eye },
  ];

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Settings</h2>
        <p className="text-foreground-secondary mt-1">Configure your dashboard preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-foreground-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-background-secondary border border-border rounded-lg p-6">
        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Alert Notifications</h3>
              <p className="text-foreground-secondary text-sm mb-4">Choose which alerts you want to receive</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Critical Alerts</p>
                  <p className="text-foreground-secondary text-sm">High priority safety incidents</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.critical}
                  onChange={(e) => setNotifications({...notifications, critical: e.target.checked})}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Warning Alerts</p>
                  <p className="text-foreground-secondary text-sm">Threshold violations detected</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.warning}
                  onChange={(e) => setNotifications({...notifications, warning: e.target.checked})}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Info Notifications</p>
                  <p className="text-foreground-secondary text-sm">General updates and status changes</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifications.info}
                  onChange={(e) => setNotifications({...notifications, info: e.target.checked})}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Safety Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Safety Alert Thresholds</h3>
              <p className="text-foreground-secondary text-sm mb-4">Adjust when alerts should trigger</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CO Thresholds */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-4">
                <h4 className="font-semibold text-foreground">CO Level (ppm)</h4>
                
                <div>
                  <label className="text-foreground-secondary text-sm">Warning</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="30"
                      value={thresholds.co_warning}
                      onChange={(e) => setThresholds({...thresholds, co_warning: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.co_warning}</span>
                  </div>
                </div>

                <div>
                  <label className="text-foreground-secondary text-sm">Critical</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="35" 
                      max="50"
                      value={thresholds.co_critical}
                      onChange={(e) => setThresholds({...thresholds, co_critical: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.co_critical}</span>
                  </div>
                </div>
              </div>

              {/* CH4 Thresholds */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-4">
                <h4 className="font-semibold text-foreground">CH4 Level (%)</h4>
                
                <div>
                  <label className="text-foreground-secondary text-sm">Warning</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="0.5" 
                      max="1.0"
                      step="0.1"
                      value={thresholds.ch4_warning}
                      onChange={(e) => setThresholds({...thresholds, ch4_warning: parseFloat(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.ch4_warning.toFixed(1)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-foreground-secondary text-sm">Critical</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="1.2" 
                      max="2.0"
                      step="0.1"
                      value={thresholds.ch4_critical}
                      onChange={(e) => setThresholds({...thresholds, ch4_critical: parseFloat(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.ch4_critical.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Temperature Thresholds */}
              <div className="p-4 bg-background rounded-lg border border-border/50 space-y-4">
                <h4 className="font-semibold text-foreground">Temperature (°C)</h4>
                
                <div>
                  <label className="text-foreground-secondary text-sm">Warning</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="25" 
                      max="35"
                      value={thresholds.temp_warning}
                      onChange={(e) => setThresholds({...thresholds, temp_warning: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.temp_warning}</span>
                  </div>
                </div>

                <div>
                  <label className="text-foreground-secondary text-sm">Critical</label>
                  <div className="flex items-center gap-3 mt-2">
                    <input 
                      type="range" 
                      min="36" 
                      max="45"
                      value={thresholds.temp_critical}
                      onChange={(e) => setThresholds({...thresholds, temp_critical: parseInt(e.target.value)})}
                      className="flex-1"
                    />
                    <span className="text-foreground font-bold min-w-fit">{thresholds.temp_critical}</span>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-primary mb-2">Guidelines</h4>
                <ul className="text-sm text-foreground-secondary space-y-1">
                  <li>• Critical alerts trigger emergency protocols</li>
                  <li>• Follow mining safety standards</li>
                  <li>• Adjust for local conditions</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Display Preferences</h3>
              <p className="text-foreground-secondary text-sm mb-4">Customize your viewing experience</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <p className="text-foreground font-medium">Dark Mode</p>
                  <p className="text-foreground-secondary text-sm">Required for mine operations</p>
                </div>
                <input type="checkbox" checked disabled className="w-5 h-5 cursor-not-allowed opacity-50" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <button className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-dark transition-colors font-semibold">
          Save Changes
        </button>
        <button className="flex-1 px-4 py-3 bg-background-secondary border border-border text-foreground rounded-lg hover:bg-background transition-colors font-semibold">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
