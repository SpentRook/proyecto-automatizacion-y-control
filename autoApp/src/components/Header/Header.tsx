import { SafeAreaView, View } from "react-native";
import { Text } from "../Text/Text";
import { styles } from "./styles";
import React from "react";
import { Button } from "../Button/Button";
import { Octicons } from "@expo/vector-icons";

interface Props {
  goBack?: () => void;
}

const Header = ({ goBack }: Props) => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        {goBack && (
          <Button onPress={goBack} varStyles={{ padding: 4 }}>
            <Octicons name="arrow-left" size={24} color="black" />
          </Button>
        )}
        <Text size={18} weight={"bold"}>
          {"Smart Greenhouses"}
        </Text>
      </SafeAreaView>
    </>
  );
};

export { Header };
