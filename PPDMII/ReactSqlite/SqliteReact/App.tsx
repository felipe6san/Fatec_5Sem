import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { CriaBanco, CriaTabela } from './Bd';
import { use, useEffect } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';

export default function App() {
  async function Main() {
    const db = await CriaBanco();
    if (db) {
      CriaTabela(db);
    }
  }
  useEffect(() => {
    Main();
  }, []);
  return (
    <View style={styles.container}>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
