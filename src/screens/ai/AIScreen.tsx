import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

export const AIScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, isDark } = useTheme();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello User! I am your Encore AI assistant. I can help analyze registration pace, predict event turnouts, optimize schedules, and draft communications. What can I do for you today?",
      sender: 'ai',
      time: '12:00 PM',
    },
  ]);

  const promptSuggestions = [
    'Analyze turnout for Cultural Night',
    'Draft a warning announcement',
    'Suggest schedule optimization',
  ];

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    // Generate mock AI response
    setTimeout(() => {
      let aiResponseText = "I've analyzed that request. Our projections show registrations are pacing 15% ahead of your last summit, indicating a filling capacity soon.";
      if (textToSend.includes('turnout') || textToSend.includes('Cultural')) {
        aiResponseText = "Based on current weather forecasts and past Friday cultural registrations, we estimate a 92% turnout. I recommend scheduling an extra entry scanner to prevent lines.";
      } else if (textToSend.includes('announcement') || textToSend.includes('Draft')) {
        aiResponseText = "Here is a draft announcement:\n\n'Hey guys! 🚨 Cultural Night registrations are filling up fast (90% capacity!). Grab your tickets now before booking closes tonight!'";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.outlineVariant }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>Encore AI</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        {/* Messages list */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          ref={(ref) => ref?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.sender === 'user' ? styles.userRow : styles.aiRow,
              ]}
            >
              {msg.sender === 'ai' && (
                <LinearGradient
                  colors={[colors.secondary, colors.tertiary]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.aiAvatar}
                >
                  <Ionicons name="sparkles" size={14} color="#ffffff" />
                </LinearGradient>
              )}
              <View
                style={[
                  styles.messageBubble,
                  msg.sender === 'user'
                    ? [styles.userBubble, { backgroundColor: colors.secondary }]
                    : [styles.aiBubble, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }],
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userText : { color: colors.onSurface },
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    msg.sender === 'user' ? styles.userTime : { color: colors.onSurfaceVariant },
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Suggestion Pills */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
            {promptSuggestions.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}
                onPress={() => handleSend(prompt)}
              >
                <Ionicons name="analytics-outline" size={14} color={colors.secondary} style={{ marginRight: 4 }} />
                <Text style={[styles.pillText, { color: colors.onSurfaceVariant }]}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Text Input Footer */}
        <View style={[styles.inputFooter, { backgroundColor: colors.surface, borderTopColor: colors.outlineVariant }]}>
          <View style={[styles.inputBox, { backgroundColor: colors.surfaceContainerLow, borderColor: colors.outlineVariant }]}>
            <TextInput
              style={[styles.textInput, { color: colors.onSurface }]}
              placeholder="Ask Encore AI..."
              placeholderTextColor={colors.outline}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity 
              onPress={() => handleSend()} 
              activeOpacity={0.8}
              style={[styles.sendBtn, { backgroundColor: colors.secondary }]}
            >
              <Ionicons name="arrow-up" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    height: 70,
    paddingTop:20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
  },
  aiRow: {
    alignSelf: 'flex-start',
    alignItems: 'flex-end',
    gap: 8,
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageBubble: {
    borderRadius: radius.card,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    ...shadows.level1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    ...typography.bodyMd,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 9,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  suggestionsContainer: {
    paddingVertical: spacing.xs,
  },
  pillsScroll: {
    paddingHorizontal: spacing.md,
    gap: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.chip,
  },
  pillText: {
    ...typography.labelSm,
    fontWeight: '600',
  },
  inputFooter: {
    padding: spacing.sm,
    borderTopWidth: 1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    height: 48,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    height: '100%',
    ...typography.bodyMd,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AIScreen;
