import { View } from "react-native";
import { colors } from "../../utils/colors";

interface Props {
  children: React.ReactNode;
}

const Section = ({ children }: Props): JSX.Element => {
  return (
    <>
      <View>
        {children}
        <View
          style={{
            borderBottomColor: colors.secondary,
            borderBottomWidth: 5,
            marginTop: 30,
            marginBottom: 6,
          }}
        />
        <View
          style={{
            borderBottomColor: colors.secondary,
            borderBottomWidth: 5,
          }}
        />
      </View>
    </>
  );
};

export { Section };
