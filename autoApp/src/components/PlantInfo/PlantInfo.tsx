import { View, Image, ScrollView } from "react-native";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";
import { AntDesign } from "@expo/vector-icons";
import { Center } from "../Center/Center";
import { getRecommendedValues } from "../../utils/recommendedValues";
import { useEffect, useState } from "react";
import { requestAPI } from "../../types/requestAPI";

interface Props {
  plantName: string | null;
  porcentageImg: number | null;
  description: string | null;
  commonNames: string[] | null;
  substract: () => void;
  add: () => void;
  index: number;
  otherSug: boolean;
}

const PlantInfo = ({
  plantName,
  porcentageImg,
  description,
  commonNames,
  substract,
  add,
  index,
  otherSug,
}: Props): JSX.Element => {
  const [recommendedV, setRecommendedV] = useState<requestAPI | null>(null);

  useEffect(() => {
    if (plantName) {
      const result = getRecommendedValues(plantName);
      setRecommendedV(result === undefined ? null : result[1]);
    }
  }, []);

  return (
    <>
      <View style={{ marginTop: 20 }}>
        <View>
          <Center>
            <Text size={22} weight={"bold"}>
              {plantName ? plantName : "No fue proveído"}
            </Text>
          </Center>
          <Text initial={"Descripción"}>
            {description ? description : "No fue proveído"}
          </Text>
          <Text initial={"Porcentaje de similitud"}>
            {porcentageImg
              ? `${(porcentageImg * 100).toFixed(2)}%`
              : "No fue proveído"}
          </Text>
          {commonNames && (
            <ScrollView
              contentContainerStyle={{ maxHeight: 100, height: "auto" }}
            >
              <Text weight={"bold"}>{"Otros nombres"}</Text>
              {commonNames.map((name, index) => {
                return (
                  <Text key={index} initial={(index + 1).toString()}>
                    {name}
                  </Text>
                );
              })}
            </ScrollView>
          )}
        </View>
        <View>
          <Center>
            <Text size={16} weight={"500"}>
              {"Valores recomendados"}
            </Text>
          </Center>
          <Text initial={"Nivel de humedad del suelo"}>
            {recommendedV ? `${recommendedV?.soil_mestiure}%` : "No proveído"}
          </Text>
          <Text initial={"Nivel de luminosidad"}>
            {recommendedV ? `${recommendedV?.light_level} lux` : "No proveído"}
          </Text>
          <Text initial={"Nivel de temperatura"}>
            {recommendedV ? `${recommendedV?.temperature}°C` : "No proveído"}
          </Text>
        </View>

        {otherSug && (
          <>
            <Center>
              <Text size={16} weight={"500"}>
                {"Conocer otras sugerencias"}
              </Text>
            </Center>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
              }}
            >
              <Button
                onPress={substract}
                varStyles={{ padding: 4, height: 30 }}
              >
                <AntDesign name="caretleft" size={20} color="black" />
              </Button>
              <Text size={16} weight={"bold"}>
                {index}
              </Text>
              <Button onPress={add} varStyles={{ padding: 4, height: 30 }}>
                <AntDesign name="caretright" size={20} color="black" />
              </Button>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export { PlantInfo };
