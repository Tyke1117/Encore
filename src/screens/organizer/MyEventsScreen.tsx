import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useEvents, EventItem } from '../../context/EventsContext';
import Logo from '../../components/Logo';
import {
  INITIAL_ATTENDANCE_ROSTER,
  autoGenerateCertificatesFromAttendance,
  AttendanceRecord,
} from '../../services/attendanceCertificateService';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

export default function MyEventsScreen({ navigation }: { navigation: any }) {
  const { colors, isDark } = useTheme();
  const { events, updateEvent, deleteEvent, addEvent } = useEvents();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Edit / Create Modal State
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Attendance & Auto-Certificate State
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
  const [selectedEventForAttendance, setSelectedEventForAttendance] = useState<EventItem | null>(null);
  const [attendanceRoster, setAttendanceRoster] = useState<AttendanceRecord[]>([]);
  const [isGeneratingBatch, setIsGeneratingBatch] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<EventItem['category']>('tech');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formVenue, setFormVenue] = useState('');
  const [formPrice, setFormPrice] = useState('Free');
  const [formTotalSeats, setFormTotalSeats] = useState('100');
  const [formSeatsLeft, setFormSeatsLeft] = useState('100');
  const [formStatus, setFormStatus] = useState<EventItem['status']>('Published');
  const [formDescription, setFormDescription] = useState('');

  // Calculate stats
  const totalEventsCount = events.length;
  const publishedCount = events.filter((e) => e.status === 'Published').length;
  const draftCount = events.filter((e) => e.status === 'Draft').length;
  const completedCount = events.filter((e) => e.status === 'Completed').length;

  // Filter events dynamically
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Create Modal
  const handleOpenAdd = () => {
    setEditingEvent(null);
    setFormName('');
    setFormCategory('tech');
    setFormDate('');
    setFormTime('');
    setFormVenue('');
    setFormPrice('Free');
    setFormTotalSeats('100');
    setFormSeatsLeft('100');
    setFormStatus('Published');
    setFormDescription('');
    setIsEditModalVisible(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormName(event.name);
    setFormCategory(event.category);
    setFormDate(event.date);
    setFormTime(event.time);
    setFormVenue(event.venue);
    setFormPrice(event.price);
    setFormTotalSeats(event.totalSeats ? event.totalSeats.toString() : '100');
    setFormSeatsLeft(event.seatsLeft ? event.seatsLeft.toString() : '100');
    setFormStatus(event.status);
    setFormDescription(event.description || '');
    setIsEditModalVisible(true);
  };

  // Open Attendance Roster & Auto Certificate Modal
  const handleOpenAttendance = (event: EventItem) => {
    setSelectedEventForAttendance(event);
    const roster = INITIAL_ATTENDANCE_ROSTER[event.id] || [
      { id: 'att-1', studentName: 'Alex Morgan', studentId: 'CS-2026-01', email: 'alex.m@stanford.edu', department: 'Computer Science', college: 'Stanford University', status: 'Present', checkInTime: '09:15 AM' },
      { id: 'att-2', studentName: 'Rahul Verma', studentId: 'IT-2026-04', email: 'rahul.v@college.edu', department: 'Information Tech', college: 'Encore Institute', status: 'Present', checkInTime: '09:22 AM' },
      { id: 'att-3', studentName: 'Priya Sharma', studentId: 'ECE-2026-09', email: 'priya.s@college.edu', department: 'Electronics', college: 'Encore Institute', status: 'Present', checkInTime: '09:30 AM' },
      { id: 'att-4', studentName: 'Ananya Roy', studentId: 'AI-2026-12', email: 'ananya.r@college.edu', department: 'AI & Data Science', college: 'Encore Institute', status: 'Present', checkInTime: '09:45 AM' },
    ];
    setAttendanceRoster(roster);
    setIsAttendanceModalVisible(true);
  };

  const toggleCandidateStatus = (candidateId: string) => {
    setAttendanceRoster((prev) =>
      prev.map((item) =>
        item.id === candidateId
          ? { ...item, status: item.status === 'Present' ? 'Absent' : 'Present' }
          : item
      )
    );
  };

  const handleAutoGenerateCertificates = async () => {
    if (!selectedEventForAttendance) return;
    const presentCount = attendanceRoster.filter((c) => c.status === 'Present').length;
    if (presentCount === 0) {
      Alert.alert('No Attendance Recorded', 'Please mark at least 1 candidate as Present to generate certificates.');
      return;
    }

    setIsGeneratingBatch(true);
    try {
      const res = await autoGenerateCertificatesFromAttendance(
        selectedEventForAttendance.id,
        selectedEventForAttendance.name,
        selectedEventForAttendance.date,
        selectedEventForAttendance.venue,
        selectedEventForAttendance.organizerName || 'Encore Organizer',
        attendanceRoster
      );

      setIsGeneratingBatch(false);
      setIsAttendanceModalVisible(false);

      Alert.alert(
        '🎉 Certificates & Notifications Sent!',
        `Successfully auto-generated ${res.generatedCount} certificates! Personalized notifications have been dispatched automatically to each student.`
      );
    } catch (err) {
      console.error(err);
      setIsGeneratingBatch(false);
      Alert.alert('Error', 'Could not generate batch certificates.');
    }
  };

  const getIconForCategory = (cat: EventItem['category']) => {
    switch (cat) {
      case 'tech': return 'code-slash';
      case 'cultural': return 'musical-notes';
      case 'music': return 'guitar';
      case 'sports': return 'trophy';
      default: return 'calendar-outline';
    }
  };

  // Save Event Edit or Create
  const handleSaveEvent = () => {
    if (!formName.trim()) {
      Alert.alert('Validation Error', 'Event title is required.');
      return;
    }
    if (!formVenue.trim()) {
      Alert.alert('Validation Error', 'Event venue is required.');
      return;
    }

    const totalSeatsNum = parseInt(formTotalSeats, 10) || 100;
    const seatsLeftNum = parseInt(formSeatsLeft, 10) || totalSeatsNum;

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        name: formName.trim(),
        category: formCategory,
        date: formDate.trim() || editingEvent.date,
        time: formTime.trim() || editingEvent.time,
        venue: formVenue.trim(),
        price: formPrice.trim() || 'Free',
        totalSeats: totalSeatsNum,
        seatsLeft: seatsLeftNum,
        status: formStatus,
        description: formDescription.trim(),
        imageIcon: getIconForCategory(formCategory),
      });
      Alert.alert('Success', `"${formName}" details updated successfully.`);
    } else {
      addEvent({
        name: formName.trim(),
        category: formCategory,
        date: formDate.trim() || '15 Oct 2026',
        time: formTime.trim() || '10:00 AM',
        venue: formVenue.trim(),
        price: formPrice.trim() || 'Free',
        totalSeats: totalSeatsNum,
        seatsLeft: seatsLeftNum,
        status: formStatus,
        description: formDescription.trim(),
        imageIcon: getIconForCategory(formCategory),
        organizerName: 'Organizer',
      });
      Alert.alert('Event Created!', `"${formName}" has been published to your events list.`);
    }

    setIsEditModalVisible(false);
  };

  const handleDelete = (event: EventItem) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteEvent(event.id);
            Alert.alert('Event Removed', `"${event.name}" has been deleted.`);
          },
        },
      ]
    );
  };

  const getStatusColor = (status: EventItem['status']) => {
    switch (status) {
      case 'Published': return colors.secondary;
      case 'Draft': return colors.primary;
      case 'Completed': return colors.onSurfaceVariant;
    }
  };

  const presentCountInCurrentRoster = attendanceRoster.filter((c) => c.status === 'Present').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header with Encore Logo */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>

        <View style={styles.headerLogoWrap}>
          <Logo size="sm" />
          <Text style={[styles.headerTitle, { color: colors.onSurface }]}>My Events</Text>
        </View>

        <TouchableOpacity style={styles.addHeaderBtn} onPress={handleOpenAdd} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.addHeaderBadge}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
            <Text style={styles.addHeaderBadgeText}>New</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Summary Banner */}
        <View style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level2]}>
          <LinearGradient
            colors={[colors.secondary, colors.tertiary, colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statsBannerHeader}
          >
            <View style={styles.statsBannerTextWrap}>
              <Text style={styles.statsBannerTitle}>Organizer Management</Text>
              <Text style={styles.statsBannerSubtitle}>Live event operations, attendance & certificate automation</Text>
            </View>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>Sync Active</Text>
            </View>
          </LinearGradient>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.onSurface }]}>{totalEventsCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Total Events</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.outlineVariant }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.secondary }]}>{publishedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Published</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.outlineVariant }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>{draftCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Drafts</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.outlineVariant }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.onSurfaceVariant }]}>{completedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level1]}>
          <Ionicons name="search-outline" size={20} color={colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search events, venues, or descriptions..."
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {[
            { id: 'all', label: 'All Categories' },
            { id: 'tech', label: 'Tech & Hackathons' },
            { id: 'cultural', label: 'Cultural' },
            { id: 'music', label: 'Music' },
            { id: 'sports', label: 'Sports' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.filterChip,
                  { backgroundColor: colors.surface, borderColor: colors.outlineVariant },
                  isSelected && { backgroundColor: colors.secondaryContainer, borderColor: colors.secondary },
                ]}
                onPress={() => setSelectedCategory(cat.id)}
              >
                <Text style={[styles.filterChipText, { color: colors.onSurfaceVariant }, isSelected && { color: colors.secondary, fontWeight: '700' }]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Events Cards List */}
        <View style={styles.eventsListContainer}>
          {filteredEvents.map((event) => {
            const statusColor = getStatusColor(event.status);
            const progress = event.totalSeats ? (event.totalSeats - event.seatsLeft) / event.totalSeats : 0.5;

            return (
              <View
                key={event.id}
                style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }, shadows.level2]}
              >
                <LinearGradient
                  colors={[colors.secondary, colors.tertiary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardHeaderStrip}
                >
                  <View style={styles.cardCategoryIconBox}>
                    <Ionicons name={getIconForCategory(event.category) as any} size={20} color="#ffffff" />
                  </View>
                  <View style={[styles.cardStatusBadge, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={styles.cardStatusText}>{event.status}</Text>
                  </View>
                </LinearGradient>

                <View style={styles.cardBody}>
                  <View style={styles.cardTitleRow}>
                    <Text style={[styles.cardTitle, { color: colors.onSurface }]} numberOfLines={1}>
                      {event.name}
                    </Text>
                    <Text style={[styles.cardPriceTag, { color: colors.primary }]}>{event.price}</Text>
                  </View>

                  {event.description ? (
                    <Text style={[styles.cardDescription, { color: colors.onSurfaceVariant }]} numberOfLines={2}>
                      {event.description}
                    </Text>
                  ) : null}

                  <View style={styles.cardMetaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
                      <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]}>{event.date} • {event.time}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={14} color={colors.onSurfaceVariant} />
                      <Text style={[styles.metaText, { color: colors.onSurfaceVariant }]} numberOfLines={1}>{event.venue}</Text>
                    </View>
                  </View>

                  <View style={styles.seatsContainer}>
                    <View style={styles.seatsHeader}>
                      <Text style={[styles.seatsLabel, { color: colors.onSurfaceVariant }]}>Registrations</Text>
                      <Text style={[styles.seatsRemainingText, { color: statusColor }]}>
                        {event.seatsLeft} spots left
                      </Text>
                    </View>
                    <View style={[styles.progressTrack, { backgroundColor: colors.surfaceContainerHigh }]}>
                      <View style={[styles.progressFill, { width: `${Math.min(progress * 100, 100)}%`, backgroundColor: statusColor }]} />
                    </View>
                  </View>

                  {/* Action Toolbar */}
                  <View style={[styles.cardActionRow, { borderTopColor: colors.outlineVariant }]}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.editActionBtn, { backgroundColor: `${colors.secondary}14` }]}
                      onPress={() => handleOpenEdit(event)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="pencil" size={16} color={colors.secondary} />
                      <Text style={[styles.actionBtnText, { color: colors.secondary }]}>Edit</Text>
                    </TouchableOpacity>

                    {/* Attendance & Auto-Certificates Button */}
                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: colors.secondaryContainer }]}
                      onPress={() => handleOpenAttendance(event)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="people" size={16} color={colors.secondary} />
                      <Text style={[styles.actionBtnText, { color: colors.secondary, fontWeight: '700' }]}>
                        Attendance
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, { backgroundColor: `${colors.error}14` }]}
                      onPress={() => handleDelete(event)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="trash-outline" size={16} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Attendance & Automated Certificate Modal */}
      <Modal
        visible={isAttendanceModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsAttendanceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.outlineVariant }]}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="people" size={22} color={colors.secondary} />
                <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                  Attendance & Auto-Certificates
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsAttendanceModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={[styles.formLabel, { color: colors.onSurfaceVariant }]}>
                Event: <Text style={{ color: colors.onSurface, fontWeight: '700' }}>{selectedEventForAttendance?.name}</Text>
              </Text>

              {/* Attendance Candidates Roster */}
              <View style={styles.rosterContainer}>
                {attendanceRoster.map((candidate) => {
                  const isPresent = candidate.status === 'Present';
                  return (
                    <View
                      key={candidate.id}
                      style={[
                        styles.candidateRow,
                        { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.candidateName, { color: colors.onSurface }]}>{candidate.studentName}</Text>
                        <Text style={[styles.candidateMeta, { color: colors.onSurfaceVariant }]}>
                          ID: {candidate.studentId} • {candidate.department} ({candidate.college})
                        </Text>
                      </View>

                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleCandidateStatus(candidate.id)}
                        style={[
                          styles.statusToggleBtn,
                          { backgroundColor: isPresent ? colors.secondary : colors.surfaceVariant },
                        ]}
                      >
                        <Ionicons name={isPresent ? 'checkmark-circle' : 'close-circle'} size={16} color={isPresent ? '#ffffff' : colors.onSurfaceVariant} />
                        <Text style={[styles.statusToggleText, { color: isPresent ? '#ffffff' : colors.onSurfaceVariant }]}>
                          {candidate.status}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>

              {/* Dynamic Auto Certificate & Notification Button */}
              {presentCountInCurrentRoster > 0 && (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleAutoGenerateCertificates}
                  disabled={isGeneratingBatch}
                  style={[styles.autoBatchBtn, { backgroundColor: colors.primary }, shadows.interactive]}
                >
                  {isGeneratingBatch ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="ribbon" size={20} color="#ffffff" />
                      <Text style={styles.autoBatchBtnText}>
                        ⚡ Issue & Notify ({presentCountInCurrentRoster} Present)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Dynamic Edit / Create Event Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.outlineVariant }]}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name={editingEvent ? 'pencil' : 'add-circle'} size={22} color={colors.secondary} />
                <Text style={[styles.modalTitle, { color: colors.onSurface }]}>
                  {editingEvent ? 'Edit Event Details' : 'Create New Event'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.onSurface }]}>Event Title *</Text>
                <TextInput
                  style={[styles.formInput, { color: colors.onSurface, borderColor: colors.outlineVariant }]}
                  placeholder="e.g. Global Tech Summit 2026"
                  placeholderTextColor={colors.outline}
                  value={formName}
                  onChangeText={setFormName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.onSurface }]}>Category</Text>
                <View style={styles.categoryPickerRow}>
                  {(['tech', 'cultural', 'music', 'sports', 'general'] as const).map((cat) => {
                    const isSelected = formCategory === cat;
                    return (
                      <TouchableOpacity
                        key={cat}
                        style={[
                          styles.categoryChoice,
                          { borderColor: colors.outlineVariant },
                          isSelected && { backgroundColor: colors.secondary, borderColor: colors.secondary },
                        ]}
                        onPress={() => setFormCategory(cat)}
                      >
                        <Text style={[styles.categoryChoiceText, isSelected && { color: '#ffffff', fontWeight: '700' }]}>
                          {cat}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.onSurface }]}>Date</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.onSurface, borderColor: colors.outlineVariant }]}
                    placeholder="18 Jul 2026"
                    placeholderTextColor={colors.outline}
                    value={formDate}
                    onChangeText={setFormDate}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, { color: colors.onSurface }]}>Time</Text>
                  <TextInput
                    style={[styles.formInput, { color: colors.onSurface, borderColor: colors.outlineVariant }]}
                    placeholder="09:00 AM"
                    placeholderTextColor={colors.outline}
                    value={formTime}
                    onChangeText={setFormTime}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, { color: colors.onSurface }]}>Venue / Location *</Text>
                <TextInput
                  style={[styles.formInput, { color: colors.onSurface, borderColor: colors.outlineVariant }]}
                  placeholder="CL-1 Auditorium"
                  placeholderTextColor={colors.outline}
                  value={formVenue}
                  onChangeText={setFormVenue}
                />
              </View>

              <TouchableOpacity
                style={[styles.saveModalBtn, { backgroundColor: colors.secondary }, shadows.level2]}
                onPress={handleSaveEvent}
                activeOpacity={0.8}
              >
                <Text style={styles.saveModalBtnText}>
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: spacing.xs,
  },
  headerLogoWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    fontSize: 17,
  },
  addHeaderBtn: {
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  addHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    gap: 4,
  },
  addHeaderBadgeText: {
    ...typography.labelSm,
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  statsCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  statsBannerHeader: {
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsBannerTextWrap: {
    flex: 1,
  },
  statsBannerTitle: {
    ...typography.headlineMd,
    color: '#ffffff',
    fontWeight: '800',
  },
  statsBannerSubtitle: {
    ...typography.labelSm,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4E9F3D',
  },
  liveText: {
    ...typography.labelSm,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.headlineLg,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    ...typography.labelSm,
    fontSize: 10,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.input,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
  },
  filterRow: {
    gap: spacing.xs,
    paddingBottom: spacing.md,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  filterChipText: {
    ...typography.labelSm,
  },
  eventsListContainer: {
    gap: spacing.md,
  },
  eventCard: {
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeaderStrip: {
    height: 54,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategoryIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  cardStatusText: {
    ...typography.labelSm,
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 11,
  },
  cardBody: {
    padding: spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    flex: 1,
    paddingRight: spacing.xs,
  },
  cardPriceTag: {
    ...typography.labelMd,
    fontWeight: '800',
  },
  cardDescription: {
    ...typography.bodyMd,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.labelSm,
    fontSize: 12,
  },
  seatsContainer: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  seatsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  seatsLabel: {
    ...typography.labelSm,
    fontSize: 11,
  },
  seatsRemainingText: {
    ...typography.labelSm,
    fontWeight: '700',
    fontSize: 11,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.full,
  },
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.button,
    gap: 6,
  },
  editActionBtn: {},
  actionBtnText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  modalTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  modalBody: {
    padding: spacing.md,
    gap: spacing.md,
  },
  rosterContainer: {
    gap: spacing.xs,
  },
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  candidateName: {
    ...typography.bodyLg,
    fontWeight: '700',
    fontSize: 14,
  },
  candidateMeta: {
    ...typography.labelSm,
    fontSize: 11,
    marginTop: 2,
  },
  statusToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.chip,
    gap: 4,
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  autoBatchBtn: {
    height: 52,
    borderRadius: radius.button,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  autoBatchBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  formGroup: {
    gap: spacing.xs,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  formLabel: {
    ...typography.labelMd,
    fontWeight: '600',
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    fontSize: 14,
  },
  categoryPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryChoice: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.chip,
    borderWidth: 1,
  },
  categoryChoiceText: {
    ...typography.labelSm,
  },
  saveModalBtn: {
    height: 52,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  saveModalBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
