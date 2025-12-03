import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Production } from '../types/Production';
import * as sqliteService from '../services/sqliteService';
import { mongoService } from '../services/mongoService';
import {
  searchMovies,
  searchSeries,
  getPopularMovies,
  getPopularSeries,
  getImageUrl,
  getGenreNames,
  TMDBMovie,
  TMDBSeries,
} from '../services/tmdbService';
import { generateId } from '../utils/uuid';

interface SearchTMDBScreenProps {
  onClose: () => void;
  onSuccess: () => void;
}

const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Cinema', 'TV Aberta', 'Outro'];

type SearchType = 'movie' | 'tv';
type TMDBItem = (TMDBMovie | TMDBSeries) & { media_type?: string };

export default function SearchTMDBScreen({ onClose, onSuccess }: SearchTMDBScreenProps) {
  const { selectedDatabase } = useDatabaseContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [results, setResults] = useState<TMDBItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TMDBItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('Netflix');
  const [myRating, setMyRating] = useState('7');
  const [myNotes, setMyNotes] = useState('');
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  // Carregar populares ao abrir
  useEffect(() => {
    loadPopular();
  }, [searchType]);

  const loadPopular = async () => {
    setLoading(true);
    try {
      if (searchType === 'movie') {
        const data = await getPopularMovies();
        setResults(data.results);
      } else {
        const data = await getPopularSeries();
        setResults(data.results);
      }
    } catch (error) {
      console.error('Erro ao carregar populares:', error);
    }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPopular();
      return;
    }

    setLoading(true);
    try {
      if (searchType === 'movie') {
        const data = await searchMovies(searchQuery);
        setResults(data.results);
      } else {
        const data = await searchSeries(searchQuery);
        setResults(data.results);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      Alert.alert('Erro', 'Não foi possível realizar a busca');
    }
    setLoading(false);
  };

  const handleSelectItem = (item: TMDBItem) => {
    setSelectedItem(item);
    setShowAddModal(true);
  };

  const getItemTitle = (item: TMDBItem): string => {
    return 'title' in item ? item.title : item.name;
  };

  const getItemYear = (item: TMDBItem): number => {
    const date = 'release_date' in item ? item.release_date : item.first_air_date;
    return date ? new Date(date).getFullYear() : new Date().getFullYear();
  };

  const handleAddToCollection = async () => {
    if (!selectedItem) return;

    try {
      const genreNames = await getGenreNames(
        selectedItem.genre_ids || [],
        searchType === 'movie'
      );
      const genreName = genreNames.join(', ') || 'Desconhecido';

      const newProduction: Production = {
        id: generateId(),
        titulo: getItemTitle(selectedItem),
        anoLancamento: getItemYear(selectedItem),
        genero: genreName,
        tipo: searchType === 'movie' ? 'filme' : 'série',
        minhaNotas: parseInt(myRating) || 7,
        ondeAssistiu: selectedPlatform,
        resumo: myNotes || selectedItem.overview || '',
        posterUrl: getImageUrl(selectedItem.poster_path, 'w500'),
        dateCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString(),
      };

      if (selectedDatabase === 'sqlite') {
        await sqliteService.addProduction(newProduction);
      } else {
        await mongoService.addProduction(newProduction);
      }

      Alert.alert('Sucesso', `"${getItemTitle(selectedItem)}" adicionado à sua coleção!`);
      setShowAddModal(false);
      setSelectedItem(null);
      setMyNotes('');
      setMyRating('7');
      onSuccess();
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      Alert.alert('Erro', 'Não foi possível adicionar à coleção');
    }
  };

  const renderItem = ({ item }: { item: TMDBItem }) => {
    const title = getItemTitle(item);
    const year = getItemYear(item);
    const rating = item.vote_average?.toFixed(1) || 'N/A';

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => handleSelectItem(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri: item.poster_path
              ? getImageUrl(item.poster_path, 'w185')
              : 'https://via.placeholder.com/185x278?text=Sem+Imagem',
          }}
          style={styles.posterImage}
        />
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.resultYear}>{year}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {rating}</Text>
          </View>
          <Text style={styles.resultOverview} numberOfLines={3}>
            {item.overview || 'Sem descrição disponível.'}
          </Text>
        </View>
        <View style={styles.addIconContainer}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal animationType="slide" visible={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buscar no TMDB</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar filme ou série..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            style={styles.searchInput}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            onPress={() => setSearchType('movie')}
            style={[styles.typeButton, searchType === 'movie' && styles.typeButtonActive]}
          >
            <Text style={styles.typeButtonText}>🎥 Filmes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSearchType('tv')}
            style={[styles.typeButton, searchType === 'tv' && styles.typeButtonActive]}
          >
            <Text style={styles.typeButtonText}>📺 Séries</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Buscando...</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum resultado encontrado</Text>
              </View>
            }
          />
        )}

        {/* Add Modal */}
        <Modal visible={showAddModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView>
                {selectedItem && (
                  <>
                    <View style={styles.modalHeader}>
                      <Image
                        source={{
                          uri: selectedItem.poster_path
                            ? getImageUrl(selectedItem.poster_path, 'w185')
                            : 'https://via.placeholder.com/185x278?text=Sem+Imagem',
                        }}
                        style={styles.modalPoster}
                      />
                      <View style={styles.modalInfo}>
                        <Text style={styles.modalTitle}>{getItemTitle(selectedItem)}</Text>
                        <Text style={styles.modalYear}>{getItemYear(selectedItem)}</Text>
                        <Text style={styles.modalRating}>
                          ★ {selectedItem.vote_average?.toFixed(1)} (TMDB)
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.modalOverview} numberOfLines={4}>
                      {selectedItem.overview || 'Sem descrição disponível.'}
                    </Text>

                    {/* Onde Assistiu */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Onde Assistiu</Text>
                      <TouchableOpacity
                        onPress={() => setShowPlatformDropdown(!showPlatformDropdown)}
                        style={styles.dropdown}
                      >
                        <Text style={styles.dropdownText}>{selectedPlatform}</Text>
                        <Text style={styles.dropdownArrow}>▼</Text>
                      </TouchableOpacity>
                      {showPlatformDropdown && (
                        <View style={styles.dropdownList}>
                          {platforms.map((platform) => (
                            <TouchableOpacity
                              key={platform}
                              onPress={() => {
                                setSelectedPlatform(platform);
                                setShowPlatformDropdown(false);
                              }}
                              style={styles.dropdownItem}
                            >
                              <Text style={styles.dropdownItemText}>{platform}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Minha Nota */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Minha Nota (0-10)</Text>
                      <View style={styles.ratingRow}>
                        <TextInput
                          placeholder="0-10"
                          placeholderTextColor="#999"
                          value={myRating}
                          onChangeText={setMyRating}
                          keyboardType="numeric"
                          style={[styles.input, styles.ratingInput]}
                        />
                        <Text style={styles.ratingStar}>★</Text>
                      </View>
                    </View>

                    {/* Minhas Anotações */}
                    <View style={styles.fieldContainer}>
                      <Text style={styles.label}>Minhas Anotações (Opcional)</Text>
                      <TextInput
                        placeholder="O que você achou?"
                        placeholderTextColor="#999"
                        value={myNotes}
                        onChangeText={setMyNotes}
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.textArea]}
                        textAlignVertical="top"
                      />
                    </View>
                  </>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddModal(false);
                    setSelectedItem(null);
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddToCollection} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#9CA3AF',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  typeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 12,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  posterImage: {
    width: 100,
    height: 150,
    backgroundColor: '#374151',
  },
  resultInfo: {
    flex: 1,
    padding: 12,
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultYear: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 6,
  },
  ratingBadge: {
    backgroundColor: '#FBBF24',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  ratingText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultOverview: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 18,
  },
  addIconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  addIcon: {
    fontSize: 28,
    color: '#DC2626',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    maxHeight: '80%',
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  modalPoster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  modalInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalYear: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  modalRating: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverview: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#374151',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  dropdownArrow: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  dropdownList: {
    backgroundColor: '#374151',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  dropdownItemText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingInput: {
    flex: 1,
    marginRight: 12,
  },
  ratingStar: {
    fontSize: 32,
    color: '#FBBF24',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#4B5563',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
