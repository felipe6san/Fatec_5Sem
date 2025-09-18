import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

export default function VisualizarAluno({ route }) {
  const { aluno } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={aluno.nome}
          subtitle={`Matrícula: ${aluno.matricula}`}
          left={(props) => (
            <Avatar.Icon
              {...props}
              icon="account"
              color="#fff"
              style={{ backgroundColor: '#a78bfa' }}
            />
          )}
          titleStyle={{ color: '#7c3aed', fontWeight: 'bold', fontSize: 22 }}
          subtitleStyle={{ color: '#6d28d9' }}
        />
        <Card.Content>
          <Text style={styles.label}>Endereço</Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>CEP: </Text>
            <Text style={styles.valor}>{aluno.endereco.cep}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Logradouro: </Text>
            <Text style={styles.valor}>{aluno.endereco.logradouro}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Número: </Text>
            <Text style={styles.valor}>{aluno.endereco.numero}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Complemento: </Text>
            <Text style={styles.valor}>{aluno.endereco.complemento}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Bairro: </Text>
            <Text style={styles.valor}>{aluno.endereco.bairro}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Cidade: </Text>
            <Text style={styles.valor}>{aluno.endereco.cidade}</Text>
          </Text>
          <Text style={styles.info}>
            <Text style={styles.labelItem}>Estado: </Text>
            <Text style={styles.valor}>{aluno.endereco.estado}</Text>
          </Text>
          <Text style={styles.label}>Cursos</Text>
          <Text style={styles.valor}>
            {aluno.cursos && aluno.cursos.length > 0 ? aluno.cursos.join(', ') : 'Nenhum'}
          </Text>
          {aluno.observacoes ? (
            <>
              <Text style={styles.label}>Observações</Text>
              <Text style={styles.valor}>{aluno.observacoes}</Text>
            </>
          ) : null}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: 340,
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#a78bfa',
    paddingBottom: 16,
    alignSelf: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#7c3aed',
    fontSize: 18,
    letterSpacing: 1,
  },
  labelItem: {
    color: '#7c3aed',
    fontWeight: 'bold',
  },
  info: {
    color: '#6d28d9',
    fontSize: 15,
    marginBottom: 2,
  },
  valor: {
    color: '#3b0764',
    fontWeight: 'bold',
    fontSize: 15,
  },
});