// import React, { useState } from "react";
// import {
//   Text,
//   TextInput,
//   View,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker, {
//   DateTimePickerEvent,
// } from "@react-native-community/datetimepicker";

// type CustomInputProps = {
//   label: string;
//   required: boolean;
//   value?: string;
//   onChangeText: (text: string) => void;
//   placeholder: string;
//   type: "text" | "number" | "password" | "email" | "phone" | "date";
//   editable?: boolean;
//   style?: object;
//   iconName: string;
// };

// const GRAY_DISABLE = "#EEE";

// const images = [
//   {
//     name: "phone",
//     source: require("../../../../assets/images/register_icon/ic_phone (1).png"),
//   },
//   {
//     name: "calendar",
//     source: require("../../../../assets/images/register_icon/ic_calendar.png"),
//   },
//   {
//     name: "email",
//     source: require("../../../../assets/images/register_icon/ic_mail.png"),
//   },
//   {
//     name: "password",
//     source: require("../../../../assets/images/register_icon/ic_lock.png"),
//   },
// ];

// export default function customInput({
//   label,
//   required,
//   value,
//   onChangeText,
//   placeholder,
//   type,
//   editable,
//   iconName,
//   style,
// }: CustomInputProps) {
//   const [isPasswordVisible, setPasswordVisible] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);

//   // Đặt keyboardType dựa trên loại input
//   function getKeyboardType() {
//     switch (type) {
//       case "number":
//         return "numeric";
//       case "email":
//         return "email-address";
//       case "phone":
//         return "phone-pad";
//       default:
//         return "default";
//     }
//   }

//   const handleDateChange = (
//     event: DateTimePickerEvent,
//     selectedDate?: Date
//   ) => {
//     const currentData = selectedDate ?? date;
//     setShowDatePicker(false);
//     setDate(currentData);
//     onChangeText(formatDate(currentData)); // Gọi hàm onChangeText với định dạng ngày
//   };

//   const getImageSource = (iconName: string) => {
//     const image = images.find((img) => img.name === iconName);
//     return image ? image.source : null;
//   };

//   const source = getImageSource(iconName);

//   const formatDate = (date: Date): string => {
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!isPasswordVisible);
//   };

//   return (
//     <View>
//       {/* Các loại input như: "text", "number","password", "email","phone","date" */}
//       <View style={style}>
//         <Text style={styles.label}>
//           {label}
//           {required && <Text style={styles.required}> *</Text>}
//         </Text>

//         <View style={[styles.inputBlock, styles.boxShadow]}>
//           <View style={{ flex: 1 }}>
//             <Image source={source} style={styles.inputIcon} />
//           </View>
//           <View style={[styles.inputBlock,{flex: 9}]}>
//             <TextInput
//               style={[
//                 styles.input,
//                 { flex: 9 },
//                 editable === false
//                   ? { backgroundColor: GRAY_DISABLE }
//                   : { backgroundColor: "white" },
//               ]}
//               onChangeText={onChangeText}
//               placeholder={placeholder}
//               placeholderTextColor="#888"
//               keyboardType={getKeyboardType()}
//               value={value}
//               secureTextEntry={type === "password" && !isPasswordVisible}
//               editable={type === "date" || editable == false ? false : true}
//             />
//             {/* Ẩn hiện password */}
//             {type === "password" && (
//               <TouchableOpacity
//                 onPress={togglePasswordVisibility}
//                 style={{ flex: 1 }}
//               >
//                 <Ionicons
//                   name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
//                   size={24}
//                   color="gray"
//                 />
//               </TouchableOpacity>
//             )}
//             {/* Ẩn hiện date picker */}
//             {type === "date" && (
//               <TouchableOpacity
//                 onPress={() => setShowDatePicker(true)}
//                 style={{ flex: 1 }}
//               >
//                 <Ionicons name="calendar-outline" size={24} color="gray" />
//               </TouchableOpacity>
//             )}
//             {/* Hiển thị Close x với thẻ input text */}
//             {type !== "date" && type !== "password" && (
//               <TouchableOpacity
//                 onPress={() => onChangeText("")}
//                 style={{ flex: 1 }}
//               >
//                 <Ionicons name="close-sharp" size={24} color="gray" />
//               </TouchableOpacity>
//             )}

//             {/* Xử lý hiển thị date picker */}
//             {showDatePicker && (
//               <DateTimePicker
//                 mode="date"
//                 value={date}
//                 display="default"
//                 onChange={handleDateChange}
//               />
//             )}
//           </View>
//         </View>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   inputWithIcon: {
//     borderBottomWidth: 1,
//     borderColor: "#ccc",
//   },
//   inputIcon: {
//     width: 30,
//     height: 30,
//   },
//   textAreaContainer: {
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },

//   inputTextarea: {
//     textAlignVertical: "top",
//   },

//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//     fontWeight: "600",
//   },

//   required: {
//     color: "red",
//   },

//   input: {},

//   inputBlock: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     borderRadius: 10,
//     alignItems: "center",
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },

//   boxShadow: {
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.5,
//     elevation: 5,
//   },
// });
