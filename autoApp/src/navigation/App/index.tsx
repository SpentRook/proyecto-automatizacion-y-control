import { NavigationContainer } from "@react-navigation/native";
import { Analyzer } from "../../views/Analyzer/Analyzer";
import { Landing } from "../../views/Landing/Landing";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { IAppParams } from "./types";

const { Navigator, Screen } = createNativeStackNavigator<IAppParams>();

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Navigator initialRouteName={"Landing"} screenOptions={screenOptions}>
        <Screen component={Landing} name={"Landing"} />
        <Screen component={Analyzer} name={"Analyzer"} />
      </Navigator>
    </NavigationContainer>
  );
};

export { AppNavigation };
