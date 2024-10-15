import React, { useContext, useRef, useState } from 'react';
import { TextInput, View, StyleSheet ,Image,Text} from 'react-native';
import Button from '../components/Button';
import { NavigationContext } from '@react-navigation/native';
import ScreenName from '../../constants/ScreenName';
import MyText from '../components/MyText';
import MyIcon, { AppIcon } from '../components/MyIcon';

const OTPInput: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const navigation =useContext(NavigationContext);
  function goBack(): void {
    navigation?.goBack();
  }
  function goChangePassword(): void {
    navigation?.navigate(ScreenName.CHANGEPASSWORD);
  }
// Xử lý khi nhập vào ô
const handleInputChange = (value: string, index: number) => {
  // Kiểm tra chỉ cho phép nhập số
  if (/^[0-9]$/.test(value)) {
    const newOtp = [...otp];

    // Nếu ô đầu tiên chưa được nhập thì focus vào ô đầu tiên
  if (otp[0] === '' && index !== 0) {
    inputRefs.current[0]?.focus();
    return;
  }

  // Không cho phép nhập vào ô sau khi các ô trước đó chưa điền
  for (let i = 1; i <= index; i++) {
    if (newOtp[i - 1] === '') {
      inputRefs.current[i - 1]?.focus();
      return;
    }
  }
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển sang ô tiếp theo nếu có số được nhập
    if (index < 5 && value) {
      inputRefs.current[index + 1]?.focus();
    }
  }
};

  // Xử lý khi nhấn nút xóa
  const handleKeyPress = (e: any, index: number) => {
    const newOtp = [...otp];

    // Nếu ô hiện tại trống và người dùng nhấn Backspace
    if (e.nativeEvent.key === 'Backspace') {
      if (newOtp[index] === '' && index > 0) {
        // Xóa giá trị của ô trước đó
        newOtp[index - 1] = '';
        setOtp(newOtp);

        // Focus về ô trước
        inputRefs.current[index - 1]?.focus();
      } else {
        // Xóa giá trị của ô hiện tại
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  return (
    <View style={styles.container}>
<View style={styles.icon}>
      <MyIcon icon={AppIcon.back_button} size='30' onPress={goBack}></MyIcon>
      <Text style={styles.screenName}> Nhập Mã Xác Thực</Text>

      </View>
      <Image style={styles.img} source={require('../../../assets/images/ illustration/Mobile login-rafiki.png')}></Image>
      <Text style={styles.text}>Vui lòng nhập mã xác thực mà chúng tôi đã gửi qua số điện thoại của bạn</Text>
    <View style={styles.otpContainer}>

      {otp.map((value, index) => (
        <TextInput
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={value}
          onChangeText={(text) => handleInputChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          style={styles.otpInput}
          keyboardType="number-pad"
          maxLength={1}
        />
      ))}
    </View>
    <Button title='Tiếp tục' textColor='white' backgroundColor='#0D99FF' onPress={goChangePassword}></Button>
    <MyText text='Bạn chưa nhận được OTP?' ></MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container:
  {
alignItems: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
    marginVertical: 20,
  },
   otpInput: {
    borderWidth: 2,        // Độ dày của đường viền
    borderColor: '#000',    // Màu sắc của đường viền (ở đây là màu đen)
    borderRadius: 5,        // Bo tròn các góc của khung
    padding: 10,            // Khoảng cách bên trong khung
    textAlign: 'center',    // Căn giữa văn bản
    fontSize: 20, 
    marginLeft:5,
    marginRight:5,          // Kích thước chữ
    marginBottom:20,
    width: 45,   
    height:60,           // Độ rộng của khung
  },
  img:{
    width: 250,
    height: 250,
    resizeMode: 'contain',
    
  },
  text:{
    width:'60%',
    textAlign: 'center',
    marginBottom: 40,

  },
  icon:{
    flexDirection: 'row',
    left:'-18%',
  },
  screenName:{
  fontSize: 20,
  }
});

export default OTPInput;
