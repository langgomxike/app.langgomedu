import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
export default function TypingEffect() {
  const [displayText, setDisplayText] = useState("");
  const typingSpeed = 120; 
  const resetDelay = 5000;
  const texts = ["Chào mừng!", "Welcome!", "ようこそ！"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let index = 0;
    let interval: NodeJS.Timeout | null = null;

    const typeText = () => {
      setDisplayText("");
      index = 0;

      interval = setInterval(() => {
        if (index < texts[currentIndex].length) {          
          setDisplayText((prev) => prev + texts[currentIndex][index]);
          index++;
        } else {
          clearInterval(interval!);
          interval = null;
          
          // Sau khi gõ xong một chuỗi, chuyển sang chuỗi tiếp theo sau `resetDelay`
          setTimeout(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);
          }, resetDelay);
        }
      }, typingSpeed);
    };

    typeText();

    // Clear interval khi component unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentIndex]);

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