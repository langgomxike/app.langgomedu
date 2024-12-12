import { Text, View } from 'react-native'
import React, { Component, useContext } from 'react'
import { LanguageContext } from '../../../configs/LanguageConfig';

export default function PersonalRatings() {
    const language = useContext(LanguageContext).language;

    return (
        <View>
            <Text>{language.PERSONALRATINGS}</Text>
        </View>
    )
}

