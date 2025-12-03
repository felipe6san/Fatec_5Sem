import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { criaBanco, criaTabela, inserirDados, listarDados } from "./config/bd";
import { useEffect } from "react";

export default function App() {
  const main = async () => {
    const db = await criaBanco();
    if (db) {
      criaTabela(db);
      inserirDados(db, "João Silva", "joao.silva@example.com");
      const usuarios = await listarDados(db);

      type Usuario = {
        ID_US: number;
        NOME_US: string;
        EMAIL_US: string;
      };

      if(usuarios && usuarios.length > 0) {
        for (const usuario of usuarios as Usuario[]) {
          console.log(`ID: ${usuario.ID_US}, Nome: ${usuario.NOME_US}, Email: ${usuario.EMAIL_US}`);
        }
      }
    } else {
      console.log("Erro ao criar tabela banco nâo inicializado");
    }
  };

  useEffect(() => {
    main();
  }, []);

  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
