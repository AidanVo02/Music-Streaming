import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from './loginScreen.styles';
import { useAuth } from '@/src/hooks/useAuth';

const ORANGE = '#ff8000';

const LoginScreen = () => {
  const router = useRouter();
  const { login, submitting, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    const success = await login(email.trim(), password);
    if (!success && error) {
      Alert.alert('Login Failed', error);
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
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>SIGNAL ONYX</Text>
          </View>
          <View style={styles.logoUnderline} />

          {/* Login Box */}
          <View style={styles.loginBox}>
            <Text style={styles.title}>Access Terminal</Text>
            <Text style={styles.subtitle}>AUTHENTICATION PROTOCOL REQUIRED</Text>

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="OPERATOR@SIGNALONYX.COM"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!submitting}
            />

            <Text style={styles.label}>SECURITY KEY</Text>
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

            {/* Error message */}
            {error ? (
              <Text style={{ color: '#ff4444', fontSize: 12, marginTop: 8, letterSpacing: 0.5 }}>
                ⚠ {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.loginBtn, submitting && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#181818" />
              ) : (
                <>
                  <Text style={styles.loginBtnText}>INITIALIZE ENGINE</Text>
                  <Ionicons name="power" size={22} color="#181818" style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>

            {/* Create Account */}
            <TouchableOpacity
              style={styles.createAccountBtn}
              onPress={() => router.push('/register')}
              disabled={submitting}
            >
              <Text style={styles.createAccountText}>
                No account?{'  '}
                <Text style={styles.createAccountLink}>CREATE ACCOUNT</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>SERVER LINKED</Text>
            </View>          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
