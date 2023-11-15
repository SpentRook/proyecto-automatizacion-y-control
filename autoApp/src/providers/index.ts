import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { responseAPI } from "../types/responseAPI";

interface InfoPlantAII {
  currentInfoPlantAI: responseAPI | null;
  setCurrentInfoPlantAI: Dispatch<SetStateAction<responseAPI | null>>;
  currentImage: string | null;
  setCurrentImage: Dispatch<SetStateAction<string | null>>;
}

const InfoPlantAIContext = createContext<InfoPlantAII | null>(null);

const InfoPlantAIProvider =
  InfoPlantAIContext.Provider as React.Provider<InfoPlantAII | null>;

const useInfoPlantAI = (): InfoPlantAII | null => {
  const ctx = useContext(InfoPlantAIContext);
  if (ctx === null) {
    return null;
  }
  return ctx;
};

export { InfoPlantAIContext, InfoPlantAIProvider, useInfoPlantAI };
