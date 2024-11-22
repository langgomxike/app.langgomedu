import React, { useContext } from 'react';
import { TextInput, StyleSheet, View, Image } from 'react-native';
import { LanguageContext } from "../../../configs/LanguageConfig";
type InputProps = {
    value: string,
    onChangeText: (text:string) => void;
    style?: object
}
export default function SearchBar({
    value,
    onChangeText,
    style
  }:InputProps){
    const languageContext = useContext(LanguageContext);


    return (
        <View style={[styles.textInputBox, styles.shadowProp, style]}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2801/2801881.png",
          }}
          style={styles.inputImage}
        />
        <TextInput 
        style={[styles.textInput]} 
        value={value}
        onChangeText={onChangeText}
        placeholder= {languageContext.language.SEARCH}
        placeholderTextColor="#888" 
        />
      </View>
    );
  };

const styles = StyleSheet.create({
    textInputBox: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        backgroundColor: "#fff",
        borderRadius: 999,
      },
    
      shadowProp: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
    
      inputImage: {
        width: 25,
        height: 25,
        marginHorizontal: 10,
      },
    
      textInput: {
        flex: 1,
        padding: 5,
      },
});