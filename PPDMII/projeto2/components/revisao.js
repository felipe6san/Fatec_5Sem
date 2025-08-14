import React, {useState} from "react"; 
import { View, Text, TextInput } from "react-native";

const Campos=() =>{
    let label = "Nome: ";
    const [campo, setCampo] = useState("");

    return(
        <View>
            <Text>{label}</Text>
            <TextInput
            onChangeText={(text) => {setCampo(text)}}
            />
            <Text>Digitado {campo}</Text>
        </View>
    );
}

export default Campos;