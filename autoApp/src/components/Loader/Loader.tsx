import { ActivityIndicator, View } from "react-native";
import { styles } from "./styles";

interface Props {
  size?: "small" | "large";
}

const Loader = ({ size = "small" }: Props) => (
  <View style={[styles.container, styles.horizontal]}>
    <ActivityIndicator size={size} color={"#E4D9BF"} />
  </View>
);

export { Loader };
