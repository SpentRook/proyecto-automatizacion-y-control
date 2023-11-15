import { StyleProp, View, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  viewStyles?: StyleProp<ViewStyle>;
}

const Center = ({ children, viewStyles }: Props) => {
  return (
    <>
      <View
        style={[
          {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          viewStyles,
        ]}
      >
        {children}
      </View>
    </>
  );
};

export { Center };
