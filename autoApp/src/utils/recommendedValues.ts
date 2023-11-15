import { requestAPI } from "../types/requestAPI";

const RValues: Record<string, requestAPI> = {
  "Bougainvillea glabra": {
    soil_mestiure: 50,
    light_level: 750,
    temperature: 18,
  },
  "Bougainvillea spectabilis": {
    soil_mestiure: 51,
    light_level: 700,
    temperature: 20,
  },
  "Mammillaria elongata": {
    soil_mestiure: 50,
    light_level: 850,
    temperature: 27,
  },
  Parodia: {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Mammillaria rhodantha": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Mammillaria columbiana": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Mammillaria prolifera": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Eriosyce subgibbosa": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Mammillaria pottsii": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Parodia scopa": {
    soil_mestiure: 50,
    light_level: 1000,
    temperature: 30,
  },
  "Gasteria pillansii": {
    soil_mestiure: 75,
    light_level: 680,
    temperature: 30,
  },
  "Gasteria obliqua": {
    soil_mestiure: 75,
    light_level: 680,
    temperature: 30,
  },
  "Gasteria brachyphylla": {
    soil_mestiure: 72,
    light_level: 850,
    temperature: 21,
  },
  Adromischus: {
    soil_mestiure: 68,
    light_level: 950,
    temperature: 28,
  },
  Crassula: {
    soil_mestiure: 50,
    light_level: 850,
    temperature: 25,
  },
  Echeveria: {
    soil_mestiure: 50,
    light_level: 900,
    temperature: 23,
  },
  Kalanchoe: {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 23,
  },
  "Gasteria excelsa": {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 18,
  },
  "Gasteria nitida": {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 18,
  },
  Phalaenopsis: {
    soil_mestiure: 85,
    light_level: 550,
    temperature: 23,
  },
  "Vanda coerulea": {
    soil_mestiure: 60,
    light_level: 700,
    temperature: 28,
  },
  "Vanda coerulescens": {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 20,
  },
  "Dendrobium victoriae-reginae": {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 20,
  },
  Gladiolus: {
    soil_mestiure: 50,
    light_level: 700,
    temperature: 20,
  },
  "Crassula ovata": {
    soil_mestiure: 55,
    light_level: 900,
    temperature: 25,
  },
  "Phedimus spurius": {
    soil_mestiure: 60,
    light_level: 750,
    temperature: 28,
  },
  "Kalanchoe blossfeldiana": {
    soil_mestiure: 50,
    light_level: 750,
    temperature: 21,
  },
  "Sedum tetractinum": {
    soil_mestiure: 50,
    light_level: 750,
    temperature: 22,
  },
  "Cotyledon pendens": {
    soil_mestiure: 50,
    light_level: 600,
    temperature: 25,
  },
  "Portulacaria afra": {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  Euphorbia: {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  "Sempervivum tectorum": {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  "Kalanchoe luciae": {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  "Ceratostigma plumbaginoides": {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  Sedum: {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
  Begonia: {
    soil_mestiure: 50,
    light_level: 800,
    temperature: 28,
  },
};

export const getRecommendedValues = (plantName: string) => {
  return Object.entries(RValues).filter((el) => el[0] === plantName)[0];
};
