import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const API_BASE = 'http://192.168.1.71:3000'; // <-- tu IP local + puerto 3000

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingresa email y contraseña.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('Error', data.msg || 'No se pudo iniciar sesión.');
        return;
      }

      Alert.alert('✅ Login exitoso', `Bienvenido ${data.user.nombre}`);
    } catch (e: any) {
      Alert.alert('Error de red', String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title={loading ? 'Ingresando…' : 'Iniciar sesión'} onPress={onLogin} disabled={loading} />

      {/* Enlace a Register */}
      <TouchableOpacity onPress={() => router.push('/register')} style={{ marginTop: 16 }}>
        <Text style={{ textAlign: 'center', color: '#0a84ff' }}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, backgroundColor: '#f7f7f7'
  },
});
