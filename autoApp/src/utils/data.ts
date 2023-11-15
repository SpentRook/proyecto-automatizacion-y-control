import { DataObject } from "../types/thingsSpeakData";

const setData = (
  data: DataObject[],
  key: keyof DataObject,
  size?: number
): string[] | number[] => {
  const length = data.length;
  const sizeU = size ? size : 50;
  const newData = data.slice(length - sizeU, length);
  const d = newData.map((value) => value[key]);
  return key === "field1" || key === "field2" || key === "field3"
    ? setFieldsData(d)
    : key === "created_at"
    ? setTimeData(d)
    : d;
};

const setFieldsData = (dataChart: string[]): number[] => {
  return dataChart.map((val) => parseInt(val));
};

const setTimeData = (dataChart: string[]): string[] => {
  return dataChart.map((val) => {
    const date = new Date(val);
    return `${date.getHours()}:${date.getMinutes()}`;
  });
};

export { setData };
