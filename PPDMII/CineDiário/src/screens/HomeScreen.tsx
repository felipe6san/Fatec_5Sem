import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert, StyleSheet, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Production } from '../types/Production';
import * as sqliteService from '../services/sqliteService';
import { mongoService } from '../services/mongoService';

interface HomeScreenProps {
  onAddPress: () => void;
  onEditPress: (production: Production) => void;
  onSearchPress: () => void;
  onChangeDatabase?: () => void;
}

export default function HomeScreen({ onAddPress, onEditPress, onSearchPress, onChangeDatabase }: HomeScreenProps) {
  const { selectedDatabase } = useDatabaseContext();
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<'todos' | 'filme' | 'série'>('todos');

  const loadProductions = useCallback(async () => {
    try {
      setLoading(true);
      let data: Production[];

      if (selectedDatabase === 'sqlite') {
        await sqliteService.initializeSQLiteDatabase();
        data = await sqliteService.getAllProductions();
      } else {
        data = await mongoService.getAllProductions();
      }

      setProductions(data);
    } catch (error) {
      console.error('Erro ao carregar produções:', error);
      // Não mostra alerta para não atrapalhar UX inicial
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedDatabase]);

  useEffect(() => {
    loadProductions();
  }, [loadProductions]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProductions();
  }, [loadProductions]);

  const filteredProductions = productions.filter((p: Production) => {
    if (selectedType === 'todos') return true;
    return p.tipo === selectedType;
  });

  const handleDeleteProduction = async (id: string) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja deletar este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            if (selectedDatabase === 'sqlite') {
              await sqliteService.deleteProduction(id);
            } else {
              await mongoService.deleteProduction(id);
            }
            loadProductions();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível deletar o item');
          }
        },
      },
    ]);
  };

  const renderProductionCard = ({ item }: { item: Production }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {/* Poster */}
        <View style={styles.posterContainer}>
          {item.posterUrl ? (
            <Image source={{ uri: item.posterUrl }} style={styles.posterImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderEmoji}>🎬</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.titulo}
          </Text>

          <View style={styles.ratingRow}>
            <Text style={styles.rating}>★ {item.minhaNotas}/10</Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>
                {item.tipo === 'filme' ? '🎥 Filme' : '📺 Série'}
              </Text>
            </View>
          </View>

          <Text style={styles.genreText}>{item.genero}</Text>
          <Text style={styles.yearText}>{item.anoLancamento}</Text>
          <Text style={styles.platformText}>{item.ondeAssistiu}</Text>

          {/* Ações */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => onEditPress(item)}
            >
              <Text style={styles.buttonText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteProduction(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.buttonText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const filterTypes = [
    { key: 'todos', label: '📋 Todos' },
    { key: 'filme', label: '🎥 Filmes' },
    { key: 'série', label: '📺 Séries' },
  ] as const;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Cine Diário</Text>
          <View style={styles.headerButtonsRow}>
            {onChangeDatabase && (
              <TouchableOpacity onPress={onChangeDatabase} style={styles.changeDbButton}>
                <Text style={styles.changeDbText}>Trocar BD</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onSearchPress} style={styles.searchTMDBButton}>
              <Text style={styles.searchTMDBText}>🔍 TMDB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Buttons */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filterTypes.map((type) => (
            <TouchableOpacity
              key={type.key}
              onPress={() => setSelectedType(type.key)}
              style={[
                styles.filterButton,
                selectedType === type.key && styles.filterButtonActive
              ]}
            >
              <Text style={styles.filterText}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            Total: <Text style={styles.statValueRed}>{productions.length}</Text>
          </Text>
          <Text style={styles.statText}>
            Mostrando: <Text style={styles.statValueBlue}>{filteredProductions.length}</Text>
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {filteredProductions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🎬</Text>
            <Text style={styles.emptyTitle}>Nenhuma produção encontrada</Text>
            <Text style={styles.emptySubtitle}>
              Adicione um filme ou série para começar
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredProductions}
            renderItem={renderProductionCard}
            keyExtractor={(item: Production) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#DC2626"
              />
            }
          />
        )}
      </View>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={onAddPress}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchTMDBButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  searchTMDBText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  headerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changeDbButton: {
    backgroundColor: '#374151',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  changeDbText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#374151',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#DC2626',
  },
  filterText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 16,
  },
  statText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  statValueRed: {
    color: '#F87171',
    fontWeight: 'bold',
  },
  statValueBlue: {
    color: '#60A5FA',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardRow: {
    flexDirection: 'row',
  },
  posterContainer: {
    width: 96,
    // allow the poster to stretch vertically to match the card height
    alignSelf: 'stretch',
    minHeight: 144,
    backgroundColor: '#374151',
    borderRadius: 8,
    overflow: 'hidden',
  },
  posterEmoji: {
    fontSize: 32,
  },
  posterImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2d3842',
  },
  placeholderEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  // placeholderText removed — placeholder now shows only emoji
  cardInfo: {
    flex: 1,
    padding: 12,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    color: '#FBBF24',
    fontWeight: '600',
    marginRight: 8,
  },
  typeBadge: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  genreText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 2,
  },
  yearText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 4,
  },
  platformText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  emptySubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: -2,
  },
});
