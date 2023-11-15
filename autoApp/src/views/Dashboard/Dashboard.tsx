import { LineChart } from "../../components/LineChart/LineChart";
import { useEffect, useState } from "react";
import { DataObject } from "../../types/thingsSpeakData";
import { Loader } from "../../components/Loader/Loader";
import { getDataFromThingsSpeak } from "../../service";
import { View } from "react-native";
import { styles } from "./styles";

const Dashboard = (): JSX.Element => {
  const [dataChart, setDataChart] = useState<DataObject[] | undefined>(
    undefined
  );

  const getData = async () => {
    try {
      const { data } = await getDataFromThingsSpeak();
      setDataChart(data.feeds);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
    setInterval(() => {
      getData();
      console.log("****************************************************");
      console.log("Realizando petición para actualizar las gráficas...");
    }, 15000);
  }, []);

  return (
    <>
      {dataChart ? (
        <>
          <View style={styles.container}>
            <LineChart
              label={"Luminosidad"}
              data={dataChart}
              legends={["Registros"]}
              outcome={"field1"}
            />
            <LineChart
              label={"Nivel de humedad del suelo"}
              data={dataChart}
              legends={["Registros"]}
              outcome={"field2"}
            />
            <LineChart
              label={"Temperatura"}
              data={dataChart}
              legends={["Registros"]}
              outcome={"field3"}
            />
          </View>
        </>
      ) : (
        <Loader size={"large"} />
      )}
    </>
  );
};

export { Dashboard };
