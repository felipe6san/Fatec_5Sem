import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Card, IconButton, Button } from 'react-native-paper';
import { Avatar } from 'react-native-paper';

export default function ListaAlunos({ navigation, route }) {
  const [alunos, setAlunos] = useState([]);
  const [mensagem, setMensagem] = useState('');

  const carregarAlunos = async () => {
    try {
      const response = await fetch('http://192.168.50.117:3000/alunos');
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      setMensagem('Erro ao carregar alunos');
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  useEffect(() => {
    if (route && route.params && route.params.atualiza) {
      carregarAlunos();
      navigation.setParams({ atualiza: false });
    }
  }, [route?.params?.atualiza]);

  const excluirAluno = async (id) => {
    try {
      const response = await fetch(`http://192.168.50.117:3000/alunos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMensagem('Aluno excluído com sucesso!');
        setAlunos(alunos.filter(a => a._id !== id));
      } else {
        setMensagem('Erro ao excluir aluno');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Lista de Alunos</Text>
      <Button
        mode="contained"
        icon="account-plus"
        buttonColor="#a78bfa"
        textColor="#3b0764"
        style={{ marginBottom: 16, width: 220, alignSelf: 'center', borderRadius: 8 }}
        contentStyle={{ height: 48 }}
        onPress={() => navigation.navigate('CadastroAluno')}
      >
        Cadastrar Aluno
      </Button>
      {alunos.length === 0 && <Text style={styles.mensagem}>Nenhum aluno cadastrado.</Text>}
      {alunos.map(aluno => (
        <Card key={aluno._id} style={styles.card}>
          <Card.Title
            title={aluno.nome}
            subtitle={`Matrícula: ${aluno.matricula}`}
            titleStyle={{ color: '#7c3aed', fontWeight: 'bold', fontSize: 20 }}
            subtitleStyle={{ color: '#6d28d9' }}
          />
          <Card.Content>
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>CEP: </Text><Text style={styles.valor}>{aluno.endereco?.cep || '-'}</Text></Text>
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>Logradouro: </Text><Text style={styles.valor}>{aluno.endereco?.logradouro || '-'}</Text></Text>
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>Número: </Text><Text style={styles.valor}>{aluno.endereco?.numero || '-'}</Text></Text>
            {aluno.endereco?.complemento ? (
              <Text style={styles.infoLinha}><Text style={styles.labelItem}>Complemento: </Text><Text style={styles.valor}>{aluno.endereco.complemento}</Text></Text>
            ) : null}
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>Bairro: </Text><Text style={styles.valor}>{aluno.endereco?.bairro || '-'}</Text></Text>
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>Cidade: </Text><Text style={styles.valor}>{aluno.endereco?.cidade || '-'}</Text></Text>
            <Text style={styles.infoLinha}><Text style={styles.labelItem}>Estado: </Text><Text style={styles.valor}>{aluno.endereco?.estado || '-'}</Text></Text>
              <Text style={styles.infoLinha}>
                <Text style={styles.labelItem}>Cursos: </Text>
                <Text style={styles.valor}>{aluno.cursos && aluno.cursos.length > 0 ? aluno.cursos.join(', ') : 'Nenhum'}</Text>
              </Text>
          </Card.Content>
          <Card.Actions>
            <IconButton icon="eye-outline" iconColor="#c026d3" size={28} style={styles.iconAcao} onPress={() => navigation.navigate('VisualizarAluno', { aluno })} />
            <IconButton icon="pencil-outline" iconColor="#c026d3" size={28} style={styles.iconAcao} onPress={() => navigation.navigate('EditarAluno', { aluno })} />
            <IconButton icon="trash-can-outline" iconColor="#c026d3" size={28} style={styles.iconAcao} onPress={() => excluirAluno(aluno._id)} />
          </Card.Actions>
        </Card>
      ))}
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  labelItem: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  infoLinha: {
    color: '#6d28d9',
    fontSize: 15,
    marginBottom: 2,
  },
  valor: {
    color: '#3b0764',
    fontWeight: 'bold',
    fontSize: 15,
  },
  iconAcao: {
    backgroundColor: '#ede9fe',
    borderRadius: 28,
    marginHorizontal: 2,
    elevation: 0,
    borderWidth: 2,
    borderColor: '#a78bfa',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c3aed',
    textAlign: 'center',
    letterSpacing: 1,
  },
  card: {
    width: 340,
    marginBottom: 16,
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  mensagem: {
    marginTop: 16,
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
