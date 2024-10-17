import React, { useState } from "react";
import { View } from "react-native";
import CustomInput from "./Inputs/CustomInput";

const InfoClass = () => {
    
    const [title, setTitle] = useState('');

    return (
        <View>
            <CustomInput placeholder="nhập tiêu đề..." type="text" label="Tiêu đề" onChangeText={setTitle} required/>
            <CustomInput placeholder="nhập tiêu đề..." type="textarea" label="Tiêu đề" onChangeText={setTitle} required/>
            
        </View>
    );
}

export default InfoClass;