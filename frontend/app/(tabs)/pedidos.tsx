import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const API_BASE = 'http://172.20.10.7:3000';

interface Pedido {
  id: number;
  titulo: string;
  descripcion: string;
  estado_actual: string;
  fecha_promesa: string;
  cliente: string;
}

export default function PedidosScreen() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState('Todos');

  const fetchPedidos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/pedidos`);
      if (!res.ok) throw new Error('Error al obtener pedidos');
      const data = await res.json();
      setPedidos(data);
      setFilteredPedidos(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudieron obtener los pedidos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const filterByEstado = (estado: string) => {
    setSelectedEstado(estado);
    if (estado === 'Todos') setFilteredPedidos(pedidos);
    else {
      const filtrados = pedidos.filter(
        (p) => p.estado_actual.toLowerCase() === estado.toLowerCase()
      );
      setFilteredPedidos(filtrados);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPedidos();
  };

  const getEstadoStyle = (estado: string) => {
    const e = estado.toLowerCase();
    if (e.includes('pendiente'))
      return { bg: '#fef3c7', color: '#b45309', emoji: '🟡' }; // amarillo claro
    if (e.includes('en_proceso'))
      return { bg: '#dbeafe', color: '#1d4ed8', emoji: '🔵' }; // azul
    if (e.includes('enviado'))
      return { bg: '#ffedd5', color: '#c2410c', emoji: '🟠' }; // naranja
    if (e.includes('entregado'))
      return { bg: '#dcfce7', color: '#15803d', emoji: '🟢' }; // verde
    if (e.includes('cancelado'))
      return { bg: '#fee2e2', color: '#b91c1c', emoji: '🔴' }; // rojo
    return { bg: '#e5e7eb', color: '#374151', emoji: '⚪' }; // gris
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={{ marginTop: 10 }}>Cargando pedidos...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item }: { item: Pedido }) => {
    const { bg, color, emoji } = getEstadoStyle(item.estado_actual);
    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.id]}>{item.id}</Text>
        <Text style={[styles.cell, styles.title]}>{item.titulo}</Text>
        <Text style={[styles.cell, styles.client]}>{item.cliente}</Text>

        <View style={[styles.statusBadge, { backgroundColor: bg }]}>
          <Text style={[styles.statusText, { color }]}>
            {emoji} {item.estado_actual}
          </Text>
        </View>

        <Text style={[styles.cell, styles.date]}>
          {new Date(item.fecha_promesa).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleHeader}>📦 Lista de Pedidos</Text>

      <View style={styles.filterContainer}>
        {['Todos', 'pendiente', 'en_proceso', 'enviado', 'entregado', 'cancelado'].map(
          (estado) => (
            <TouchableOpacity
              key={estado}
              style={[
                styles.filterButton,
                selectedEstado === estado && styles.filterButtonActive,
              ]}
              onPress={() => filterByEstado(estado)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedEstado === estado && styles.filterTextActive,
                ]}
              >
                {estado === 'Todos'
                  ? 'Todos'
                  : estado.charAt(0).toUpperCase() + estado.slice(1)}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.header}>
        <Text style={[styles.headerText, styles.id]}>ID</Text>
        <Text style={[styles.headerText, styles.title]}>Título</Text>
        <Text style={[styles.headerText, styles.client]}>Cliente</Text>
        <Text style={[styles.headerText, styles.status]}>Estado</Text>
        <Text style={[styles.headerText, styles.date]}>Fecha</Text>
      </View>

      <FlatList
        data={filteredPedidos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#007bff']} />
        }
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  titleHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 6,
  },
  filterButton: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  filterText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 3,
    alignItems: 'center',
  },
  cell: {
    textAlign: 'center',
    fontSize: 12,
  },
  id: { flex: 0.5 },
  title: { flex: 2 },
  client: { flex: 1.5 },
  status: { flex: 1.4 },
  date: { flex: 1.2 },
  statusBadge: {
    flex: 1.4,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 6,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
