import { Image, View, StyleSheet, Text } from "react-native"


const ExperienceItem = () => {
    return (
        <View style={styles.box}>
            <View style={styles.iconBox}>
                <Image
                    style={styles.icon}
                    source={require("../../../../assets/avatar/account_tab.png")} />
            </View>
            <View style={styles.textBox}>
                <Text style={styles.title}> this is title</Text>
                <Text style={styles.description}> description </Text>
                <Text> Jan 2021 - mar 2023 | 2 yrs 2 mons  </Text>
            </View>
        </View>
    )
}
export default ExperienceItem;

const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
    },
    icon: {
        width: 40,
        height: 40,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {

    },
    textBox: {
        // borderWidth: 1,
        flex: 1,
    },
    iconBox:{
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    }
})