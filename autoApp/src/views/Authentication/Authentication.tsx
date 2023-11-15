import { View } from "react-native";
import { Input } from "../../components/Input/Input";
import { useState } from "react";
import { Screen } from "../../components/Screen/Screen";
import {
  signInWithEmailAndPasswordF,
  signUpWithEmailAndPassword,
} from "../../utils/auth";
import { Logo } from "../../components/Logo/Logo";
import { Title } from "../../components/Title/Title";
import { styles } from "./styles";
import { Button } from "../../components/Button/Button";
import { Loader } from "../../components/Loader/Loader";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggin, setIsLoggin] = useState(true);
  const [loader, setLoader] = useState(false);

  const loginWithFirebase = async () => {
    if (email.length > 0 && password.length > 0) {
      setLoader(true);
      try {
        await signInWithEmailAndPasswordF(email, password);
        console.log("Logged with email and password");
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    } else {
      console.error("Rellene los campos");
    }
  };

  const createAccount = async () => {
    if (email.length > 0 && password.length > 0) {
      setLoader(true);
      try {
        await signUpWithEmailAndPassword(email, password);
        console.log("User created with email and password");
      } catch (error) {
        console.error(error);
      } finally {
        setLoader(false);
      }
    } else {
      console.error("Rellene los campos");
    }
  };

  return (
    <Screen>
      <View>
        <Logo />
        <Title>{isLoggin ? "Iniciar sesión" : "Crear cuenta"}</Title>
        <View style={styles.inputsContainer}>
          <Input
            type={"email-address"}
            value={email}
            onChange={setEmail}
            label={"Correo electrónico"}
          />
          <Input
            value={password}
            onChange={setPassword}
            secure={true}
            label={"Contraseña"}
          />
        </View>
        {loader ? (
          <Loader size={"large"} />
        ) : (
          <>
            <Button
              text={isLoggin ? "Iniciar sesión" : "Crear cuenta"}
              disabled={!(email.length > 0) || !(password.length > 0)}
              onPress={isLoggin ? loginWithFirebase : createAccount}
            />
            <Button
              text={isLoggin ? "Crear cuenta" : "Iniciar sesión"}
              varStyles={{ backgroundColor: "transparent" }}
              textColor={"blue"}
              onPress={() => setIsLoggin(!isLoggin)}
            />
          </>
        )}
      </View>
    </Screen>
  );
};

export { Auth };
