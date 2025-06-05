import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '@/constants/colors';
import { useSessionStore } from '@/store/sessionStore';
import { Trash2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const clearHistory = useSessionStore((state) => state.clearHistory);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [timerAlerts, setTimerAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleClearHistory = () => {
    if (showConfirmation) {
      clearHistory();
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>
      
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sound Effects</Text>
              <Text style={styles.settingDescription}>
                Play sounds during gameplay
              </Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={soundEnabled ? COLORS.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vibration</Text>
              <Text style={styles.settingDescription}>
                Enable haptic feedback
              </Text>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={vibrationEnabled ? COLORS.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Timer Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified when time is running out
              </Text>
            </View>
            <Switch
              value={timerAlerts}
              onValueChange={setTimerAlerts}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={timerAlerts ? COLORS.primary : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Use dark color theme
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ccc', true: COLORS.primaryLight }}
              thumbColor={darkMode ? COLORS.primary : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <TouchableOpacity 
            style={[
              styles.dangerButton,
              showConfirmation && styles.dangerButtonConfirm
            ]}
            onPress={handleClearHistory}
          >
            <Trash2 size={20} color={showConfirmation ? '#fff' : COLORS.error} />
            <Text 
              style={[
                styles.dangerButtonText,
                showConfirmation && styles.dangerButtonTextConfirm
              ]}
            >
              {showConfirmation ? 'Confirm Clear History' : 'Clear History'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>TimeBurner</Text>
            <Text style={styles.aboutDescription}>
              Version 1.0.0
            </Text>
          </View>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>Rate This App</Text>
            <Text style={styles.aboutDescription}>
              Leave feedback and help us improve
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>Privacy Policy</Text>
            <Text style={styles.aboutDescription}>
              Read our privacy policy
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.aboutItem}>
            <Text style={styles.aboutTitle}>Terms of Service</Text>
            <Text style={styles.aboutDescription}>
              Read our terms of service
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: COLORS.text,
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 15,
    paddingLeft: 5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 15,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
    backgroundColor: 'transparent',
  },
  dangerButtonConfirm: {
    backgroundColor: COLORS.error,
  },
  dangerButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 10,
  },
  dangerButtonTextConfirm: {
    color: '#fff',
  },
  aboutItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  aboutTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  aboutDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.7,
  },
});