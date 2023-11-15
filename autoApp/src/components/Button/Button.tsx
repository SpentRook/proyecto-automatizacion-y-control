import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "../Text/Text";
import { styles } from "./styles";

interface Props {
  text?: string;
  onPress: () => void;
  varStyles?: StyleProp<ViewStyle>;
  textColor?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button = ({
  text,
  onPress,
  varStyles,
  textColor,
  disabled,
  children,
}: Props) => {
  const disableStyle = disabled
    ? {
        opacity: 0.6,
      }
    : undefined;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, varStyles, disableStyle]}
      disabled={disabled}
    >
      <View style={styles.contentContainer}>
        {children}
        {text && (
          <Text
            size={16}
            weight={"bold"}
            color={textColor ? textColor : undefined}
            textStyle={disableStyle}
          >
            {text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export { Button };
