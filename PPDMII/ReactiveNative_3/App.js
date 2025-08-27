import { useState } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { TextInput, Text } from "react-native-paper";

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
        keyboardType="numeric"
        onChangeText={setCep}
        value={cep}
        theme={{ colors: { primary: "#1976d2" } }}
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
            theme={{ colors: { primary: "#1976d2" } }}
          />
          <TextInput
            label="Rua"
            value={dadosCep.logradouro || ""}
            style={styles.campoResultado}
            editable={false}
            theme={{ colors: { primary: "#1976d2" } }}
          />
          <TextInput
            label="Bairro"
            value={dadosCep.bairro || ""}
            style={styles.campoResultado}
            editable={false}
            theme={{ colors: { primary: "#1976d2" } }}
          />
          <TextInput
            label="Cidade"
            value={dadosCep.localidade || ""}
            style={styles.campoResultado}
            editable={false}
            theme={{ colors: { primary: "#1976d2" } }}
          />
          <TextInput
            label="Estado"
            value={dadosCep.uf || ""}
            style={styles.campoResultado}
            editable={false}
            theme={{ colors: { primary: "#1976d2" } }}
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
    backgroundColor: "#e3f2fd", 
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  labelCep: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#1976d2", 
  },
  inputCep: {
    height: 40,
    width: 220,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff",
    textAlign: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90caf9", 
  },
  botaoBuscar: {
    backgroundColor: "#1976d2", 
    borderRadius: 5,
    marginTop: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textoBotao: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  resultado: {
    marginTop: 20,
    backgroundColor: "#bbdefb", 
    padding: 16,
    borderRadius: 10,
    width: 270,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#90caf9",
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  campoResultado: {
    marginBottom: 10,
    width: 220,
    backgroundColor: "#e3f2fd", 
    textAlign: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#90caf9",
  },
  botaoDeletar: {
    marginTop: 10,
    backgroundColor: "#ef5350", 
    borderRadius: 5,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "black",
    shadowColor: "#ef5350",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  textoDeletar: {
    color: "white",
    padding: 10,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  naoEncontrado: {
    marginTop: 20,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    backgroundColor: "#fffde7", 
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffe082",
  },
});
