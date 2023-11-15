import * as ImagePicker from "expo-image-picker";
import { Dispatch, useEffect, useState } from "react";
import { Button } from "../Button/Button";
import { Text } from "../Text/Text";
import { Entypo } from "@expo/vector-icons";
import { ImageForm } from "../../views/Analyzer/Analyzer";

interface Props {
  setImage: Dispatch<React.SetStateAction<ImageForm | null>>;
}

const ImageGallery = ({ setImage }: Props) => {
  const [hasGalleryPermission, setHasCameraPermission] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (result.assets[0].base64) {
        setImage({
          uri: result.assets[0].uri,
          base64: result.assets[0].base64,
        });
      }
    }
  };

  if (hasGalleryPermission === false) {
    return <Text>{"No tienes permiso para acceder a la galería"}</Text>;
  }

  return (
    <Button text={"Cargar imagen"} onPress={pickImage}>
      <Entypo name="upload" size={20} color="black" />
    </Button>
  );
};

export { ImageGallery };
