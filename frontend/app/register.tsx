import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const API_BASE = 'http://172.20.10.7:3000'; // 🔹 Tu IP local + puerto 3000

export default function Register() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('⚠️ Campos requeridos', 'Por favor completa todos los campos.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert('❌ Error en registro', data.msg || 'No se pudo registrar el usuario.');
        return;
      }

      Alert.alert('✅ Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
      router.push('/'); // Redirige al login
    } catch (e: any) {
      Alert.alert('🌐 Error de red', String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
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

      <Button
        title={loading ? 'Registrando…' : 'Registrarme'}
        onPress={onRegister}
        disabled={loading}
        color="#0a84ff"
      />

      <TouchableOpacity onPress={() => router.push('/')} style={{ marginTop: 16 }}>
        <Text style={{ textAlign: 'center', color: '#0a84ff' }}>
          ← Ya tengo cuenta, iniciar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f7f7f7',
  },
});
