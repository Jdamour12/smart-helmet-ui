const docContent = {
  'system-overview': {
    title: 'System Overview',
    content: `
      <h2>How the Smart Helmet System Works</h2>
      
      <p>The SafeHelm system is a comprehensive IoT-based monitoring platform designed to keep miners safe by continuously tracking environmental conditions and worker status.</p>

      <h3>System Architecture</h3>
      
      <p>The system consists of three main components:</p>
      
      <ul>
        <li><strong>Smart Helmets:</strong> IoT devices equipped with multiple sensors (CO, CH4, temperature, humidity, accelerometer)</li>
        <li><strong>LoRa Gateways:</strong> Wireless access points that collect data from helmets in their coverage area</li>
        <li><strong>Centralized Dashboard:</strong> Web-based monitoring and control interface for supervisors</li>
      </ul>

      <h3>Data Flow</h3>
      
      <p>The system operates on a continuous cycle:</p>
      
      <ol>
        <li>Helmet sensors collect environmental and safety data every 10 seconds</li>
        <li>Data is transmitted via LoRa to the nearest gateway</li>
        <li>Gateways forward data to the centralized cloud system</li>
        <li>Dashboard processes data and triggers alerts when thresholds are exceeded</li>
        <li>Supervisors receive real-time notifications and can take immediate action</li>
      </ol>

      <h3>Safety Features</h3>
      
      <ul>
        <li><strong>Real-Time Monitoring:</strong> Live updates of all helmet data</li>
        <li><strong>Multi-Level Alerts:</strong> Critical, Warning, and Info alert levels</li>
        <li><strong>Fall Detection:</strong> Automatic detection of impacts and falls</li>
        <li><strong>Compliance Tracking:</strong> Monitoring of helmet wear compliance</li>
        <li><strong>Battery Monitoring:</strong> Alerts when battery levels are low</li>
        <li><strong>Signal Strength Tracking:</strong> Ensures connectivity in coverage areas</li>
      </ul>

      <h3>Gateway Coverage</h3>
      
      <p>Each LoRa gateway covers approximately 500-1000 meters in open terrain. Multiple gateways should be deployed to ensure complete coverage of mining operations. The dashboard shows the status of all connected gateways.</p>
    `,
  },
  metrics: {
    title: 'Metric Definitions',
    content: `
      <h2>Understanding Each Monitoring Metric</h2>
      
      <p>The dashboard monitors multiple environmental and safety metrics to ensure comprehensive worker protection.</p>

      <h3>Carbon Monoxide (CO)</h3>
      
      <ul>
        <li><strong>Unit:</strong> ppm (parts per million)</li>
        <li><strong>Source:</strong> Equipment exhaust, vehicle emissions, incomplete combustion</li>
        <li><strong>Safe Level:</strong> Below 35 ppm</li>
        <li><strong>Warning Level:</strong> 35-200 ppm - increased monitoring required</li>
        <li><strong>Critical Level:</strong> Above 200 ppm - immediate evacuation needed</li>
      </ul>

      <p>CO is a colorless, odorless gas that can cause poisoning. Regular monitoring is critical in mining operations.</p>

      <h3>Methane (CH4)</h3>
      
      <ul>
        <li><strong>Unit:</strong> % (percentage)</li>
        <li><strong>Source:</strong> Natural gas accumulation in mine shafts</li>
        <li><strong>Safe Level:</strong> Below 0.5%</li>
        <li><strong>Warning Level:</strong> 0.5-1.25% - ventilation adjustment recommended</li>
        <li><strong>Critical Level:</strong> Above 1.25% - potential explosion hazard</li>
      </ul>

      <p>Methane is a flammable gas and can accumulate in mining areas. Early detection prevents explosions.</p>

      <h3>Temperature</h3>
      
      <ul>
        <li><strong>Unit:</strong> °C (Celsius)</li>
        <li><strong>Safe Range:</strong> 15-30°C</li>
        <li><strong>Warning Level:</strong> 30-35°C - increased heat stress risk</li>
        <li><strong>Critical Level:</strong> Above 35°C - heat exhaustion danger</li>
      </ul>

      <p>Elevated temperatures in mining areas can lead to heat exhaustion and reduced cognitive function.</p>

      <h3>Humidity</h3>
      
      <ul>
        <li><strong>Unit:</strong> % (relative humidity)</li>
        <li><strong>Safe Range:</strong> 30-70%</li>
        <li><strong>Warning Level:</strong> 70-85% - uncomfortable, increased heat stress</li>
        <li><strong>Critical Level:</strong> Above 85% - severe heat stress risk</li>
      </ul>

      <p>Combined with temperature, humidity affects worker comfort and safety. High humidity reduces body cooling efficiency.</p>

      <h3>Helmet Wear Status</h3>
      
      <ul>
        <li><strong>Values:</strong> Worn / Not Worn</li>
        <li><strong>Critical:</strong> Helmets must be worn at all times in work areas</li>
        <li><strong>Alert:</strong> Warning issued if helmet is removed during shift</li>
      </ul>

      <h3>Impact/Fall Detection</h3>
      
      <ul>
        <li><strong>Detection Method:</strong> Accelerometer-based impact threshold</li>
        <li><strong>Response:</strong> Critical alert immediately generated</li>
        <li><strong>Action Required:</strong> Immediate check on worker status</li>
      </ul>

      <h3>Signal Strength</h3>
      
      <ul>
        <li><strong>Unit:</strong> dBm (decibel-milliwatts)</li>
        <li><strong>Excellent:</strong> -70 dBm to -55 dBm</li>
        <li><strong>Good:</strong> -80 dBm to -70 dBm</li>
        <li><strong>Fair:</strong> -90 dBm to -80 dBm</li>
        <li><strong>Poor:</strong> Below -90 dBm</li>
      </ul>

      <p>Signal strength indicates the quality of connection between helmet and gateway. Poor signal may indicate coverage issues.</p>

      <h3>Battery Level</h3>
      
      <ul>
        <li><strong>Unit:</strong> % (percentage)</li>
        <li><strong>Normal:</strong> 50-100%</li>
        <li><strong>Warning:</strong> 20-50% - plan for charging</li>
        <li><strong>Critical:</strong> Below 20% - charge immediately</li>
      </ul>

      <p>Ensure helmets are fully charged at the start of each shift to maintain continuous monitoring.</p>
    `,
  },
  alerts: {
    title: 'Alert Levels',
    content: `
      <h2>Understanding Alert Severity Levels</h2>
      
      <p>SafeHelm uses three alert severity levels to help you prioritize responses to safety issues.</p>

      <h3>Critical Alerts</h3>
      
      <p><strong>Color:</strong> Red | <strong>Symbol:</strong> ⚠️</p>
      
      <p>Critical alerts indicate an immediate threat to worker safety requiring instantaneous response.</p>
      
      <ul>
        <li>CO level above critical threshold (evacuation required)</li>
        <li>CH4 level above explosion hazard threshold</li>
        <li>Fall or impact detected</li>
        <li>Signal lost with worker in hazardous area</li>
        <li>Critical temperature conditions</li>
      </ul>

      <p><strong>Required Action:</strong> Immediately check on affected worker and initiate evacuation procedures if necessary.</p>

      <h3>Warning Alerts</h3>
      
      <p><strong>Color:</strong> Yellow | <strong>Symbol:</strong> ⚠️</p>
      
      <p>Warning alerts indicate a developing issue that requires attention to prevent escalation to critical status.</p>
      
      <ul>
        <li>CO level in warning range</li>
        <li>CH4 level elevated</li>
        <li>Temperature approaching dangerous levels</li>
        <li>Humidity at uncomfortable levels</li>
        <li>Helmet not being worn</li>
        <li>Signal strength degraded</li>
        <li>Battery level low</li>
      </ul>

      <p><strong>Required Action:</strong> Increase monitoring frequency, adjust work environment, or reposition workers as needed.</p>

      <h3>Info Alerts</h3>
      
      <p><strong>Color:</strong> Blue | <strong>Symbol:</strong> ℹ️</p>
      
      <p>Info alerts are notifications for status changes and routine updates that don't indicate immediate danger.</p>
      
      <ul>
        <li>Worker logged in/out</li>
        <li>Helmet battery at specific levels</li>
        <li>Gateway connectivity status</li>
        <li>Routine system updates</li>
      </ul>

      <p><strong>Required Action:</strong> Monitor and log for compliance records; no immediate action needed.</p>

      <h3>Alert Management</h3>
      
      <p>You can customize alert sensitivity and thresholds in the Settings page to match your specific operational requirements.</p>
    `,
  },
  emergency: {
    title: 'Emergency Procedures',
    content: `
      <h2>Emergency Response Procedures</h2>
      
      <p>Follow these procedures when critical alerts are triggered in the SafeHelm system.</p>

      <h3>Critical Gas Alert (CO)</h3>
      
      <ol>
        <li>Immediately notify the affected worker to evacuate the area</li>
        <li>Use the dashboard to locate other nearby workers who may be affected</li>
        <li>Initiate evacuation procedures for the entire affected zone</li>
        <li>Check gateway connectivity to ensure continuous monitoring during evacuation</li>
        <li>Document the incident with timestamp and readings</li>
        <li>Investigate the source of gas after all workers are safe</li>
        <li>Resume operations only after gas levels normalize and area is cleared</li>
      </ol>

      <h3>Methane Alert</h3>
      
      <ol>
        <li>Alert all workers in affected zone immediately</li>
        <li>Increase ventilation if possible</li>
        <li>Move workers upwind if outdoors or to well-ventilated areas</li>
        <li>Prepare for evacuation if levels continue to rise</li>
        <li>Do not allow open flames or smoking in affected area</li>
        <li>Verify air quality before resuming work</li>
      </ol>

      <h3>Fall or Impact Detected</h3>
      
      <ol>
        <li>Immediately locate the affected worker using gateway information</li>
        <li>Assess the worker's condition and responsiveness</li>
        <li>Call emergency medical services if injury is suspected</li>
        <li>Do not move the worker if spinal injury is possible</li>
        <li>Provide first aid according to your facility's protocols</li>
        <li>Clear the area and establish a safety perimeter</li>
        <li>Document the incident thoroughly</li>
      </ol>

      <h3>Signal Loss</h3>
      
      <ol>
        <li>Attempt to contact the affected worker via radio or phone</li>
        <li>Check if they have moved to an area with poor coverage</li>
        <li>Review last known location from gateway information</li>
        <li>Send a team member to locate the worker if necessary</li>
        <li>If worker cannot be contacted, initiate search and rescue procedures</li>
        <li>Verify helmet battery was not depleted</li>
      </ol>

      <h3>Heat Stress Alert</h3>
      
      <ol>
        <li>Notify the affected worker to move to a cooler area immediately</li>
        <li>Provide water and electrolyte replacement</li>
        <li>Monitor worker's condition closely</li>
        <li>Consider rotating workers to cooler areas if conditions persist</li>
        <li>Adjust work schedules or ventilation if possible</li>
        <li>Escalate to medical evaluation if symptoms worsen</li>
      </ol>

      <h3>General Emergency Protocols</h3>
      
      <ul>
        <li>All supervisors should be trained in emergency response procedures</li>
        <li>Emergency contact numbers should be posted and accessible</li>
        <li>Regular safety drills should be conducted</li>
        <li>After any critical incident, conduct a thorough post-incident review</li>
        <li>Use the alert history to identify patterns and prevent future incidents</li>
      </ul>

      <h3>Communication</h3>
      
      <p>During emergencies, communication is critical. Ensure that:</p>
      
      <ul>
        <li>Radio/phone systems are functioning</li>
        <li>All team members know emergency procedures</li>
        <li>External emergency services are notified when appropriate</li>
        <li>Dashboard alerts reach designated personnel</li>
      </ul>
    `,
  },
  guide: {
    title: 'User Guide',
    content: `
      <h2>How to Use the SafeHelm Dashboard</h2>
      
      <p>This guide will help you navigate and use all features of the SafeHelm monitoring dashboard.</p>

      <h3>Logging In and Navigation</h3>
      
      <p>When you access the SafeHelm system, you'll be presented with a modern interface with the following main sections:</p>
      
      <ul>
        <li><strong>Sidebar Navigation:</strong> Quick access to Dashboard, Documentation, and Settings</li>
        <li><strong>Top Header:</strong> System status, current time, and user menu</li>
        <li><strong>Main Content Area:</strong> Dashboard data and monitoring interfaces</li>
      </ul>

      <h3>Dashboard Overview</h3>
      
      <p>The main dashboard provides at-a-glance information about your mining operations:</p>
      
      <ul>
        <li><strong>Status Cards:</strong> Shows active helmets, gateway status, warnings, and critical alerts</li>
        <li><strong>Alert Feed:</strong> Real-time list of recent alerts with severity indicators</li>
        <li><strong>Analytics Charts:</strong> Visual representation of metrics and trends</li>
        <li><strong>Worker Cards:</strong> Individual monitoring cards for each active worker</li>
      </ul>

      <h3>Reading Worker Cards</h3>
      
      <p>Each worker card displays comprehensive safety information:</p>
      
      <ul>
        <li><strong>Worker Name and ID:</strong> Identifies the worker</li>
        <li><strong>Helmet Status:</strong> Shows if helmet is currently worn</li>
        <li><strong>Impact Status:</strong> Indicates if fall/impact has been detected</li>
        <li><strong>Gas Levels:</strong> Real-time CO and CH4 measurements with visual progress bars</li>
        <li><strong>Environmental Data:</strong> Current temperature and humidity</li>
        <li><strong>Connectivity:</strong> Signal strength and gateway proximity</li>
        <li><strong>Battery Status:</strong> Current battery percentage</li>
        <li><strong>Active Alerts:</strong> Any critical or warning alerts for this worker</li>
      </ul>

      <h3>Interpreting Status Colors</h3>
      
      <ul>
        <li><strong>Green:</strong> Normal, safe conditions</li>
        <li><strong>Yellow:</strong> Warning - requires monitoring</li>
        <li><strong>Red:</strong> Critical - immediate action required</li>
        <li><strong>Blue:</strong> Information or normal status</li>
      </ul>

      <h3>Responding to Alerts</h3>
      
      <p>When an alert appears:</p>
      
      <ol>
        <li>Note the alert severity and worker name</li>
        <li>Read the alert message to understand the issue</li>
        <li>If critical, immediately take action (evacuation, medical response, etc.)</li>
        <li>For warnings, increase monitoring and prepare for potential escalation</li>
        <li>Use the worker's location from gateway information to reach them if needed</li>
      </ol>

      <h3>Customizing Settings</h3>
      
      <p>Visit the Settings page to customize:</p>
      
      <ul>
        <li>Alert thresholds for each metric</li>
        <li>Alert notification preferences (sound, email, SMS)</li>
        <li>Dashboard display preferences</li>
        <li>User account settings</li>
      </ul>

      <h3>Using the Alert Feed</h3>
      
      <p>The alert feed shows a chronological list of recent alerts:</p>
      
      <ul>
        <li>Click on an alert to see more details</li>
        <li>Most recent alerts appear at the top</li>
        <li>Color coding indicates alert severity</li>
        <li>Timestamps show when each alert was triggered</li>
        <li>Unread count helps you track new alerts</li>
      </ul>

      <h3>Monitoring Analytics</h3>
      
      <p>The dashboard includes several analytics displays:</p>
      
      <ul>
        <li><strong>Helmet Wear Compliance:</strong> Shows percentage of workers wearing helmets</li>
        <li><strong>Average Readings:</strong> Displays average CO, CH4, temperature, and humidity</li>
        <li><strong>Trend Charts:</strong> Visual representation of metric changes over time</li>
      </ul>

      <h3>Best Practices</h3>
      
      <ul>
        <li>Check the dashboard frequently during shifts</li>
        <li>Respond promptly to critical alerts</li>
        <li>Review alert history for patterns</li>
        <li>Keep thresholds calibrated to your environment</li>
        <li>Ensure all workers are trained on the safety system</li>
        <li>Conduct regular safety drills using dashboard information</li>
        <li>Document all incidents and responses</li>
      </ul>
    `,
  },
};

type DocSlugType = keyof typeof docContent;

export default function DocPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug as DocSlugType;
  const doc = docContent[slug];

  if (!doc) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <p className="text-slate-600">
          The documentation page you are looking for does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="py-12">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">{doc.title}</h1>
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.content }}
      />
    </div>
  );
}
