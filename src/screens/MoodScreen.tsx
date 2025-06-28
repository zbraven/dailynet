import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useTheme} from '../contexts/ThemeContext';
import {useLanguage} from '../contexts/LanguageContext';
import {moodService} from '../services/database';
import {MoodEntry} from '../types';

const MOOD_EMOJIS = ['😢', '😞', '😕', '😐', '🙂', '😊', '😄', '😁', '😍', '🤩'];

const MoodScreen = () => {
  const {theme} = useTheme();
  const {t} = useLanguage();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [todayEntries, setTodayEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodayEntries();
  }, []);

  const loadTodayEntries = async () => {
    try {
      const entries = await moodService.getToday();
      setTodayEntries(entries);
    } catch (error) {
      console.error('Error loading mood entries:', error);
    }
  };

  const handleSaveMood = async () => {
    if (selectedMood === null) {
      Alert.alert(t('common.error'), t('mood.selectMoodFirst'));
      return;
    }

    try {
      setLoading(true);
      await moodService.create(selectedMood, notes);
      setSelectedMood(null);
      setNotes('');
      await loadTodayEntries();
      Alert.alert(t('common.success'), t('mood.moodSaved'));
    } catch (error) {
      console.error('Error saving mood:', error);
      Alert.alert(t('common.error'), t('mood.saveFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Alert.alert(
      t('common.delete'),
      t('mood.deleteConfirm'),
      [
        {text: t('common.cancel'), style: 'cancel'},
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await moodService.delete(id);
              await loadTodayEntries();
            } catch (error) {
              console.error('Error deleting mood entry:', error);
            }
          }
        }
      ]
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontSize: theme.typography.h2.fontSize,
      fontWeight: theme.typography.h2.fontWeight as any,
      color: theme.colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginVertical: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.h3.fontWeight as any,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    moodGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    moodButton: {
      width: '18%',
      aspectRatio: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      borderWidth: 2,
      borderColor: 'transparent',
    },
    moodButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '20',
    },
    moodEmoji: {
      fontSize: 24,
    },
    moodNumber: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    notesInput: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      padding: theme.spacing.md,
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      minHeight: 80,
      textAlignVertical: 'top',
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: theme.spacing.md,
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: theme.typography.body.fontSize,
      fontWeight: '600',
    },
    entryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
    },
    entryMood: {
      fontSize: 32,
      marginRight: theme.spacing.md,
    },
    entryContent: {
      flex: 1,
    },
    entryTime: {
      fontSize: theme.typography.caption.fontSize,
      color: theme.colors.textSecondary,
    },
    entryNotes: {
      fontSize: theme.typography.body.fontSize,
      color: theme.colors.text,
      marginTop: theme.spacing.xs,
    },
    deleteButton: {
      padding: theme.spacing.sm,
    },
    deleteText: {
      color: theme.colors.error,
      fontSize: theme.typography.caption.fontSize,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('nav.mood')}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('mood.howAreYouFeeling')}</Text>
          <View style={styles.moodGrid}>
            {MOOD_EMOJIS.map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.moodButton,
                  selectedMood === index + 1 && styles.moodButtonSelected,
                ]}
                onPress={() => setSelectedMood(index + 1)}>
                <Text style={styles.moodEmoji}>{emoji}</Text>
                <Text style={styles.moodNumber}>{index + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('mood.notes')}</Text>
          <TextInput
            style={styles.notesInput}
            placeholder={t('mood.notesPlaceholder')}
            placeholderTextColor={theme.colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
          />
          
          <TouchableOpacity
            style={[styles.saveButton, (loading || selectedMood === null) && styles.saveButtonDisabled]}
            onPress={handleSaveMood}
            disabled={loading || selectedMood === null}>
            <Text style={styles.saveButtonText}>{t('mood.saveMood')}</Text>
          </TouchableOpacity>
        </View>

        {todayEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('mood.todayEntries')}</Text>
            {todayEntries.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                <Text style={styles.entryMood}>{MOOD_EMOJIS[entry.mood_level - 1]}</Text>
                <View style={styles.entryContent}>
                  <Text style={styles.entryTime}>{formatTime(entry.created_at)}</Text>
                  {entry.notes && <Text style={styles.entryNotes}>{entry.notes}</Text>}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteEntry(entry.id)}>
                  <Text style={styles.deleteText}>{t('common.delete')}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MoodScreen;