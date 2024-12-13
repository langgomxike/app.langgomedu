import { Text, View } from 'react-native'
import React, { useContext } from 'react'
import { LanguageContext } from '../../../configs/LanguageConfig'

export default function Information() {

  // context
  const language = useContext(LanguageContext).language;

    return (
      <View>
        <Text>{language.INFORMATION}</Text>
      </View>
    )
}
