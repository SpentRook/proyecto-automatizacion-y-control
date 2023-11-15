import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { LineChart as LN } from "react-native-chart-kit";
import { styles } from "./styles";
import { InputNumber } from "../InputNumber/InputNumber";
import { DataObject } from "../../types/thingsSpeakData";
import { setData } from "../../utils/data";
import { Text } from "../Text/Text";
import { Center } from "../Center/Center";

interface Props {
  label: string;
  data: DataObject[];
  legends: string[];
  outcome: "field1" | "field2" | "field3";
}

const LineChart = ({ label, data, legends, outcome }: Props) => {
  const screenWidth = Dimensions.get("window").width;

  const [lengthValue, setLengthValue] = useState<number>(10);

  const dataCompleted = {
    labels: setData(data, "created_at", lengthValue) as string[],
    datasets: [
      {
        data: setData(data, outcome, lengthValue) as number[],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: legends,
  };

  const chartConfig = {
    backgroundGradientFrom: "white",
    backgroundGradientFromOpacity: 0.5,
    backgroundGradientTo: "white",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
    strokeWidth: 3,
    barPercentage: 1,
    useShadowColorFromDataset: false,
  };

  return (
    <>
      <View style={styles.container}>
        <Center>
          <Text weight={"bold"} size={18}>
            {label}
          </Text>
        </Center>
        <View
          style={{
            width: "100%",
            borderBottomWidth: 2,
            borderBottomColor: "#E4D9BF",
            paddingTop: 5,
          }}
        />
        <ScrollView horizontal={true}>
          <LN
            data={dataCompleted}
            width={lengthValue > 8 ? lengthValue * 50 : screenWidth}
            height={300}
            chartConfig={chartConfig}
            yLabelsOffset={20}
          />
        </ScrollView>
        <InputNumber
          label={"Mostrar los últimos datos"}
          increaseFn={() =>
            lengthValue < 50 ? setLengthValue(lengthValue + 1) : undefined
          }
          value={lengthValue.toString()}
          decreaseFn={() =>
            lengthValue > 0 ? setLengthValue(lengthValue - 1) : undefined
          }
        />
      </View>
    </>
  );
};

export { LineChart };
