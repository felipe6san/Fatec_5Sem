import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from './src/screens/SplashScreen';
import DatabaseSelectionScreen from './src/screens/DatabaseSelectionScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddMovieScreen from './src/screens/AddMovieScreen';
import EditMovieScreen from './src/screens/EditMovieScreen';
import SearchTMDBScreen from './src/screens/SearchTMDBScreen';
import { DatabaseProvider, useDatabaseContext } from './src/contexts/DatabaseContext';
import { Production } from './src/types/Production';

type AppScreen = 'splash' | 'dbSelection' | 'home' | 'add' | 'edit' | 'search';

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [editingProduction, setEditingProduction] = useState<Production | null>(null);
  const { setSelectedDatabase } = useDatabaseContext();

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('dbSelection');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDatabaseSelected = (database: 'sqlite' | 'mongodb') => {
    setSelectedDatabase(database);
    setCurrentScreen('home');
  };

  const handleAddPress = () => {
    setCurrentScreen('add');
  };

  const handleSearchPress = () => {
    setCurrentScreen('search');
  };

  const handleEditPress = (production: Production) => {
    setEditingProduction(production);
    setCurrentScreen('edit');
  };

  const handleCloseModal = () => {
    setCurrentScreen('home');
    setEditingProduction(null);
  };

  const handleSuccess = () => {
    setCurrentScreen('home');
    setEditingProduction(null);
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === 'splash' && <SplashScreen />}
      {currentScreen === 'dbSelection' && (
        <DatabaseSelectionScreen onDatabaseSelected={handleDatabaseSelected} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen 
          onAddPress={handleAddPress} 
          onEditPress={handleEditPress}
          onSearchPress={handleSearchPress}
        />
      )}
      {currentScreen === 'add' && (
        <AddMovieScreen onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}
      {currentScreen === 'search' && (
        <SearchTMDBScreen onClose={handleCloseModal} onSuccess={handleSuccess} />
      )}
      {currentScreen === 'edit' && editingProduction && (
        <EditMovieScreen 
          production={editingProduction} 
          onClose={handleCloseModal} 
          onSuccess={handleSuccess} 
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <AppContent />
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
