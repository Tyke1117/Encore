import "./global.css";
import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  LayoutDashboard, CalendarDays, Users, ClipboardCheck,
  Search, Bell, Plus, Clock, MapPin, Sun, Moon, Award,
} from "lucide-react-native";
const tabs = [
  { key: "dashboard", label: "Home", icon: LayoutDashboard },
  { key: "events", label: "Events", icon: CalendarDays },
  { key: "volunteers", label: "Volunteers", icon: Users },
  { key: "attendance", label: "Attendance", icon: ClipboardCheck },
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
];

const volunteerQueue = [
  { name: "Aarav Mehta", event: "Encore Hackathon 2026", role: "Registration Desk" },
  { name: "Bhavika Patel", event: "Cultural Night", role: "Stage Coordination" },
];

function StatCard({ label, value, tint, icon: Icon, dark }) {
  return (
    <View
      className={`w-[48%] rounded-xl p-4 mb-3 border ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}
    >
      <View
        className="w-9 h-9 rounded-lg items-center justify-center mb-3"
        style={{ backgroundColor: `${tint}${dark ? "33" : "1A"}` }}
      >
        <Icon size={18} color={tint} />
      </View>
      <Text className={`text-xs mb-1 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>{label}</Text>
      <Text className={`text-xl font-bold ${dark ? "text-white" : "text-[#14161F]"}`}>{value}</Text>
    </View>
  );
}

const statusColors = {
  Live: { bg: "bg-[#22C55E]/10", text: "text-[#16803C]" },
  Draft: { bg: "bg-[#6B7280]/10", text: "text-[#6B7280]" },
  Completed: { bg: "bg-[#2F5FFF]/10", text: "text-[#2F5FFF]" },
};

function EventCard({ e, dark }) {
  const s = statusColors[e.status];
  return (
    <View className={`rounded-xl p-4 mb-3 border ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <View className="flex-row items-start justify-between mb-2">
        <Text className={`font-semibold text-base flex-1 pr-2 ${dark ? "text-white" : "text-[#14161F]"}`}>
          {e.name}
        </Text>
        <View className={`px-2 py-1 rounded-full ${s.bg}`}>
          <Text className={`text-xs font-medium ${s.text}`}>{e.status}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-1 mb-1">
        <Clock size={13} color={dark ? "#ffffff80" : "#6B7280"} />
        <Text className={`text-xs ${dark ? "text-white/50" : "text-[#6B7280]"}`}>{e.date}</Text>
      </View>
      <View className="flex-row items-center gap-1 mb-2">
        <MapPin size={13} color={dark ? "#ffffff80" : "#6B7280"} />
        <Text className={`text-xs ${dark ? "text-white/50" : "text-[#6B7280]"}`}>{e.venue}</Text>
      </View>
      <Text className={`text-xs font-medium ${dark ? "text-white/70" : "text-[#14161F]"}`}>
        {e.regs} registrations
      </Text>
    </View>
  );
}

function VolunteerRow({ v, dark }) {
  return (
    <View className={`rounded-xl p-4 mb-3 border ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}>
      <Text className={`font-medium text-sm mb-1 ${dark ? "text-white" : "text-[#14161F]"}`}>{v.name}</Text>
      <Text className={`text-xs mb-3 ${dark ? "text-white/40" : "text-[#6B7280]"}`}>
        {v.event} · {v.role}
      </Text>
      <View className="flex-row gap-2">
        <Pressable className="flex-1 bg-[#2F5FFF] rounded-lg py-2 items-center">
          <Text className="text-white text-xs font-medium">Approve</Text>
        </Pressable>
        <Pressable className={`flex-1 rounded-lg py-2 items-center ${dark ? "bg-white/10" : "bg-black/5"}`}>
          <Text className={`text-xs font-medium ${dark ? "text-white/60" : "text-[#6B7280]"}`}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [dark, setDark] = useState(false);

  const bg = dark ? "bg-[#0F1117]" : "bg-[#F6F5F4]";

return (
  <SafeAreaProvider>
    <SafeAreaView className={`flex-1 ${bg}`} edges={["top", "bottom"]}>
      <StatusBar style={dark ? "light" : "dark"} />

      {/* Top bar */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-3">
        <View>
          <Text className={`text-xl font-extrabold ${dark ? "text-white" : "text-[#14161F]"}`}>
            Encore<Text className="text-[#FF6B4A]">.</Text>
          </Text>
          <Text className={`text-xs ${dark ? "text-white/40" : "text-[#6B7280]"}`}>Organizer Console</Text>
        </View>
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => setDark(!dark)}>
            {dark ? <Sun size={20} color="#ffffffcc" /> : <Moon size={20} color="#14161F" />}
          </Pressable>
          <Pressable>
            <Bell size={20} color={dark ? "#ffffffcc" : "#14161F"} />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View className="px-5 mb-4">
        <View
          className={`flex-row items-center rounded-lg px-3 py-2.5 ${dark ? "bg-white/5" : "bg-white border border-black/5"}`}
        >
          <Search size={16} color={dark ? "#ffffff66" : "#6B7280"} />
          <TextInput
            placeholder="Search events, volunteers..."
            placeholderTextColor={dark ? "#ffffff66" : "#6B7280"}
            className={`ml-2 flex-1 text-sm ${dark ? "text-white" : "text-[#14161F]"}`}
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Text className={`text-lg font-bold mb-1 ${dark ? "text-white" : "text-[#14161F]"}`}>
          Good afternoon, Sil
        </Text>
        <Text className={`text-sm mb-4 ${dark ? "text-white/50" : "text-[#6B7280]"}`}>
          Here's what's happening across your events today.
        </Text>

        {/* Stats grid */}
        <View className="flex-row flex-wrap justify-between">
          {stats.map((s, i) => (
            <StatCard key={i} {...s} dark={dark} />
          ))}
        </View>

        {/* Create event button */}
        <Pressable className="bg-[#FF6B4A] rounded-xl py-3 flex-row items-center justify-center gap-2 mb-5 mt-1">
          <Plus size={16} color="white" />
          <Text className="text-white font-semibold text-sm">Create Event</Text>
        </Pressable>

        {/* Events */}
        <Text className={`font-bold text-base mb-3 ${dark ? "text-white" : "text-[#14161F]"}`}>
          Your Events
        </Text>
        {events.map((e, i) => (
          <EventCard key={i} e={e} dark={dark} />
        ))}

        {/* Volunteer queue */}
        <Text className={`font-bold text-base mb-3 mt-2 ${dark ? "text-white" : "text-[#14161F]"}`}>
          Pending Volunteer Approvals
        </Text>
        {volunteerQueue.map((v, i) => (
          <VolunteerRow key={i} v={v} dark={dark} />
        ))}

        <View className="h-24" />
      </ScrollView>

      {/* Bottom tab bar */}
      <View
        className={`flex-row justify-around items-center py-3 border-t ${dark ? "bg-[#1A1C26] border-white/5" : "bg-white border-black/5"}`}
      >
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = active === t.key;
          return (
            <Pressable key={t.key} onPress={() => setActive(t.key)} className="items-center">
              <Icon size={20} color={isActive ? "#2F5FFF" : dark ? "#ffffff50" : "#9CA3AF"} />
              <Text
                className={`text-[10px] mt-1 ${isActive ? "text-[#2F5FFF] font-medium" : dark ? "text-white/40" : "text-gray-400"}`}
              >
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
   </SafeAreaView>
  </SafeAreaProvider>
  );
}