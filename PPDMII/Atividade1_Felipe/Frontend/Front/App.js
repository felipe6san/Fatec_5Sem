

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CadastroAluno from './Telas/CadastroAluno';
import ListaAlunos from './Telas/ListaAlunos';
import EditarAluno from './Telas/EditarAluno';
import VisualizarAluno from './Telas/VisualizarAluno';
import { StyleSheet } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#7c3aed', // Roxo principal
    accent: '#a78bfa', // Lilás
    background: '#f3e8ff',
    surface: '#ede9fe',
    text: '#3b0764',
    placeholder: '#a78bfa',
    notification: '#c026d3',
  },
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ListaAlunos">
          <Stack.Screen name="ListaAlunos" component={ListaAlunos} options={{ title: 'Alunos' }} />
          <Stack.Screen name="CadastroAluno" component={CadastroAluno} options={{ title: 'Cadastrar Aluno' }} />
          <Stack.Screen name="EditarAluno" component={EditarAluno} options={{ title: 'Editar Aluno' }} />
          <Stack.Screen name="VisualizarAluno" component={VisualizarAluno} options={{ title: 'Visualizar Aluno' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
