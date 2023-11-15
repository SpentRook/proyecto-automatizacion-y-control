import { View } from "react-native";
import { DesiredOutcomes } from "../DesiredOutcomes/DesiredOutcomes";
import { Button } from "../../components/Button/Button";
import { Screen } from "../../components/Screen/Screen";
import { styles } from "./styles";
import { logOut } from "../../utils/auth";
import { Dashboard } from "../Dashboard/Dashboard";
import { useCallback } from "react";
import { Title } from "../../components/Title/Title";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { TAppViewProps } from "../../navigation/App/types";
import { Section } from "../../components/Section/Section";
import { Center } from "../../components/Center/Center";

const Landing = ({
  navigation: { navigate },
}: TAppViewProps<"Landing">): JSX.Element => {
  const goToAnalyzer = useCallback(() => {
    navigate("Analyzer");
  }, [navigate]);

  return (
    <>
      <Screen>
        <View style={styles.container}>
          <Title>{"Dashboard"}</Title>
          <Section>
            <Dashboard />
          </Section>
          <Section>
            <DesiredOutcomes />
          </Section>
          <Section>
            <Title>{"Analizar planta"}</Title>
            <Center>
              <Entypo name="network" size={60} color="black" />
            </Center>
            <Button
              text={"Realizar análisis"}
              onPress={goToAnalyzer}
              varStyles={{ marginTop: 20 }}
            >
              <Ionicons name="analytics" size={20} color="black" />
            </Button>
          </Section>
          <Button
            text={"Cerrar sesión"}
            onPress={logOut}
            varStyles={{ marginTop: 20, backgroundColor: "red" }}
          />
        </View>
      </Screen>
    </>
  );
};

export { Landing };
