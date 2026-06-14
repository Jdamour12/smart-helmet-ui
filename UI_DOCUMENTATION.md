# SafeHelm — UI Documentation for AI Agents

Complete reference for the frontend of the **SafeHelm Mining Safety Helmet Monitoring System**. This document covers every structural pattern, design decision, and convention an AI agent needs to build new screens, components, or features that are consistent with the existing UI.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Two Portals Architecture](#4-two-portals-architecture)
5. [Routing & Layouts](#5-routing--layouts)
6. [Design System](#6-design-system)
7. [Component Patterns](#7-component-patterns)
8. [Page-by-Page Reference](#8-page-by-page-reference)
9. [Data Layer](#9-data-layer)
10. [Authentication](#10-authentication)
11. [Real-time Features](#11-real-time-features)
12. [Conventions & Rules](#12-conventions--rules)

---

## 1. Project Overview

SafeHelm is a dual-portal web application for monitoring smart safety helmets worn by mining workers. It provides real-time sensor data (gas levels, temperature, humidity, impact detection) and a management interface for administrators.

**Two user roles:**
- **Supervisor** — field supervisor who monitors workers and their helmet data
- **Admin** — administrator who manages supervisors, workers, gateways, and departments

---

## 2. Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2.7 | Framework (App Router) |
| React | 19.2.7 | UI library |
| TypeScript | 6.0.3 | Type safety |
| Tailwind CSS | 4.3.0 | Styling |
| TanStack Query | 5.101.0 | Server state & caching |
| Lucide React | ^1.17.0 | Icons |
| Recharts | 3.8.1 | Charts |
| React Hook Form | 7.77.0 | Forms (available but not used in most drawers — manual state preferred) |
| Zod | 4.4.3 | Schema validation |
| Radix UI | Various | Accessible UI primitives |
| next-themes | 0.4.6 | Theme support |
| Geist | — | Primary font family |

---

## 3. Repository Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── admin/                  # Admin portal
│   │   ├── analytics/page.tsx
│   │   ├── departments/page.tsx
│   │   ├── gateways/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── reports/page.tsx
│   │   ├── supervisors/page.tsx
│   │   ├── workers/page.tsx
│   │   ├── layout.tsx          # Admin layout (auth guard + sidebar)
│   │   └── page.tsx            # Admin dashboard home
│   ├── dashboard/              # Supervisor portal
│   │   ├── compliance/page.tsx
│   │   ├── environment/page.tsx
│   │   ├── gas-analytics/page.tsx
│   │   ├── helmets/page.tsx
│   │   ├── impacts/page.tsx
│   │   ├── network/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── layout.tsx          # Dashboard layout (auth guard + sidebar)
│   │   └── page.tsx            # Supervisor dashboard home
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/
│   │   ├── page.tsx                      # Reset password route (token from email link)
│   │   └── reset-password-form.tsx       # Form component (min 8-char password)
│   ├── globals.css             # Global styles + CSS variables
│   ├── layout.tsx              # Root layout (fonts + QueryProvider)
│   └── page.tsx                # Landing page
├── components/
│   ├── admin-header.tsx        # Header for admin portal
│   ├── admin-sidebar.tsx       # Sidebar for admin portal
│   ├── alert-feed.tsx          # Scrollable alert list
│   ├── auth-frame.tsx          # Login form container
│   ├── charts.tsx              # Recharts wrapper helpers
│   ├── header.tsx              # Header for supervisor portal
│   ├── helmet-card.tsx         # Helmet status card
│   ├── metric-card.tsx         # Reusable stat card
│   ├── overview-stats.tsx      # Dashboard statistics panel
│   ├── sidebar.tsx             # Sidebar for supervisor portal
│   ├── status-indicator.tsx    # Status badge component
│   ├── theme-provider.tsx      # next-themes wrapper
│   └── ui/                     # 62 shadcn/Radix UI components
├── hooks/                      # TanStack Query hooks
├── lib/                        # API clients and types
│   ├── alerts/index.ts
│   ├── analytics/index.ts
│   ├── auth/index.ts
│   ├── departments/index.ts
│   ├── gateways/index.ts
│   ├── helmets/index.ts
│   ├── notifications/index.ts
│   ├── reports/index.ts
│   ├── supervisors/index.ts
│   ├── system/index.ts
│   ├── workers/index.ts
│   ├── ws/index.ts
│   ├── constants.ts
│   ├── http.ts
│   ├── mock-data.ts
│   ├── types.ts
│   └── utils.ts
└── providers/
    └── query-provider.tsx
```

---

## 4. Two Portals Architecture

### Supervisor Portal (`/dashboard/*`)

For field supervisors who monitor workers and helmets in real time.

**Navigation items (sidebar):**
```
Dashboard           → /dashboard
Real-time Monitoring → /dashboard/helmets
Gas Analytics       → /dashboard/gas-analytics
Environment         → /dashboard/environment
Impact Detection    → /dashboard/impacts
Compliance          → /dashboard/compliance
Network Status      → /dashboard/network
```

**Layout file:** `src/app/dashboard/layout.tsx`
Uses `Header` + `Sidebar` components.

---

### Admin Portal (`/admin/*`)

For administrators who manage the system and its users.

**Navigation items (sidebar):**
```
Dashboard           → /admin
Manage Supervisors  → /admin/supervisors
Workers             → /admin/workers
Departments         → /admin/departments
System Analytics    → /admin/analytics
Manage Gateways     → /admin/gateways
Reports & Audit Logs→ /admin/reports
```

**Layout file:** `src/app/admin/layout.tsx`
Uses `AdminHeader` + `AdminSidebar` components.

---

## 5. Routing & Layouts

### Root Layout (`src/app/layout.tsx`)
- Loads Geist sans + Geist Mono fonts
- Wraps everything in `QueryProvider`
- Includes Vercel Analytics in production
- Sets `scroll-smooth` and default `bg-background` on `<html>`

### Portal Layouts (both `dashboard/layout.tsx` and `admin/layout.tsx`)
Each portal layout implements:

1. **Auth guard** — redirects to `/login` if no token in localStorage
2. **Idle timeout** — 30-minute inactivity auto-logout with a 60-second countdown warning
3. **Back-button protection** — prevents navigating back to protected pages after logout
4. **Cross-tab sync** — listens for storage events to log out when another tab logs out
5. **Mobile sidebar toggle** — responsive sidebar that slides in on mobile, is fixed on desktop

---

## 6. Design System

### CSS Variables (defined in `src/app/globals.css`)

All colors are CSS custom properties mapped to Tailwind via `@theme inline`:

```css
/* Light mode defaults */
--background:           #f8fafc      /* Page background */
--background-secondary: #ffffff      /* Card / section background */
--background-tertiary:  #f1f5f9      /* Input background, hover states */
--foreground:           #0f172a      /* Primary text */
--foreground-secondary: #475569      /* Secondary / label text */
--foreground-tertiary:  #64748b      /* Hint / placeholder text */

/* Semantic colors */
--primary:     #0284c7   /* Sky Blue — actions, focus rings, active nav */
--primary-dark:#0369a1   /* Hover state for primary */
--critical:    #dc2626   /* Red — errors, critical alerts, danger */
--warning:     #d97706   /* Amber — warning alerts, degraded states */
--success:     #059669   /* Green — OK states, active, compliance pass */
--info:        #0284c7   /* Same as primary — informational */
--accent:      #ea580c   /* Orange — highlights and CTAs */

/* Structure */
--border:      #e2e8f0   /* Border color throughout */
--sidebar:     #ffffff   /* Sidebar background */
--sidebar-border: #cbd5e1
--sidebar-accent: #f1f5f9   /* Sidebar hover */
--radius:      0.5rem    /* 8px — border-radius default */
```

### Tailwind Usage

Use these semantic tokens as Tailwind classes:
- `bg-background`, `bg-background-secondary`, `bg-background-tertiary`
- `text-foreground`, `text-foreground-secondary`, `text-foreground-tertiary`
- `text-primary`, `text-critical`, `text-warning`, `text-success`, `text-info`
- `bg-primary/10`, `bg-critical/10`, `bg-warning/10`, `bg-success/10`, `bg-info/10`
- `border-border`, `ring-primary/30`

### Typography

| Use | Class |
|---|---|
| Page title | `text-3xl font-bold text-foreground` |
| Page subtitle | `text-foreground-secondary mt-1` |
| Section heading | `text-lg font-semibold text-foreground` |
| Card label | `text-sm font-medium text-foreground-secondary` |
| Card value | `text-3xl font-bold text-foreground` |
| Table header cell | `text-sm font-semibold text-foreground-secondary` |
| Table body cell | `text-sm text-foreground` |
| Small hint | `text-xs text-foreground-tertiary` |
| Drawer title | `text-base font-semibold text-foreground` |
| Drawer subtitle | `text-xs text-foreground-tertiary mt-0.5` |

### Icons

All icons come from **lucide-react**. Common icons by domain:

| Domain | Icons |
|---|---|
| Supervisors | `Users`, `UserCheck`, `Shield` |
| Workers | `HardHat`, `UserCheck` |
| Departments | `Building2`, `MapPin` |
| Gateways | `Wifi`, `WifiOff`, `RadioTower`, `Server` |
| Helmets | `Radio`, `HardHat` |
| Alerts | `AlertTriangle`, `AlertCircle`, `Bell` |
| Analytics | `TrendingUp`, `BarChart3`, `Activity` |
| Gas | `Zap`, `AlertTriangle`, `Wind` |
| Environment | `Thermometer`, `Droplets`, `Gauge` |
| Safety / Compliance | `ShieldCheck`, `ShieldAlert` |
| Reports | `FileText`, `Download` |
| Actions | `Plus`, `Eye`, `Edit2`, `Trash2`, `X`, `ChevronRight` |
| Status | `Clock`, `Calendar`, `CheckCircle` |

### Breakpoints

| Name | Width | Behavior |
|---|---|---|
| Mobile | < 768px | Sidebar hidden, hamburger menu |
| Tablet | 768–1023px | Sidebar slides in as overlay |
| Desktop | ≥ 1024px | Sidebar fixed, always visible |

---

## 7. Component Patterns

This section documents the exact patterns used throughout the app. **New pages must follow these patterns exactly** to maintain visual consistency.

---

### 7.1 Stats Cards (4-column grid)

Every management page starts with four stat cards in a responsive grid.

**Structure:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="bg-background-secondary border border-border rounded-lg p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-foreground-secondary text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-{color} mt-2">{value}</p>
        <p className="text-xs text-foreground-tertiary mt-2">{subtitle}</p>
      </div>
      <div className="bg-{color}/10 p-3 rounded-lg">
        <Icon className="w-6 h-6 text-{color}" />
      </div>
    </div>
  </div>
</div>
```

**Color conventions per card type:**
- Total count / neutral → `text-foreground` + `bg-primary/10` + `text-primary` icon
- Critical / error → `text-critical` + `bg-critical/10` + `text-critical` icon
- Warning / degraded → `text-warning` + `bg-warning/10` + `text-warning` icon
- Success / good → `text-success` + `bg-success/10` + `text-success` icon
- Info / metric → `text-foreground` + `bg-info/10` + `text-info` icon

---

### 7.2 Data Tables

All tables live inside a card container. The table renders only when data is available.

**Container:**
```tsx
<div className="bg-background-secondary border border-border rounded-lg p-6">
  <h3 className="text-lg font-semibold text-foreground mb-4">{Section Title}</h3>
  {/* Three-state rendering below */}
</div>
```

**Three-state table rendering (mandatory pattern):**
```tsx
{isLoading ? (
  <p className="text-foreground-secondary text-sm">Loading {items}...</p>
) : list.length === 0 ? (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 bg-{color}/10 rounded-2xl flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-{color}" />
    </div>
    <p className="text-foreground-secondary font-medium">No {items} yet</p>
    <p className="text-foreground-tertiary text-sm mt-1">{helpful hint}</p>
  </div>
) : (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          {['Col1', 'Col2', 'Status', 'Actions'].map(h => (
            <th key={h} className="text-left py-3 px-4 text-foreground-secondary text-sm font-semibold">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {list.map(item => (
          <tr key={item.id} className="border-b border-border/50 hover:bg-background transition-colors">
            <td className="py-3 px-4 text-foreground font-medium">{item.name}</td>
            <td className="py-3 px-4 text-foreground-secondary text-sm">{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
```

**Rows:** `border-b border-border/50 hover:bg-background transition-colors`
**First column (name):** `text-foreground font-medium`
**Other data columns:** `text-foreground-secondary text-sm`

---

### 7.3 Status Badges

Status pills shown inline in table rows:

```tsx
<span className={`text-xs px-3 py-1 rounded-full font-medium ${
  item.status === 'active'
    ? 'bg-success/10 text-success'
    : item.status === 'inactive'
    ? 'bg-warning/10 text-warning'
    : 'bg-critical/10 text-critical'
}`}>
  {(item.status ?? 'inactive').charAt(0).toUpperCase() + (item.status ?? 'inactive').slice(1)}
</span>
```

Common status → color mapping:
- `'active'` / `'online'` / `'safe'` → `success`
- `'inactive'` / `'warning'` → `warning`
- `'alarm'` / `'offline'` / `'critical'` → `critical`

---

### 7.4 Action Buttons in Table Rows

```tsx
<td className="py-3 px-4">
  <div className="flex items-center gap-2">
    <button onClick={() => setView(item)} className="p-2 hover:bg-background rounded transition-colors" title="View">
      <Eye className="w-4 h-4 text-info" />
    </button>
    <button onClick={() => setEdit(item)} className="p-2 hover:bg-background rounded transition-colors" title="Edit">
      <Edit2 className="w-4 h-4 text-primary" />
    </button>
    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-background rounded transition-colors" title="Delete">
      <Trash2 className="w-4 h-4 text-critical" />
    </button>
  </div>
</td>
```

Icon color conventions:
- View (Eye) → `text-info`
- Edit (Edit2) → `text-primary`
- Delete (Trash2) → `text-critical`

---

### 7.5 Drawer Pattern (Slide-in Panel)

Drawers are full-height panels that slide in from the right. They always include an `Overlay` backdrop.

**Overlay component (defined per-page):**
```tsx
function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed inset-0 top-[69px] bg-black/20 z-40 backdrop-blur-[1px]"
      onClick={onClick}
    />
  );
}
```

**Drawer shell:**
```tsx
<>
  <Overlay onClick={onClose} />
  <div className="fixed top-[69px] right-4 bottom-4 w-[420px] z-50 flex flex-col
    bg-background-secondary border border-border rounded-2xl shadow-2xl
    animate-in slide-in-from-right duration-300 ease-out">

    {/* Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
      <div>
        <h2 className="text-base font-semibold text-foreground">{Title}</h2>
        <p className="text-xs text-foreground-tertiary mt-0.5">{subtitle}</p>
      </div>
      <button onClick={onClose} className="p-1.5 hover:bg-background-tertiary rounded-lg transition-colors">
        <X className="w-4 h-4 text-foreground-secondary" />
      </button>
    </div>

    {/* Scrollable body */}
    <div className="flex-1 overflow-y-auto px-6 py-5">
      {/* content */}
    </div>

    {/* Footer (for forms) */}
    <div className="px-6 py-4 border-t border-border flex items-center gap-3 flex-shrink-0">
      <button type="button" onClick={onClose}
        className="flex-1 px-4 py-2.5 text-sm font-medium text-foreground-secondary
          border border-border rounded-lg hover:bg-background-tertiary transition-colors">
        Cancel
      </button>
      <button type="submit" form="form-id" disabled={isPending}
        className="flex-1 px-4 py-2.5 text-sm font-medium text-primary-foreground
          bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60">
        {isPending ? 'Saving...' : 'Save'}
      </button>
    </div>
  </div>
</>
```

**Key drawer dimensions:**
- Width: `w-[420px]`
- Top offset: `top-[69px]` (height of the header bar)
- Z-index: overlay = `z-40`, drawer = `z-50`
- Animation: `animate-in slide-in-from-right duration-300 ease-out`

**Three drawer types per resource:**
1. `AddXDrawer` — create new item, form with `useCreate*` mutation
2. `ViewXDrawer` — read-only display of item details
3. `EditXDrawer` — update existing item; **hooks must be called before any early return**

**EditXDrawer hook safety rule (React Rules of Hooks):**
```tsx
function EditXDrawer({ item }: { item: Item | null }) {
  // ALL hooks MUST be before any conditional return
  const [form, setForm] = useState({ name: '' });
  const { mutate, isPending } = useUpdateX();

  useEffect(() => {
    if (item) {
      setForm({ name: item.name ?? '' });
    }
  }, [item?.id]); // sync form when item changes

  if (!item) return null; // guard AFTER all hooks
  // ...
}
```

---

### 7.6 Form Fields inside Drawers

**Text input:**
```tsx
<div className="space-y-1.5">
  <label className="text-sm font-medium text-foreground">
    Field Label <span className="text-critical">*</span>
  </label>
  <input
    type="text"
    placeholder="Placeholder text"
    value={form.field}
    onChange={e => setForm(f => ({ ...f, field: e.target.value }))}
    className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
      text-foreground placeholder:text-foreground-tertiary
      focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
  />
</div>
```

**Textarea:**
```tsx
<textarea
  rows={3}
  placeholder="Description..."
  className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
    text-foreground placeholder:text-foreground-tertiary resize-none
    focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
/>
```

**Select / Dropdown:**
```tsx
<select
  value={form.field}
  onChange={e => setForm(f => ({ ...f, field: e.target.value }))}
  className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg
    text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
  <option value="">Select an option</option>
  {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
</select>
```

**Read-only field (in View drawers):**
```tsx
<div className="space-y-1.5">
  <label className="text-xs font-medium text-foreground-tertiary uppercase tracking-wide">Field Label</label>
  <p className="text-sm text-foreground">{value}</p>
</div>
```

**Info callout box (inside drawer):**
```tsx
<div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
      <Icon className="w-4 h-4 text-primary" />
    </div>
    <div>
      <p className="text-sm font-medium text-foreground">Info title</p>
      <p className="text-xs text-foreground-secondary mt-1">Info body text.</p>
    </div>
  </div>
</div>
```

---

### 7.7 Page-level Header with "Add" Button

```tsx
<div className="flex items-center justify-between">
  <div>
    <h2 className="text-3xl font-bold text-foreground">{Page Title}</h2>
    <p className="text-foreground-secondary mt-1">{Page subtitle}</p>
  </div>
  <button
    onClick={() => setAddOpen(true)}
    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium
      hover:bg-primary-dark transition-colors flex items-center gap-2">
    <Plus className="w-5 h-5" />
    Add {Item}
  </button>
</div>
```

---

### 7.8 Empty State Pattern

Used in every table section when data is empty. Choose an icon and color matching the domain:

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-16 h-16 bg-{color}/10 rounded-2xl flex items-center justify-center mb-4">
    <Icon className="w-8 h-8 text-{color}" />
  </div>
  <p className="text-foreground-secondary font-medium">No {items} yet</p>
  <p className="text-foreground-tertiary text-sm mt-1">{Helpful hint about how to add data}</p>
</div>
```

Compact variant (for smaller panels):
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-14 h-14 bg-{color}/10 rounded-2xl flex items-center justify-center mb-3">
    <Icon className="w-7 h-7 text-{color}" />
  </div>
  <p className="text-foreground-secondary text-sm font-medium">No data</p>
  <p className="text-foreground-tertiary text-sm mt-1">{Hint}</p>
</div>
```

---

### 7.9 Charts

Charts use **Recharts** with a consistent look:

```tsx
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Always wrap in ResponsiveContainer
<ResponsiveContainer width="100%" height={200}>
  <LineChart data={data}>
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

Chart colors map to CSS variables: `var(--primary)`, `var(--critical)`, `var(--warning)`, `var(--success)`.

---

### 7.10 Delete Confirmation

Delete uses browser `confirm()` dialog — no custom modal:

```tsx
const handleDelete = (id: string) => {
  if (!confirm('Are you sure you want to delete this item?')) return;
  deleteItem(id);
};
```

For items with cascading effects, use a descriptive message:
```tsx
if (!confirm('Delete this department? Workers will be unassigned.')) return;
```

---

### 7.11 Navigation / Active State

Both sidebars use the same active highlighting pattern:

```tsx
const isActive = pathname === item.href;
className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
  isActive
    ? 'bg-primary/10 text-primary font-medium'
    : 'text-foreground-secondary hover:bg-sidebar-accent hover:text-sidebar-foreground'
}`}
```

---

## 8. Page-by-Page Reference

### 8.1 Landing Page (`/`)

Simple marketing page with:
- Hero section with app name and description
- 4 feature cards (Real-time Monitoring, Instant Alerts, Advanced Analytics, User Management)
- CTA buttons to `/login` and `/dashboard`

---

### 8.2 Login (`/login`)

Split layout:
- **Left panel**: Background gradient, mining safety branding/hero
- **Right panel**: Login form

Form fields:
- Role toggle: Supervisor | Admin (stored in state, sent as role query param)
- Email input
- Password input (with show/hide toggle)
- Remember me checkbox
- Submit button with loading state

On success: redirects to `/dashboard` (supervisor) or `/admin` (admin).

---

### 8.3 Supervisor Dashboard Home (`/dashboard`)

Stats row (4 cards):
1. Total Helmets — `primary`
2. Critical Alerts — `critical`
3. Avg CO Level (ppm) — `foreground`
4. Compliance Rate (%) — `success`

Charts row (2 columns):
- **Alert Trends** — LineChart, last 24h data
- **Gas Distribution** — BarChart, CO + CH4 safe/warning/critical counts

Recent Alerts feed below charts.

Network health status block (gateways online / offline).

**Hooks used:** `useAnalyticsSummary`, `useGasLevels`, `useCompliance`, `useAlertsByLevel`, `useAlertTrends(1)`, `useAlertFeed`, `useNetworkHealth`

---

### 8.4 Helmets / Real-time Monitoring (`/dashboard/helmets`)

Stats row (4 cards): Total Helmets, Active, Critical Alerts, Avg Battery

Actions: Add Worker button (opens `AddWorkerDrawer`)

Table columns: Worker, Status, CO / CH4, Temp / Humidity, Helmet Wear, Battery, Actions (View, Edit, Delete)

Drawers: `AddWorkerDrawer`, `ViewWorkerDrawer`, `EditWorkerDrawer`

**Hooks used:** `useHelmetsWithReadings`, `useWorkers`, `useGateways`, `useDepartments`, `useCreateHelmet`, `useUpdateHelmet`, `useDeleteHelmet`

---

### 8.5 Gas Analytics (`/dashboard/gas-analytics`)

Stats row (4 cards): Avg CO, Avg CH4, CO Critical Count, CH4 Critical Count

Charts: BarChart for CO distribution, BarChart for CH4 distribution

Table: Gas Levels by Helmet — Worker, CO Level, CH4 Level, Status badge

**Hooks used:** `useGasLevels`, `useHelmetsWithReadings`

---

### 8.6 Environment (`/dashboard/environment`)

Stats row (4 cards): Avg Temp, Max Temp, Avg Humidity, Max Humidity

Charts: Temperature trend, Humidity trend

Table: Environmental Data by Worker — Worker, Temperature, Humidity, Status badge

**Hooks used:** `useEnvironment`, `useHelmetsWithReadings`

---

### 8.7 Impact Detection (`/dashboard/impacts`)

Stats row (4 cards): Total Impacts (week), Safe Helmets, High Severity, Current Active

Chart: Weekly impact trend (BarChart)

**Hooks used:** `useImpacts`, `useImpactsWeeklyTrend`

---

### 8.8 Compliance (`/dashboard/compliance`)

Stats row: Compliance Rate %, Non-compliant Count, Target (95%), Gap to Target

Chart: Weekly compliance trend (LineChart)

List of non-compliant helmets.

**Hooks used:** `useCompliance`, `useComplianceWeeklyTrend`

---

### 8.9 Network Status (`/dashboard/network`)

Stats row (4 cards): Total Gateways, Online, Connected Devices, Avg Signal

Table: Gateway Details — Name, Location, Status, Connected, Signal, Last Heartbeat

Progress bars: Gateway Availability %, Packet Delivery Rate %, Packet Loss %

Panel: Device Distribution — per-gateway bar showing helmet count share

**Hooks used:** `useNetworkHealth`, `useGateways`

---

### 8.10 Supervisor Profile (`/dashboard/profile`)

Account Information: Name, Email, Phone, Role, Department/Location

Avatar upload section: current avatar (or initials fallback), upload button

Change password section: Current Password, New Password, Confirm Password

**Hooks used:** `useMe`, `useUpdateMe`, `useChangePassword`, `useUploadAvatar`

---

### 8.11 Admin Dashboard Home (`/admin`)

Stats row (4 cards): Total Supervisors, Total Workers, Gateways Online, Critical Alerts

Charts: Supervisor distribution, Alert by level

Recent activity log.

**Hooks used:** `useSupervisors`, `useWorkers`, `useGateways`, `useAlertsByLevel`

---

### 8.12 Supervisors (`/admin/supervisors`)

Stats row (4 cards): Total, Active, Total Workers Managed, Total Gateways Assigned

Table columns: Name, Email, Department, Workers, Status, Actions (View, Edit, Delete)

Drawers:
- `AddSupervisorDrawer`: Name, Email, Password, Department/Location, Gateway assignment (real gateways from API via `useGateways`), Status
- `ViewSupervisorDrawer`: Read-only hero section (name, email, role) + stats + detail fields
- `EditSupervisorDrawer`: Same fields as Add, pre-filled; `useEffect([supervisor?.id])` sync

**Hooks used:** `useSupervisors`, `useGateways`, `useCreateSupervisor`, `useUpdateSupervisor`, `useDeleteSupervisor`

---

### 8.13 Workers (`/admin/workers`)

Stats row (4 cards): Total Workers, Active, With Helmet, Unassigned

Table columns: Name, Email, Department, Status, Details (View)

Drawer: `ViewWorkerDrawer` — reads worker detail + gateway name (resolved from gateways list)

**Hooks used:** `useWorkers`, `useGateways`, `useDeleteWorker`

---

### 8.14 Departments (`/admin/departments`)

Stats row (4 cards): Total Departments, Active, Total Workers, Unassigned Departments

Table columns: Name, Location, Workers (count), Description, Status, Actions (View, Edit, Delete)

Drawers:
- `AddDepartmentDrawer`: Name (required), Location, Description + info callout about assigning workers later
- `ViewDepartmentDrawer`: Department details + workers list (fetched via `useDepartmentWorkers`), empty state if no workers
- `EditDepartmentDrawer`: Name, Location, Description, Active toggle (boolean switch)

Delete confirms with message about workers being unassigned.

**Hooks used:** `useDepartments`, `useDepartmentWorkers`, `useCreateDepartment`, `useUpdateDepartment`, `useDeleteDepartment`

---

### 8.15 Gateways (`/admin/gateways`)

Stats row (4 cards): Total Gateways, Online, Connected Helmets, Avg Signal Strength

Table columns: Name, Location, Helmets, Status (with Wifi/WifiOff icon), Signal (animated bars), Last Heartbeat, Actions

Signal bar visualization:
```tsx
<div className="flex items-end gap-0.5 h-4">
  {[1,2,3,4].map(b => {
    const bars = Math.round((signalStrength / 100) * 4);
    return (
      <div key={b} className={`w-1.5 rounded-sm ${
        b <= bars
          ? signal > 70 ? 'bg-success' : signal > 40 ? 'bg-warning' : 'bg-critical'
          : 'bg-background-tertiary'
      }`} style={{ height: `${b * 25}%` }} />
    );
  })}
</div>
```

Drawers: Add, View (includes heartbeat display), Edit

**Hooks used:** `useGateways`, `useCreateGateway`, `useUpdateGateway`, `useDeleteGateway`

---

### 8.16 Analytics (`/admin/analytics`)

Stats row (4 cards): Total Alerts, Critical Events, Active Gateways, System Uptime

Charts:
- Alert Trends (LineChart)
- Alert by Type (BarChart)
- Department Distribution (BarChart)
- Compliance Trend (LineChart)

**Hooks used:** `useAnalyticsSummary`, `useAlertTrends`, `useAlertsByType`, `useAlertsByLevel`, `useCompliance`, `useDepartmentDistribution`

---

### 8.17 Reports & Audit Logs (`/admin/reports`)

Stats row (4 cards): Total Logs, Critical Events, Warning Events, Informational

Export button (top right) triggers `useExportReport`

Table columns: Timestamp, Event, Details, Severity badge

Severity colors: `critical` → red, `warning` → amber, `info` → blue

**Hooks used:** `useAuditLogs({ limit: '50' })`, `useExportReport`

---

### 8.18 Admin Profile (`/admin/profile`)

Same layout as Supervisor Profile. Account information section does **not** show the Admin ID field.

Sections: Avatar, Account Information (Name, Email, Phone, Role), Change Password

---

## 9. Data Layer

### 9.1 HTTP Client (`src/lib/http.ts`)

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'
const WS_BASE  = process.env.NEXT_PUBLIC_WS_URL  || 'ws://127.0.0.1:8000/ws'

// Attach Bearer token from localStorage
// Auto-redirect to /login on 401
// Handle 204 No Content
```

**Usage:**
```typescript
import { http } from '@/lib/http';
const data = await http<MyType>('/endpoint', { method: 'POST', body: JSON.stringify(payload) });
```

---

### 9.2 API Modules (`src/lib/*/index.ts`)

Each domain has its own module with consistent function signatures:

| Module | Key functions |
|---|---|
| `auth` | `login`, `logout`, `getMe`, `updateMe`, `changePassword`, `uploadAvatar` |
| `helmets` | `list`, `get`, `create`, `update`, `remove`, `sensorData` |
| `workers` | `list`, `get`, `create`, `update`, `remove`, `helmets` |
| `supervisors` | `list`, `get`, `create`, `update`, `remove`, `workers`, `gateways` |
| `departments` | `list`, `get`, `create`, `update`, `remove`, `workers` |
| `gateways` | `list`, `get`, `create`, `update`, `remove`, `helmets` |
| `alerts` | `list`, `feed`, `unresolved`, `create`, `resolve`, `remove` |
| `analytics` | `summary`, `alertTrends`, `gasLevels`, `compliance`, `networkHealth`, `environment`, `impacts` + more |
| `reports` | `auditLogs`, `exportReport`, `generate` |
| `notifications` | `list`, `unreadCount`, `readAll`, `readOne` |
| `system` | `health`, `performance`, `settings`, `updateSettings` |

---

### 9.3 Custom Hooks (`src/hooks/`)

All hooks wrap TanStack Query. Convention:

```typescript
// Queries
export function useItems(params?: Record<string, string>) {
  return useQuery({
    queryKey: ['items', params],
    queryFn: () => api.list(params),
    staleTime: 30_000,
  });
}

// Mutations
export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}
```

**Query cache invalidation:** On every mutation success, the related query key is invalidated to trigger a refetch.

**Refetch intervals by data type:**

| Data | Interval |
|---|---|
| Helmet sensor data | 10 seconds |
| Alerts (unresolved) | 30 seconds |
| Network health | 30 seconds |
| System health | 30 seconds |
| Analytics | 60 seconds |
| Notifications (unread count) | 30 seconds |
| User/Auth data | 5 minutes (stale time, no interval) |

---

### 9.4 Core Type Definitions (`src/lib/types.ts`)

```typescript
interface User {
  id: string; name: string; email: string; role: string;
  phone?: string; department?: string; location?: string;
  bio?: string; avatar_url?: string;
}

interface Helmet {
  id: string; worker_id?: string; worker_name?: string;
  status: 'active' | 'inactive' | 'alarm';
  co?: number; ch4?: number; temperature?: number; humidity?: number;
  battery?: number; signal?: number; helmet_wear?: boolean;
  gateway_id?: string; last_update?: string;
}

interface Worker {
  id: string; name: string; email?: string; phone?: string;
  department?: string; department_id?: string;
  status: 'active' | 'inactive'; supervisor_id?: string; gateway_id?: string;
}

interface Supervisor {
  id: string; name: string; email?: string; department?: string;
  location?: string; phone?: string; status?: string;
  worker_count?: number; gateway_count?: number;
}

interface Department {
  id: string; name: string; description?: string; location?: string;
  is_active: boolean; status?: string; worker_count?: number;
  created_at?: string; updated_at?: string;
}

interface Gateway {
  id: string; name?: string; location: string;
  status: 'online' | 'offline'; connected_helmets?: number;
  signal_strength?: number; last_heartbeat: string; ip_address?: string;
}

interface Alert {
  id: string; helmet_id?: string; worker_name?: string;
  type: string; level: 'critical' | 'warning' | 'info';
  message: string; timestamp: string; resolved: boolean;
}

interface Notification {
  id: string; message: string; level: string; read: boolean; created_at: string;
}
```

---

## 10. Authentication

### Flow

1. User submits login form (`/login`) with email, password, role
2. `useLogin()` calls `POST /auth/login`
3. Token saved to:
   - `localStorage` (key: `access_token`)
   - Cookie (key: `access_token`, 7-day max-age, `SameSite=Lax`)
   - User object cached in `localStorage` as JSON
4. Redirect to `/dashboard` or `/admin` based on role
5. Every `http()` call attaches `Authorization: Bearer {token}` header
6. `401` response → clear token → redirect to `/login`

### Session Protection

Both layouts implement:
- **Token check on mount** — `if (!token) router.push('/login')`
- **Idle timer** — `mousemove`, `keydown`, `click` events reset a 30-min timer; on timeout, shows 60-second countdown warning, then calls `useLogout()`
- **Cross-tab logout** — `window.addEventListener('storage', ...)` watches for token deletion
- **Back-button block** — `history.pushState` + `popstate` handler prevents cached page navigation

---

## 11. Real-time Features

### WebSocket Hooks

Three WebSocket hooks provide live data:

```typescript
// Live alerts stream
const alerts = useAlertsLive();   // → Alert[]

// Live single helmet sensor data
const reading = useHelmetLive(helmetId);  // → SensorReading | null

// Live gateway status
const gateways = useGatewaysLive();  // → Gateway[]
```

WebSocket URLs (from `src/lib/ws/index.ts`):
- Helmets: `ws://{host}/ws/helmets/{helmetId}`
- Alerts: `ws://{host}/ws/alerts`
- Gateways: `ws://{host}/ws/gateways`

### Polling Fallback

Analytics data uses `refetchInterval` as polling fallback when WebSockets aren't applicable.

---

## 12. Conventions & Rules

These rules apply when building new pages or modifying existing ones.

### Page Structure Rule

Every management page follows this exact top-down structure:
1. `'use client'` directive
2. React + icon imports
3. Hook imports
4. Type imports
5. Inline component definitions (Overlay, drawers — defined inside the file, not separate files)
6. Default export page component
7. State declarations at the top of the page component
8. Hook calls
9. Derived data (filtering, formatting)
10. Return JSX: `<div className="p-6 space-y-6">`

### Hook Order Rule

React hooks must always be called **before any conditional return**. This is especially critical in Edit drawers where the item prop can be null:

```tsx
// CORRECT
function EditDrawer({ item }: { item: Item | null }) {
  const [form, setForm] = useState(defaultForm);
  const { mutate } = useUpdate();
  useEffect(() => { if (item) setForm(item); }, [item?.id]);
  if (!item) return null; // guard AFTER hooks
}

// WRONG — causes React Hooks error
function EditDrawer({ item }: { item: Item | null }) {
  if (!item) return null; // guard BEFORE hooks — NEVER DO THIS
  const [form, setForm] = useState(defaultForm);
}
```

### State Sync Rule

When an Edit drawer receives a prop that can change (item to edit), sync form state using `useEffect` with the item's `id` as the dependency:

```tsx
useEffect(() => {
  if (item) {
    setForm({
      name: item.name ?? '',
      email: item.email ?? '',
      // ...
    });
  }
}, [item?.id]);
```

### Gateway Display Rule

Never display raw gateway UUIDs. Always resolve to a human-readable name:

```tsx
// Use name if available, fall back to location
{gw.name || gw.location}
```

### ID Display Rule

Do not show raw UUIDs in the UI anywhere — not in table cells, not in drawer headers, not in info sections.

### Three-State Rendering Rule

Every table/list must handle three states:
1. Loading → show loading text
2. Empty → show icon-in-box empty state with hint
3. Data → show the table

Never skip the empty state and render an empty table.

### Delete Safety Rule

Always use `confirm()` before calling a delete mutation. Include a warning if the deletion has cascading effects on related data.

### Mutation Feedback Rule

All mutation buttons must:
- Show a disabled state during pending: `disabled={isPending}`
- Show text feedback during pending: `{isPending ? 'Saving...' : 'Save'}`
- Apply `disabled:opacity-60` class for visual disabled state

### CSS Class Order Convention

```
{layout} {sizing} {spacing} {typography} {color} {border} {interactive}
```

Example: `flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary-dark transition-colors`

### Adding a New Page Checklist

When implementing a new page, ensure:
- [ ] `'use client'` at top
- [ ] Stats cards section (4 cards) matching data domain
- [ ] Page header with title, subtitle, and Add button (if applicable)
- [ ] Table with 3-state rendering (loading / empty / data)
- [ ] Appropriate empty state icon and hint text
- [ ] Add/View/Edit drawers with correct shell structure
- [ ] All hooks called before any `if (!x) return null` guards
- [ ] `useEffect([item?.id])` for form sync in Edit drawers
- [ ] `confirm()` before delete
- [ ] `disabled={isPending}` on submit buttons
- [ ] No raw UUID display anywhere in the UI
- [ ] Route added to sidebar nav component

---

*End of UI Documentation. Last updated: June 2026.*
