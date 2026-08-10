import { useState } from "react";
import {
  LayoutDashboard, CalendarDays, Users, ClipboardCheck,
  Megaphone, Award, Settings, Search, Bell, Plus, Clock, MapPin, Sun, Moon
} from "lucide-react";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "volunteers", label: "Volunteers", icon: Users },
  { key: "attendance", label: "Attendance", icon: ClipboardCheck },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "certificates", label: "Certificates", icon: Award },
  { key: "settings", label: "Settings", icon: Settings },
];

const stats = [
  { label: "Total Events", value: "18", tint: "#2F5FFF", icon: CalendarDays },
  { label: "Live Registrations", value: "742", tint: "#22C55E", icon: Users },
  { label: "Pending Approvals", value: "12", tint: "#FF6B4A", icon: ClipboardCheck },
  { label: "Certificates Issued", value: "310", tint: "#14161F", icon: Award },
];

const events = [
  { name: "Encore Hackathon 2026", date: "18 Jul 2026", venue: "CL-1 Auditorium", regs: 214, status: "Live" },
  { name: "Cultural Night", date: "22 Jul 2026", venue: "Open Air Theatre", regs: 480, status: "Draft" },
  { name: "AI/ML Workshop", date: "25 Jul 2026", venue: "Seminar Hall B", regs: 96, status: "Live" },
  { name: "Sports Meet", date: "02 Aug 2026", venue: "Ground", regs: 150, status: "Completed" },
];

const volunteerQueue = [
  { name: "Aarav Mehta", event: "Encore Hackathon 2026", role: "Registration Desk" },
  { name: "Bhavika Patel", event: "Cultural Night", role: "Stage Coordination" },
  { name: "Rohan Iyer", event: "AI/ML Workshop", role: "Tech Support" },
];

function Sidebar({ active, setActive }) {
  // Sidebar stays dark charcoal in both themes — it's the brand anchor, not a surface that flips.
  return (
    <aside className="w-64 shrink-0 bg-[#14161F] text-white flex flex-col">
      <div className="px-6 py-6">
        <h1 className="font-display font-800 text-2xl tracking-tight">
          Encore<span className="text-[#FF6B4A]">.</span>
        </h1>
        <p className="text-xs text-white/40 mt-1">Organizer Console</p>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative
                ${isActive ? "bg-[#2F5FFF]/15 text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`}
            >
              {isActive && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-[#FF6B4A]" />
              )}
              <Icon size={18} strokeWidth={2} />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#2F5FFF] flex items-center justify-center font-display font-700 text-sm">
          
        </div>
        <div className="text-sm">
          <p className="font-medium leading-tight">User</p>
          <p className="text-xs text-white/40 leading-tight">Event Organizer</p>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ dark, setDark }) {
  return (
    <header className={`h-16 flex items-center justify-between px-8 border-b transition-colors
      ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <div className="relative w-80">
        <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${dark ? "text-white/40" : "text-[#6B7280]"}`} />
        <input
          placeholder="Search events, volunteers..."
          className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#2F5FFF]/30
            ${dark ? "bg-white/5 text-white placeholder:text-white/40" : "bg-[#F6F5F4] placeholder:text-[#6B7280]"}`}
        />
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setDark(!dark)}
          className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-[#F6F5F4]"}`}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={19} className="text-white/80" /> : <Moon size={19} className="text-[#14161F]" />}
        </button>
        <button className={`relative p-2 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-[#F6F5F4]"}`}>
          <Bell size={19} className={dark ? "text-white/80" : "text-[#14161F]"} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF6B4A]" />
        </button>
        <button className="flex items-center gap-2 bg-[#FF6B4A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#FF6B4A]/90 transition-colors">
          <Plus size={16} /> Create Event
        </button>
      </div>
    </header>
  );
}

function StatCard({ label, value, tint, icon: Icon, dark }) {
  return (
    <div className={`rounded-xl p-5 border flex items-start justify-between transition-colors
      ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <div>
        <p className={`text-sm mb-1 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>{label}</p>
        <p className={`font-display font-700 text-2xl ${dark ? "text-white" : "text-[#14161F]"}`}>{value}</p>
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${tint}${dark ? "33" : "1A"}` }}
      >
        <Icon size={19} style={{ color: tint }} />
      </div>
    </div>
  );
}

function EventsTable({ dark }) {
  const statusStyles = dark
    ? {
        Live: "bg-[#22C55E]/15 text-[#4ADE80]",
        Draft: "bg-white/10 text-white/60",
        Completed: "bg-[#2F5FFF]/15 text-[#7C9CFF]",
      }
    : {
        Live: "bg-[#22C55E]/10 text-[#16803C]",
        Draft: "bg-[#6B7280]/10 text-[#6B7280]",
        Completed: "bg-[#2F5FFF]/10 text-[#2F5FFF]",
      };

  return (
    <div className={`rounded-xl border overflow-hidden transition-colors ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <div className={`px-5 py-4 border-b flex items-center justify-between ${dark ? "border-white/5" : "border-black/5"}`}>
        <h3 className={`font-display font-700 ${dark ? "text-white" : "text-[#14161F]"}`}>Your Events</h3>
        <button className="text-sm text-[#2F5FFF] font-medium hover:underline">View all</button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className={`text-left border-b ${dark ? "text-white/40 border-white/5" : "text-[#6B7280] border-black/5"}`}>
            <th className="font-medium px-5 py-3">Event</th>
            <th className="font-medium px-5 py-3">Date</th>
            <th className="font-medium px-5 py-3">Venue</th>
            <th className="font-medium px-5 py-3">Registrations</th>
            <th className="font-medium px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i} className={`border-b last:border-0 transition-colors
              ${dark ? "border-white/5 hover:bg-white/5" : "border-black/5 hover:bg-[#F6F5F4]/60"}`}>
              <td className={`px-5 py-3.5 font-medium ${dark ? "text-white" : "text-[#14161F]"}`}>{e.name}</td>
              <td className={`px-5 py-3.5 flex items-center gap-1.5 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>
                <Clock size={14} /> {e.date}
              </td>
              <td className={`px-5 py-3.5 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {e.venue}</span>
              </td>
              <td className={`px-5 py-3.5 ${dark ? "text-white" : "text-[#14161F]"}`}>{e.regs}</td>
              <td className="px-5 py-3.5">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[e.status]}`}>
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VolunteerQueue({ dark }) {
  return (
    <div className={`rounded-xl border p-5 transition-colors ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <h3 className={`font-display font-700 mb-4 ${dark ? "text-white" : "text-[#14161F]"}`}>Pending Volunteer Approvals</h3>
      <div className="space-y-3">
        {volunteerQueue.map((v, i) => (
          <div key={i} className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${dark ? "text-white" : "text-[#14161F]"}`}>{v.name}</p>
              <p className={`text-xs ${dark ? "text-white/40" : "text-[#6B7280]"}`}>{v.event} · {v.role}</p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-[#2F5FFF] text-white hover:bg-[#2F5FFF]/90">
                Approve
              </button>
              <button className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors
                ${dark ? "bg-white/10 text-white/60 hover:bg-white/15" : "bg-black/5 text-[#6B7280] hover:bg-black/10"}`}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [active, setActive] = useState("dashboard");
  const [dark, setDark] = useState(false);

  return (
    <div className={`flex h-screen font-body transition-colors ${dark ? "bg-[#0F1117]" : "bg-[#F6F5F4]"}`}>
      <Sidebar active={active} setActive={setActive} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Topbar dark={dark} setDark={setDark} />
        <main className="p-8 space-y-6">
          <div>
            <h2 className={`font-display font-800 text-2xl ${dark ? "text-white" : "text-[#14161F]"}`}>Good afternoon, User</h2>
            <p className={`text-sm mt-1 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>Here's what's happening across your events today.</p>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} dark={dark} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <EventsTable dark={dark} />
            </div>
            <VolunteerQueue dark={dark} />
          </div>
        </main>
      </div>
    </div>
  );
}