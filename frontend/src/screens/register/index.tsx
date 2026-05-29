import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './registerScreen.styles';
import { useAuth } from '@/src/hooks/useAuth';

const ORANGE = '#ff8000';

const RegisterScreen = () => {
  const router = useRouter();
  const { register, submitting, error } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password strength 0–100
  const getStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score += 40;
    if (/[A-Z]/.test(p)) score += 20;
    if (/[0-9]/.test(p)) score += 20;
    if (/[^A-Za-z0-9]/.test(p)) score += 20;
    return score;
  };
  const strength = getStrength(password);
  const strengthColor = strength < 40 ? '#ff4444' : strength < 80 ? ORANGE : '#4CAF50';
  const strengthLabel =
    strength < 40 ? 'WEAK' : strength < 80 ? 'MODERATE' : 'STRONG';

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    const success = await register(username.trim(), email.trim(), password);
    if (!success && error) {
      Alert.alert('Registration Failed', error);
    }
    // On success, _layout.tsx redirect handles navigation
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.appBar}>
            <Text style={styles.logoText}>SIGNAL ONYX</Text>
          </View>
          <Text style={styles.protocol}>PROTOCOL ALPHA</Text>
          <Text style={styles.title}>Initialize{'\n'}Account</Text>
          <Text style={styles.subtitle}>
            Calibrate your signature. Access the global frequency of high-fidelity masters.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>OPERATOR NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="USERNAME"
              placeholderTextColor="#555"
              value={username}
              onChangeText={setUsername}
              editable={!submitting}
            />

            <Text style={styles.label}>SIGNAL CHANNEL</Text>
            <TextInput
              style={styles.input}
              placeholder="EMAIL ADDRESS"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!submitting}
            />

            <View style={styles.keyRow}>
              <Text style={styles.label}>ACCESS KEYS</Text>
              <Text style={styles.keyEnc}>ENCRYPTED 256-BIT</Text>
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="••••••••"
                placeholderTextColor="#555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!submitting}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#aaa" />
              </TouchableOpacity>
            </View>

            {/* Password strength */}
            <View style={styles.clearanceRow}>
              <MaterialIcons name="fingerprint" size={32} color={strengthColor} style={{ marginRight: 8 }} />
              <View style={{ flex: 1 }}>
                <View style={styles.clearanceBarWrap}>
                  <View
                    style={[
                      styles.clearanceBar,
                      { width: `${strength}%`, backgroundColor: strengthColor },
                    ]}
                  />
                </View>
                <Text style={[styles.clearanceText, { color: strengthColor }]}>
                  SECURITY CLEARANCE LEVEL: {password ? strengthLabel : 'PENDING INITIALIZATION'}
                </Text>
              </View>
            </View>

            {/* Error */}
            {error ? (
              <Text style={{ color: '#ff4444', fontSize: 12, marginBottom: 8, letterSpacing: 0.5 }}>
                ⚠ {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.joinBtn, submitting && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#181818" />
              ) : (
                <>
                  <Text style={styles.joinBtnText}>JOIN THE STUDIO</Text>
                  <Ionicons name="arrow-forward" size={22} color="#181818" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ alignItems: 'center', marginTop: 12 }}
              onPress={() => router.push('/login')}
            >
              <Text style={{ color: '#aaa', fontSize: 13 }}>
                Already have an account?{' '}
                <Text style={{ color: ORANGE, fontWeight: 'bold' }}>SIGN IN</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.terms}>
            BY JOINING, YOU AGREE TO THE{' '}
            <Text style={{ textDecorationLine: 'underline', color: ORANGE }}>ONYX MASTER TERMS</Text>
            {' '}& {' '}
            <Text style={{ textDecorationLine: 'underline', color: ORANGE }}>PRIVACY GRID</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
