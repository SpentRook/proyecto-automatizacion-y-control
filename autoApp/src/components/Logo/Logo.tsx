import { View, Image } from "react-native";
import { styles } from "./styles";

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/Smart_Greenhouses-Logo.png")} />
    </View>
  );
};

export { Logo };
