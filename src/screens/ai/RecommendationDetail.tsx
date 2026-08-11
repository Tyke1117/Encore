import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Pressable } from 'react-native';
import { Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { getRecommendedEventById } from '../../data/mockRecommendations';
import AIInsightCard from './AIInsightCard';

type ParamList = { RecommendationDetail: { eventId: string } };

export default function RecommendationDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<ParamList, 'RecommendationDetail'>>();
  const { eventId } = route.params;

  const { data: event, isLoading } = useQuery({
    queryKey: ['recommendedEvent', eventId],
    queryFn: () => getRecommendedEventById(eventId),
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Event not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={16} color={colors.primary} />
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>

      <View style={styles.topRow}>
        <Avatar.Icon
          size={48}
          icon={() => <Icon name="calendar-star" size={22} color={colors.primary} />}
          style={{ backgroundColor: colors.primaryContainer }}
        />
        <View style={{ marginLeft: spacing.sm }}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.meta}>
            {event.club} · {event.category}
          </Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <Icon name="calendar-blank-outline" size={14} color={colors.onSurfaceVariant} />
        <Text style={styles.meta}>{event.date}</Text>
        <Icon name="map-marker-outline" size={14} color={colors.onSurfaceVariant} style={{ marginLeft: spacing.sm }} />
        <Text style={styles.meta}>{event.location}</Text>
      </View>

      <View style={styles.insightWrap}>
        <AIInsightCard text={`${event.matchScore}% match — this is one of your strongest recommendations right now.`} />
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionHeading}>Why we recommended this</Text>
      {event.reasons.map((reason, idx) => (
        <View key={idx} style={styles.reasonRow}>
          <Icon name="creation" size={14} color={colors.secondary} />
          <Text style={styles.reasonText}>{reason.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: spacing.lg },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  backButtonText: { fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize, color: colors.primary },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  title: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: typography.headlineLg.fontWeight,
    color: colors.onBackground,
  },
  meta: { fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize, color: colors.onSurfaceVariant },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  insightWrap: { marginBottom: spacing.md },
  divider: { height: 1, backgroundColor: colors.outlineVariant, marginVertical: spacing.md },
  sectionHeading: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: typography.headlineMd.fontSize,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  reasonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: spacing.sm },
  reasonText: { flex: 1, fontFamily: typography.bodyMd.fontFamily, fontSize: typography.bodyMd.fontSize, color: colors.onSurface },
  emptyText: { fontFamily: typography.bodyLg.fontFamily, fontSize: typography.bodyLg.fontSize, color: colors.onSurfaceVariant },
});
