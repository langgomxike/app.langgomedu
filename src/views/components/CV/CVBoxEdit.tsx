import { View, StyleSheet, Text, TouchableOpacity, Modal, Button } from "react-native";
import HLine, { HLineType } from "../HLine";
import { Children, ReactNode, useState } from "react";
import { BackgroundColor, BorderColor, TextColor } from "../../../configs/ColorConfig";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Education from "../../../models/Education";
import Experience from "../../../models/Experience";
import Skill from "../../../models/Skill";
import Certificate from "../../../models/Certificate";
import Feather from '@expo/vector-icons/Feather';


export type CvBoxProps = {
    title: string,
    children?: ReactNode,
    onAddItem: (item: Education | Experience | Skill | Certificate) => void,
    typeItem: "education" | "experience" | "skills" | "certificate"

}

const CvBoxEdit = ({ title, children, onAddItem }: CvBoxProps) => {

    //state
    const [modalVisible, setModalVisible] = useState(false)

    //handler
    const handleClickAddItem = () => {
        // onAddItem();
    }


    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.title}>{title}</Text>
                <HLine type={HLineType.LIGHT} />
                <View style={styles.children}>
                    {children}
                </View>
            </View>
            <View style={styles.addButtonBox}>
                <TouchableOpacity onPress={() => { setModalVisible(true) }} style={styles.addButton}>
                    <FontAwesome6 name="add" size={24} color={TextColor.white} />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBackground}>
                        <Feather name="x" size={24} color="black" onPress={()=>{setModalVisible(false)}}/>
                        <View style={styles.modalContent}>
                            <Text>Hello</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

    )
}
export default CvBoxEdit

const styles = StyleSheet.create({
    container: {

    },
    box: {
        marginVertical: 5,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: BackgroundColor.white,
        borderColor: BackgroundColor.gray_e6,
        elevation: 2,
        paddingBottom: 20,
    },
    title: {
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold'
    },
    children: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    addButtonBox: {
        height: 20
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 999,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BackgroundColor.primary,
        position: 'absolute',
        right: "0%",
        bottom: "75%",
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackground:{
        width: 320,
        padding: 20,
        backgroundColor: BackgroundColor.white,
        borderRadius: 10,
        // justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    modalContent: {
        width: "100%",
        marginTop: 10,
        // borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
    },
})

