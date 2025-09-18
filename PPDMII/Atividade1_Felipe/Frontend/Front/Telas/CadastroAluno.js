import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';

export default function CadastroAluno({ navigation }) {
  const [matricula, setMatricula] = useState('');
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [estado, setEstado] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cursos, setCursos] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const buscarCep = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      setLogradouro(data.logradouro || '');
      setCidade(data.localidade || '');
      setBairro(data.bairro || '');
      setEstado(data.uf || '');
    } catch (error) {
      setMensagem('Erro ao buscar CEP');
    }
  };

  const cadastrarAluno = async () => {
    setMensagem('');
    const aluno = {
      matricula,
      nome,
      endereco: {
        cep,
        logradouro,
        cidade,
        bairro,
        estado,
        numero,
        complemento
      },
      cursos: cursos.split(',').map(c => c.trim()).filter(c => c),
      observacoes: observacoes.trim() || undefined
    };
    try {
      const response = await fetch('http://192.168.50.117:3000/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aluno)
      });
      if (response.ok) {
        setMensagem('Aluno cadastrado com sucesso!');
        navigation.navigate('ListaAlunos', { atualiza: true });
      } else {
        setMensagem('Erro ao cadastrar aluno');
      }
    } catch (error) {
      setMensagem('Erro ao conectar com o servidor');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Aluno</Text>
      <TextInput label="Matrícula" value={matricula} onChangeText={setMatricula} style={styles.input} />
      <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput label="CEP" value={cep} onChangeText={setCep} onBlur={buscarCep} style={styles.input} keyboardType="numeric" maxLength={8} />
      <TextInput label="Logradouro" value={logradouro} onChangeText={setLogradouro} style={styles.input} />
      <TextInput label="Número" value={numero} onChangeText={setNumero} style={styles.input} keyboardType="numeric" />
      <TextInput label="Complemento" value={complemento} onChangeText={setComplemento} style={styles.input} />
      <TextInput label="Bairro" value={bairro} onChangeText={setBairro} style={styles.input} />
      <TextInput label="Cidade" value={cidade} onChangeText={setCidade} style={styles.input} />
      <TextInput label="Estado" value={estado} onChangeText={setEstado} style={styles.input} maxLength={2} />
      <TextInput label="Cursos (separados por vírgula)" value={cursos} onChangeText={setCursos} style={styles.input} />
      <TextInput label="Observações (opcional)" value={observacoes} onChangeText={setObservacoes} style={styles.input} multiline numberOfLines={3} />
      <Button
        mode="contained"
        icon="account-plus"
        buttonColor="#a78bfa"
        textColor="#3b0764"
        style={styles.botao}
        contentStyle={{ height: 48 }}
        onPress={cadastrarAluno}
      >
        Cadastrar
      </Button>
      {mensagem ? <Text style={styles.mensagem}>{mensagem}</Text> : null}
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
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#7c3aed',
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    width: 300,
    marginBottom: 10,
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a78bfa',
  },
  botao: {
    borderRadius: 8,
    marginTop: 10,
    width: 220,
    alignSelf: 'center',
    elevation: 2,
  },
  mensagem: {
    marginTop: 16,
    color: '#7c3aed',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
