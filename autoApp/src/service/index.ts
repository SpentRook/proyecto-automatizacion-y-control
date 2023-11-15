import axios from "axios";

// Por ahora la KEY se va a quedar por aquí, luego se mueve a un .env
const key = "fETOdZDHUSXccfG1kJIftPO4sukYwL2VjFAY3kBziyeOYzzI8c";

const urlGetData =
  "https://api.thingspeak.com/channels/2342485/feeds.json?api_key=I5AKQYGWY7LSRXYT";

const urlAnalyzeImgs =
  "https://plant.id/api/v3/identification?details=common_names,description,rank,synonyms,watering&language=es";

// Dirección IP del servidor ESP32
const backIP = "http://192.168.1.11:8080";

const options = {
  headers: { "Content-Type": "multipart/form-data", "Api-Key": key },
};

export const getDataFromThingsSpeak = async () => {
  return await axios.get(urlGetData);
};

export const getDesiredOutcomes = async () => {
  return await axios.get(`${backIP}/parameters`);
};

export const updateDesiredOutcomes = async (data: any) => {
  return await axios.put(`${backIP}/parameters`, data);
};

export const analyzeImgs = async (data: any) => {
  const formData = new FormData();
  formData.append("images", data);
  formData.append("latitude", "49.207");
  formData.append("longitude", "16.608");
  formData.append("similar_images", "true");
  return await axios.post(urlAnalyzeImgs, formData, options);
};
