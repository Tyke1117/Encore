import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { QnaMessage } from '../../types/ai';
import { QUICK_QUESTIONS, getAnswer } from '../../data/mockQna';

export default function AIQna() {
  const [messages, setMessages] = useState<QnaMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hi! Ask me about your recommendations, or tap a question below.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    const userMsg: QnaMessage = { id: `u_${Date.now()}`, sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    const answer = await getAnswer(text);

    const aiMsg: QnaMessage = { id: `a_${Date.now()}`, sender: 'ai', text: answer };
    setMessages((prev) => [...prev, aiMsg]);
    setSending(false);

    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ask AI</Text>
        <Text style={styles.headerSubtitle}>Guided answers, not free-form chat</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.bubble,
              msg.sender === 'user' ? styles.bubbleUser : styles.bubbleAi,
            ]}
          >
            <Text
              style={
                msg.sender === 'user' ? styles.bubbleTextUser : styles.bubbleTextAi
              }
            >
              {msg.text}
            </Text>
          </View>
        ))}

        {sending && (
          <View style={[styles.bubble, styles.bubbleAi]}>
            <Text style={styles.bubbleTextAi}>...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.quickRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {QUICK_QUESTIONS.map((q) => (
            <Pressable
              key={q.id}
              style={styles.chip}
              onPress={() => sendMessage(q.question)}
              disabled={sending}
            >
              <Text style={styles.chipText}>{q.question}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a question..."
          placeholderTextColor={colors.onSurfaceVariant}
          value={input}
          onChangeText={setInput}
          onSubmitEditing={() => sendMessage(input)}
          editable={!sending}
        />
        <Pressable
          style={styles.sendButton}
          onPress={() => sendMessage(input)}
          disabled={sending || !input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: typography.headlineLg.fontWeight,
    color: colors.onBackground,
  },
  headerSubtitle: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  messages: {
    flex: 1,
  },
  messagesContent: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  bubbleAi: {
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignSelf: 'flex-start',
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-end',
  },
  bubbleTextAi: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  bubbleTextUser: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onPrimary,
  },
  quickRow: {
    paddingLeft: spacing.lg,
    paddingBottom: spacing.sm,
  },
  chip: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  chipText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSecondaryContainer,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.input,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurface,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendButtonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    fontWeight: typography.labelMd.fontWeight,
    color: colors.onPrimary,
  },
});
