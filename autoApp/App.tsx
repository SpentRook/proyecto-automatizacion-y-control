import React, { useState } from "react";

import { UserProvider, useAuth } from "./src/utils/auth";
import { AppNavigation } from "./src/navigation/App";
import { Auth } from "./src/views/Authentication/Authentication";
import {
  InfoPlantAIContext,
  InfoPlantAIProvider,
  useInfoPlantAI,
} from "./src/providers";
import { responseAPI } from "./src/types/responseAPI";

export default function App() {
  const user = useAuth();

  const [currentInfoPlantAI, setCurrentInfoPlantAI] =
    useState<responseAPI | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  if (user === null) {
    return <Auth />;
  }

  return (
    <>
      <UserProvider value={user}>
        <InfoPlantAIContext.Provider
          value={{
            currentInfoPlantAI,
            setCurrentInfoPlantAI,
            currentImage,
            setCurrentImage,
          }}
        >
          <AppNavigation />
        </InfoPlantAIContext.Provider>
      </UserProvider>
    </>
  );
}
