import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, ViewStyle } from "react-native";

type ratingProps = {
    style?: ViewStyle,
    onRatingChange: (rating: number) => void,
}

const Rating = ({style,onRatingChange} : ratingProps) => {
    //define
    const star = require('../../../assets/ic_star_outline.png')
    const star_active = require('../../../assets/ic_star.png')
    const maxStar: number = 5

    const [activeStars, setActiveStars] = useState(0)

    const handleStarClick = (index: number) => {
        var stars :number = activeStars === (index + 1) ? 0 : (index + 1)
        setActiveStars(stars)
        onRatingChange(stars)
    }


    return (
        <View style={[styles.container, style]}>
            {Array.from({ length: maxStar }).map((_, index) => (
                <TouchableOpacity key={index} onPress={() => handleStarClick(index)}>
                    <Image source={index < activeStars ? star_active : star} style={styles.star} />
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center'
    },
    star: {
        marginLeft: 3,
        marginRight: 3,
        width: 30,
        height: 30,
    }
})

export default Rating;