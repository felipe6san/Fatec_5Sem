import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native"; // Corrigido: Pressable

export default function App() {
  const [cep, setCep] = useState("");

  const buscaCep = (value) => {
    let url = `https://viacep.com.br/ws/${value}/json/`;
    fetch(url)
      .then((response) => { return response.json() })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar CEP:", error);
      });
  }

  return (
    <View style={styles.container}>
      <Text>Digite o CEP:</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          width: 200,
          marginTop: 10,
        }}
        placeholder="123456789"
        keyboardType="numeric"
        onChangeText={(text) => {
          setCep(text);
        }}
      />
      <Pressable
        style={{
          backgroundColor: "#2196F3",
          padding: 10,
          marginTop: 10,
        }}
        onPress={() => {
          buscaCep(cep);
        }}
      >
        <Text style={{ color: "#fff" }}>Buscar CEP</Text>
      </Pressable>
    </View>
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