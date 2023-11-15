import { KeyboardTypeOptions, TextInput, View } from "react-native";
import { Text } from "../Text/Text";
import { Dispatch, SetStateAction } from "react";
import { styles } from "./styles";

interface Props {
  label: string;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  secure?: boolean;
  type?: KeyboardTypeOptions;
}

const Input = ({
  label,
  value,
  onChange,
  secure = false,
  type = "default",
}: Props) => {
  return (
    <View style={styles.container}>
      <Text weight={"bold"} size={14}>
        {label}
      </Text>
      <TextInput
        style={styles.inputContainer}
        keyboardType={type}
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
      />
    </View>
  );
};

export { Input };
