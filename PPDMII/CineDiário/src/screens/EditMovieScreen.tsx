import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDatabaseContext } from '../contexts/DatabaseContext';
import { Production, ProductionType } from '../types/Production';
import * as sqliteService from '../services/sqliteService';
import { mongoService } from '../services/mongoService';

interface EditMovieScreenProps {
  production: Production;
  onClose: () => void;
  onSuccess: () => void;
}

const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Cinema', 'TV Aberta', 'Outro'];
const genres = ['Ação', 'Comédia', 'Drama', 'Ficção Científica', 'Fantasia', 'Horror', 'Romance', 'Thriller'];

export default function EditMovieScreen({ production, onClose, onSuccess }: EditMovieScreenProps) {
  const { selectedDatabase } = useDatabaseContext();

  const [formData, setFormData] = useState({
    titulo: production.titulo,
    anoLancamento: production.anoLancamento.toString(),
    genero: production.genero,
    tipo: production.tipo,
    minhaNotas: production.minhaNotas.toString(),
    ondeAssistiu: production.ondeAssistiu,
    resumo: production.resumo || '',
  });

  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  const handleUpdateProduction = async () => {
    if (!formData.titulo.trim()) {
      Alert.alert('Erro', 'Por favor, preencha o título');
      return;
    }

    try {
      const updatedData: Partial<Production> = {
        titulo: formData.titulo,
        anoLancamento: parseInt(formData.anoLancamento),
        genero: formData.genero,
        tipo: formData.tipo as ProductionType,
        minhaNotas: parseInt(formData.minhaNotas),
        ondeAssistiu: formData.ondeAssistiu,
        resumo: formData.resumo,
      };

      if (selectedDatabase === 'sqlite') {
        await sqliteService.updateProduction(production.id, updatedData);
      } else {
        await mongoService.updateProduction(production.id, updatedData);
      }

      Alert.alert('Sucesso', 'Produção atualizada com sucesso!');
      onSuccess();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar a produção');
    }
  };

  return (
    <Modal animationType="slide" visible={true}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Editar Produção</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
          {/* Título */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Título *</Text>
            <TextInput
              placeholder="Digite o título..."
              placeholderTextColor="#999"
              value={formData.titulo}
              onChangeText={(text: string) => setFormData({ ...formData, titulo: text })}
              style={styles.input}
            />
          </View>

          {/* Tipo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tipo</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, tipo: 'filme' })}
                style={[styles.typeButton, formData.tipo === 'filme' && styles.typeButtonActive]}
              >
                <Text style={styles.typeButtonText}>🎥 Filme</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFormData({ ...formData, tipo: 'série' })}
                style={[styles.typeButton, formData.tipo === 'série' && styles.typeButtonActive]}
              >
                <Text style={styles.typeButtonText}>📺 Série</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ano de Lançamento */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Ano de Lançamento</Text>
            <TextInput
              placeholder="YYYY"
              placeholderTextColor="#999"
              value={formData.anoLancamento}
              onChangeText={(text: string) => setFormData({ ...formData, anoLancamento: text })}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* Gênero */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Gênero</Text>
            <TouchableOpacity
              onPress={() => setShowGenreDropdown(!showGenreDropdown)}
              style={styles.dropdown}
            >
              <Text style={styles.dropdownText}>{formData.genero}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {showGenreDropdown && (
              <View style={styles.dropdownList}>
                {genres.map((genre) => (
                  <TouchableOpacity
                    key={genre}
                    onPress={() => {
                      setFormData({ ...formData, genero: genre });
                      setShowGenreDropdown(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{genre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Onde Assistiu */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Onde Assistiu</Text>
            <TouchableOpacity
              onPress={() => setShowPlatformDropdown(!showPlatformDropdown)}
              style={styles.dropdown}
            >
              <Text style={styles.dropdownText}>{formData.ondeAssistiu}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {showPlatformDropdown && (
              <View style={styles.dropdownList}>
                {platforms.map((platform) => (
                  <TouchableOpacity
                    key={platform}
                    onPress={() => {
                      setFormData({ ...formData, ondeAssistiu: platform });
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
                value={formData.minhaNotas}
                onChangeText={(text: string) => setFormData({ ...formData, minhaNotas: text })}
                keyboardType="numeric"
                style={[styles.input, styles.ratingInput]}
              />
              <Text style={styles.ratingStar}>★</Text>
            </View>
          </View>

          {/* Resumo */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Resumo (Opcional)</Text>
            <TextInput
              placeholder="Digite um resumo ou suas impressões..."
              placeholderTextColor="#999"
              value={formData.resumo}
              onChangeText={(text: string) => setFormData({ ...formData, resumo: text })}
              multiline
              numberOfLines={4}
              style={[styles.input, styles.textArea]}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleUpdateProduction} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Atualizar</Text>
          </TouchableOpacity>
        </View>
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
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1F2937',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
    fontSize: 16,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
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
  dropdown: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
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
    backgroundColor: '#1F2937',
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#374151',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
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
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
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
    backgroundColor: '#2563EB',
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
