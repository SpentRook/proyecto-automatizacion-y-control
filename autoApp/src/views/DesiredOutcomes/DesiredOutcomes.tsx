import { useCallback, useEffect, useState } from "react";
import { InputNumber } from "../../components/InputNumber/InputNumber";
import { Title } from "../../components/Title/Title";
import { Button } from "../../components/Button/Button";
import { View } from "react-native";
import { getDesiredOutcomes, updateDesiredOutcomes } from "../../service";
import { Loader } from "../../components/Loader/Loader";
import { Text } from "../../components/Text/Text";
import { Center } from "../../components/Center/Center";

const DesiredOutcomes = () => {
  const [temperature, setTemperature] = useState(20);
  const [humidity, setHumidity] = useState(50);
  const [luminosity, setLuminosity] = useState(800);
  const [edit, setEdit] = useState(false);
  const [loader, setLoader] = useState(false);
  const [openError, setOpenError] = useState(false);

  const sendDesiredOutcomes = useCallback(async () => {
    const dataToSend = {
      soil_mestiure: humidity,
      light_level: luminosity,
      temperature: temperature,
    };

    setLoader(true);
    try {
      await updateDesiredOutcomes(dataToSend);
      setEdit(false);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  }, [
    temperature,
    setTemperature,
    humidity,
    setHumidity,
    luminosity,
    setLuminosity,
  ]);

  useEffect(() => {
    if (
      validateRanges(18, 30, temperature.toString()) ||
      validateRanges(0, 85, humidity.toString()) ||
      validateRanges(500, 1000, luminosity.toString())
    ) {
      setOpenError(true);
    } else {
      setOpenError(false);
    }
  }, [
    temperature,
    humidity,
    luminosity,
    setTemperature,
    setHumidity,
    setLuminosity,
  ]);

  const validateRanges = (
    rangeLess: number,
    rangeHigh: number,
    value: string
  ): boolean => {
    return parseInt(value) < rangeLess || parseInt(value) > rangeHigh;
  };

  const getDO = async () => {
    try {
      const { data } = await getDesiredOutcomes();
      console.log(data);
      const { soil_mestiure, light_level, temperature } = data;
      if (data) {
        setTemperature(temperature);
        setHumidity(soil_mestiure);
        setLuminosity(light_level);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDO();
    setInterval(() => {
      getDO();
      console.log("Actualizando valores deseados...");
      console.log("");
    }, 15000);
  }, []);

  return (
    <>
      <Title>{"Valores deseados"}</Title>
      {/* 18°C - 30°C */}
      {/* Actual: 15°C */}
      <InputNumber
        label={"Valor temperatura deseada (18°C - 30°C)"}
        value={temperature.toString()}
        onChange={setTemperature}
        increaseFn={() => {
          edit
            ? temperature < 30
              ? setTemperature(temperature + 1)
              : undefined
            : undefined;
        }}
        decreaseFn={() =>
          edit
            ? temperature > 18
              ? setTemperature(temperature - 1)
              : undefined
            : undefined
        }
        editable={edit}
      />
      {/* 0% - 85% */}
      {/* Actual: 50% */}
      <InputNumber
        label={"Valor humedad deseada (0% - 85%)"}
        value={humidity.toString()}
        onChange={setHumidity}
        increaseFn={() =>
          edit
            ? humidity < 85
              ? setHumidity(humidity + 1)
              : undefined
            : undefined
        }
        decreaseFn={() =>
          edit
            ? humidity > 0
              ? setHumidity(humidity - 1)
              : undefined
            : undefined
        }
        editable={edit}
      />
      {/* 500 lux - 1000 lux */}
      {/* Actual: 800 lux */}
      <InputNumber
        label={"Valor de luminosidad deseada (500 lux - 1000 lux)"}
        value={luminosity.toString()}
        onChange={setLuminosity}
        increaseFn={() =>
          edit
            ? luminosity < 1000
              ? setLuminosity(luminosity + 1)
              : undefined
            : undefined
        }
        decreaseFn={() =>
          edit
            ? luminosity > 500
              ? setLuminosity(luminosity - 1)
              : undefined
            : undefined
        }
        editable={edit}
        numberLength={4}
      />
      {openError && (
        <Center>
          <Text color={"red"} size={16} weight={"bold"}>
            {"Error, rangos inválidos"}
          </Text>
        </Center>
      )}
      {edit ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {loader ? (
            <Loader />
          ) : (
            <>
              <Button
                text={"Cancelar"}
                onPress={() => setEdit(false)}
                varStyles={{ backgroundColor: "red", width: "48%" }}
              />
              <Button
                text={"Guardar"}
                onPress={sendDesiredOutcomes}
                disabled={openError}
                varStyles={{ width: "48%" }}
              />
            </>
          )}
        </View>
      ) : (
        <Button text={"Actualizar"} onPress={() => setEdit(true)} />
      )}
    </>
  );
};

export { DesiredOutcomes };
