import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 10,
    backgroundColor: "black",
  },
  buttonContainer: {
    position: "absolute",
    zIndex: 1,
  },
  buttonsTopContainer: {
    padding: 8,
    zIndex: 1,
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btnsContainer: {
    padding: 8,
    zIndex: 1,
    gap: 10,
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  fullScreen: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
});

export { styles };
