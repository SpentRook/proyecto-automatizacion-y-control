import { View } from "react-native";
import { Text } from "../Text/Text";
import { styles } from "./styles";

interface Props {
  children: React.ReactNode;
}

const Title = ({ children }: Props) => {
  return (
    <View style={styles.container}>
      <Text weight={"bold"} size={25}>
        {children}
      </Text>
    </View>
  );
};

export { Title };
