import { TextInput, View } from "react-native";
import { Text } from "../Text/Text";
import { Dispatch, SetStateAction } from "react";
import { styles } from "./styles";
import { Button } from "../Button/Button";
import { Center } from "../Center/Center";

interface Props {
  label: string;
  value: string;
  numberLength?: number;
  editable?: boolean;
  onChange?: Dispatch<SetStateAction<number>>;
  increaseFn: () => void;
  decreaseFn: () => void;
}

const InputNumber = ({
  label,
  value,
  numberLength = 2,
  editable = false,
  onChange,
  increaseFn,
  decreaseFn,
}: Props) => {
  return (
    <View style={styles.container}>
      <Center>
        <Text weight={"bold"} size={14}>
          {label}
        </Text>
      </Center>
      <View style={styles.inputNumberContainer}>
        <Button text={"-"} onPress={decreaseFn} varStyles={{ width: "15%" }} />
        <TextInput
          keyboardType={"numeric"}
          maxLength={numberLength}
          style={styles.inputContainer}
          onChangeText={(val) =>
            onChange ? onChange(parseInt(val)) : undefined
          }
          value={Number.isNaN(parseInt(value)) ? "" : value}
          editable={editable}
        />
        <Button text={"+"} onPress={increaseFn} varStyles={{ width: "15%" }} />
      </View>
    </View>
  );
};

export { InputNumber };
