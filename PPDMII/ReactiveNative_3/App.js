import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { TextInput, Divider, Text } from "react-native-paper";

export default function App() {
  const [cep, setCep] = useState("");
  const [dadosCep, setDadosCep] = useState([]);

  const buscaCep = (value) => {
    let url = `https://viacep.com.br/ws/${value}/json/`;
    let formataCep = value.replace(/\D/g, "");
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setDadosCep(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar CEP:", error);
      });
  };

  // Função para deletar os dados do CEP
  const deletarCep = () => {
    setCep("");
    setDadosCep([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.labelCep}>Digite o CEP:</Text>
      <TextInput
        style={styles.inputCep}
        label="CEP"
        placeholder="12345678"
        keyboardType="numeric"
        onChangeText={setCep}
        value={cep}
      />
      <Pressable style={styles.botaoBuscar} onPress={() => buscaCep(cep)}>
        <Text style={styles.textoBotao}>Buscar CEP</Text>
      </Pressable>

      {dadosCep.length === 0 ? (
        <Text style={styles.naoEncontrado}>CEP não encontrado</Text>
      ) : (
        <View style={styles.resultado}>
          <TextInput
            label="CEP"
            value={dadosCep.cep || ""}
            style={styles.campoResultado}
            editable={false}
          />
          <TextInput
            label="Rua"
            value={dadosCep.logradouro || ""}
            style={styles.campoResultado}
            editable={false}
          />
          <TextInput
            label="Bairro"
            value={dadosCep.bairro || ""}
            style={styles.campoResultado}
            editable={false}
          />
          <TextInput
            label="Cidade"
            value={dadosCep.localidade || ""}
            style={styles.campoResultado}
            editable={false}
          />
          <TextInput
            label="Estado"
            value={dadosCep.uf || ""}
            style={styles.campoResultado}
            editable={false}
          />
          <Pressable style={styles.botaoDeletar} onPress={deletarCep}>
            <Text style={styles.textoDeletar}>Deletar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center", // Centraliza horizontalmente
    justifyContent: "center", // Centraliza verticalmente
    padding: 16,
  },
  labelCep: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  inputCep: {
    height: 40,
    width: 220,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  botaoBuscar: {
    backgroundColor: "blue",
    borderRadius: 5,
    marginTop: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultado: {
    marginTop: 20,
    backgroundColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    width: 250,
    alignItems: "center",
  },
  campoResultado: {
    marginBottom: 10,
    width: 220,
    backgroundColor: "#fff",
    textAlign: "center",
  },
  botaoDeletar: {
    marginTop: 10,
    backgroundColor: "red",
    borderRadius: 5,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  textoDeletar: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  naoEncontrado: {
    marginTop: 20,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
});
