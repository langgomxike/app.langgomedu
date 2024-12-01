import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
type TypingEffectProps = {
  typingText: string,
}
export default function TypingEffect({typingText}: TypingEffectProps) {
  const text = typingText;
  const [displayText, setDisplayText] = useState("");
  const typingSpeed = 150; 
  const resetDelay = 10000;

  useEffect(() => {
    let index = 0;
    setDisplayText("");

    // Hàm để thực hiện gõ chữ
    const typeText = () => {
      index = 0;
      setDisplayText("");

      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayText((prev) => prev + text[index]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(typeText, resetDelay);
        }
      }, typingSpeed);
    };

    typeText();

  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.typingText}>{displayText}</Text>
    </View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typingText: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 2 }, 
    textShadowRadius: 4,
  },
});