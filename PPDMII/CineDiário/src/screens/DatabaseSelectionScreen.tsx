import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface DatabaseSelectionScreenProps {
  onDatabaseSelected: (database: 'sqlite' | 'mongodb') => void;
}

export default function DatabaseSelectionScreen({
  onDatabaseSelected,
}: DatabaseSelectionScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Escolha o Banco de Dados</Text>
          <Text style={styles.subtitle}>
            Selecione onde deseja armazenar seus dados
          </Text>
        </View>

        {/* SQLite Option */}
        <TouchableOpacity
          onPress={() => onDatabaseSelected('sqlite')}
          style={styles.sqliteCard}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>💾</Text>
            <Text style={styles.cardTitle}>SQLite</Text>
          </View>
          <Text style={styles.sqliteDescription}>
            Armazenamento local no dispositivo. Sem necessidade de conexão com internet.
            Ideal para uso offline.
          </Text>
        </TouchableOpacity>

        {/* MongoDB Option */}
        <TouchableOpacity
          onPress={() => onDatabaseSelected('mongodb')}
          style={styles.mongoCard}
          activeOpacity={0.8}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardEmoji}>☁️</Text>
            <Text style={styles.cardTitle}>MongoDB</Text>
          </View>
          <Text style={styles.mongoDescription}>
            Armazenamento na nuvem. Sincroniza seus dados entre dispositivos. Requer
            conexão com internet.
          </Text>
        </TouchableOpacity>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={styles.infoBold}>Dica:</Text> Você pode trocar de banco de dados
            depois nas configurações do aplicativo.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  sqliteCard: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mongoCard: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sqliteDescription: {
    fontSize: 14,
    color: '#BFDBFE',
    lineHeight: 20,
  },
  mongoDescription: {
    fontSize: 14,
    color: '#BBF7D0',
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoText: {
    fontSize: 14,
    color: '#D1D5DB',
  },
  infoBold: {
    fontWeight: '600',
  },
});
