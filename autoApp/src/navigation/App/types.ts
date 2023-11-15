import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type IAppParams = {
  Landing: undefined;
  Analyzer: undefined;
};

type TAppViewProps<T extends keyof IAppParams> = NativeStackScreenProps<
  IAppParams,
  T
>;

export type { IAppParams, TAppViewProps };
