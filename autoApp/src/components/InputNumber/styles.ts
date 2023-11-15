import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  inputContainer: {
    height: 48,
    width: "66%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    textAlign: "center",
  },
  inputNumberContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export { styles };
