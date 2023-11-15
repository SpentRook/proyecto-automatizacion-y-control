import { Image, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { Camera } from "../../components/Camera/Camera";
import { Screen } from "../../components/Screen/Screen";
import { PlantInfo } from "../../components/PlantInfo/PlantInfo";
import { Button } from "../../components/Button/Button";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { TAppViewProps } from "../../navigation/App/types";
import { ImageGallery } from "../../components/ImageGallery/ImageGallery";
import { analyzeImgs } from "../../service";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Title } from "../../components/Title/Title";
import { Text } from "../../components/Text/Text";
import { Center } from "../../components/Center/Center";
import { styles } from "./styles";
import { responseAPI } from "../../types/responseAPI";
import { Loader } from "../../components/Loader/Loader";
import { useInfoPlantAI } from "../../providers";

export interface ImageForm {
  name?: string;
  uri: string;
  type?: string;
  base64?: string;
}

const Analyzer = ({ navigation: { goBack } }: TAppViewProps<"Analyzer">) => {
  const value = useInfoPlantAI();

  const [isOpenCamera, setIsOpencamera] = useState(false);
  const [image, setImage] = useState<ImageForm | null>(null);
  const [infoAnalyzed, setInfoAnalyzed] = useState<null | responseAPI>(
    value!!.currentInfoPlantAI
  );
  const [indexSelector, setIndexSelector] = useState<number>(0);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    if (value) {
      setInfoAnalyzed(value.currentInfoPlantAI);
      if (value.currentImage) setImage({ uri: value.currentImage });
    }
  }, []);

  const analyzeImage = useCallback(async () => {
    if (image) {
      setLoader(true);
      const imageDataSend = image.base64
        ? [image.base64]
        : {
            name: image.name,
            uri: image.uri,
            type: image.type,
          };

      try {
        const { data } = await analyzeImgs(imageDataSend);
        setInfoAnalyzed(data.result);
        value?.setCurrentInfoPlantAI(data.result);
        value?.setCurrentImage(image.uri);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    }
  }, [image, setImage]);

  return (
    <>
      <Screen
        isGoBack={goBack}
        varStyles={{
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Title>{"Análisis de la planta"}</Title>
          {image ? (
            <>
              <Center>
                <Text size={16} textStyle={{ marginBottom: 10 }}>
                  {"Planta seleccionada"}
                </Text>
                <Image
                  style={{
                    width: "50%",
                    aspectRatio: "3/3",
                  }}
                  source={{ uri: image.uri }}
                />
                {loader ? (
                  <Loader size={"large"} />
                ) : (
                  infoAnalyzed &&
                  (infoAnalyzed.is_plant.probability > 0.5 ? (
                    infoAnalyzed.classification.suggestions[indexSelector]
                      .similar_images[0].url ? (
                      <>
                        <Text size={16} textStyle={{ marginVertical: 10 }}>
                          {"Planta encontrada"}
                        </Text>
                        <Image
                          style={{
                            width: "50%",
                            aspectRatio: "3/3",
                          }}
                          source={{
                            uri: infoAnalyzed.classification.suggestions[
                              indexSelector
                            ].similar_images[0].url,
                          }}
                        />
                      </>
                    ) : (
                      <View>
                        <Feather
                          name="alert-triangle"
                          size={20}
                          color="black"
                        />
                        <Text size={16} textStyle={{ marginVertical: 10 }}>
                          {"Imagen de planta no encontrada"}
                        </Text>
                      </View>
                    )
                  ) : (
                    <>
                      <AntDesign name="warning" size={20} color="black" />
                      <Text
                        size={16}
                        textStyle={{ marginVertical: 10 }}
                        weight={"bold"}
                      >
                        {
                          "Elemento de la foto tiene una baja probabilidad de ser una planta"
                        }
                      </Text>
                    </>
                  ))
                )}
              </Center>
              {infoAnalyzed &&
                (infoAnalyzed.is_plant.probability > 0.5 ? (
                  <>
                    <PlantInfo
                      plantName={
                        infoAnalyzed.classification.suggestions[indexSelector]
                          .name
                          ? infoAnalyzed.classification.suggestions[
                              indexSelector
                            ].name
                          : null
                      }
                      porcentageImg={
                        infoAnalyzed.classification.suggestions[indexSelector]
                          .probability
                      }
                      description={
                        infoAnalyzed?.classification.suggestions[indexSelector]
                          .details.description
                          ? infoAnalyzed?.classification.suggestions[
                              indexSelector
                            ].details.description.value
                          : null
                      }
                      commonNames={
                        infoAnalyzed.classification.suggestions[indexSelector]
                          .details.common_names
                      }
                      substract={() => {
                        setIndexSelector(
                          indexSelector - 1 === -1
                            ? infoAnalyzed.classification.suggestions.length - 1
                            : indexSelector - 1
                        );
                      }}
                      add={() => {
                        setIndexSelector(
                          (indexSelector + 1) %
                            infoAnalyzed.classification.suggestions.length
                        );
                      }}
                      index={indexSelector}
                      otherSug={
                        infoAnalyzed.classification.suggestions.length > 1
                      }
                    />
                  </>
                ) : null)}
            </>
          ) : (
            <>
              <Center viewStyles={{ marginTop: "40%" }}>
                <MaterialIcons name="image-search" size={80} color="black" />
                <Text weight={"bold"} size={16}>
                  {"Toma o agrega una imagen para poder analizar"}
                </Text>
              </Center>
            </>
          )}
        </View>
        <View>
          {!(!image ? true : false) ||
            (!(infoAnalyzed !== null) && (
              <View style={styles.btnsContainer}>
                <ImageGallery setImage={setImage} />
                <Button
                  text={"Abrir cámara"}
                  onPress={() => {
                    setIsOpencamera(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={20}
                    color="black"
                  />
                </Button>
              </View>
            ))}

          {image && (
            <Button
              text={"Quitar imagen seleccionada"}
              onPress={() => {
                setImage(null);
                setInfoAnalyzed(null);
                value?.setCurrentInfoPlantAI(null);
                value?.setCurrentImage(null);
              }}
              varStyles={{ marginTop: 10, backgroundColor: "red" }}
            >
              <Ionicons name="remove-circle" size={20} color="black" />
            </Button>
          )}

          <Button
            text={"Realizar análisis"}
            onPress={analyzeImage}
            disabled={(!image ? true : false) || infoAnalyzed !== null}
            varStyles={{ marginTop: 10, backgroundColor: "#00FF6E" }}
          >
            <Ionicons name="analytics" size={20} color="black" />
          </Button>
        </View>
      </Screen>
      {isOpenCamera && (
        <Camera
          setIsOpencamera={() => setIsOpencamera(false)}
          image={image}
          setImage={setImage}
        />
      )}
    </>
  );
};

export { Analyzer };
