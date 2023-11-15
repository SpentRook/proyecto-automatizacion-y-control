import { Text as NText, StyleProp, ViewStyle } from "react-native";
import type { Weight } from "../../types/fonts";

interface Props {
  children: React.ReactNode;
  weight?: Weight;
  size?: number;
  color?: string;
  textStyle?: StyleProp<ViewStyle>;
  initial?: string;
}

const Text = ({
  children,
  weight = "normal",
  size = 12,
  color = "black",
  textStyle,
  initial,
}: Props): JSX.Element => {
  return (
    <>
      <NText>
        {initial && (
          <NText
            style={{ fontWeight: "bold", fontSize: size }}
          >{`${initial}: `}</NText>
        )}
        <NText
          style={[
            { fontWeight: weight, fontSize: size, color: color },
            textStyle,
          ]}
        >
          {children}
        </NText>
      </NText>
    </>
  );
};

export { Text };
