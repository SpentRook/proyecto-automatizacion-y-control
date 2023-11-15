import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from "react-native";
import { Header } from "../Header/Header";

interface Props {
  children: React.ReactNode;
  isGoBack?: () => void;
  varStyles?: StyleProp<ViewStyle>;
}

const Screen = ({ children, isGoBack, varStyles }: Props): JSX.Element => {
  return (
    <SafeAreaView style={{ height: "100%", width: "100%" }}>
      <StatusBar barStyle={"dark-content"} />
      <Header goBack={isGoBack} />
      <ScrollView contentContainerStyle={{ minHeight: "80%" }}>
        <View style={[varStyles, { padding: 16 }]}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export { Screen };
