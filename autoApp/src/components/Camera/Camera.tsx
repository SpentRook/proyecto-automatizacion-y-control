import { Camera as CM, CameraType, FlashMode } from "expo-camera";
import { Dispatch, useEffect, useRef, useState } from "react";
import * as MediaLibrary from "expo-media-library";
import { View, Image } from "react-native";
import { Text } from "../Text/Text";
import { Button } from "../Button/Button";
import { styles } from "./styles";
import {
  Octicons,
  MaterialCommunityIcons,
  Fontisto,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { ImageForm } from "../../views/Analyzer/Analyzer";

interface Props {
  setIsOpencamera: () => void;
  image: any | null;
  setImage: Dispatch<React.SetStateAction<ImageForm | null>>;
}

const Camera = ({ setIsOpencamera, image, setImage }: Props): JSX.Element => {
  const [hasCameraPermission, setHasCameraPermission] =
    useState<null | Boolean>(null);
  const [type, setType] = useState<CameraType>(CameraType.back);
  const [flash, setFlash] = useState(FlashMode.off);
  const cameraRef = useRef<null | any>(null);

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await CM.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        const asset = await MediaLibrary.createAssetAsync(data.uri);
        const type = asset.filename.split(".")[1];
        setImage({
          uri: asset.uri,
          name: asset.filename,
          type: `image/${type}`,
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (hasCameraPermission === false) {
    return <Text>{"No tienes permiso para acceder a la cámara"}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.btnsContainer, { justifyContent: "space-between" }]}>
        <Button
          onPress={() => {
            setIsOpencamera();
          }}
        >
          <Octicons name="arrow-left" size={20} color="black" />
        </Button>
        {!image && (
          <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Button
              onPress={() =>
                setFlash(flash === FlashMode.off ? FlashMode.on : FlashMode.off)
              }
            >
              <Fontisto name="flash" size={20} color="black" />
            </Button>
            <Button
              onPress={() =>
                setType(
                  type === CameraType.front ? CameraType.back : CameraType.front
                )
              }
            >
              <Ionicons
                name="md-camera-reverse-sharp"
                size={20}
                color="black"
              />
            </Button>
          </View>
        )}
      </View>
      {image && <Image source={{ uri: image.uri }} style={styles.fullScreen} />}
      <CM
        style={styles.fullScreen}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      />
      {image ? (
        <View
          style={[
            styles.btnsContainer,
            { bottom: 10, justifyContent: "center" },
          ]}
        >
          <Button
            text={"Tomar foto"}
            onPress={() => setImage(null)}
            varStyles={{ backgroundColor: "red" }}
          >
            <MaterialCommunityIcons
              name="camera-retake"
              size={20}
              color="black"
            />
          </Button>
          <Button text={"Seleccionar foto"} onPress={setIsOpencamera}>
            <MaterialIcons name="add-a-photo" size={20} color="black" />
          </Button>
        </View>
      ) : (
        <View
          style={[
            styles.btnsContainer,
            { bottom: 10, justifyContent: "center" },
          ]}
        >
          <Button
            varStyles={[styles.buttonContainer, { bottom: 10 }]}
            text={"Tomar foto"}
            onPress={takePicture}
          >
            <MaterialCommunityIcons name="camera" size={20} color="black" />
          </Button>
        </View>
      )}
    </View>
  );
};

export { Camera };
