import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image} from "react-native";
import Waifu from "./assets/waifu.png";
import Badge from "./src/components/Badge";
export default function App() {
    const imageUri = Image.resolveAssetSource(Waifu).uri;
    console.log(imageUri);
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: "#000",
        },
        text: {
            color: "#fff",
        },
    });
    return (
        <View style={styles.container}>
            <Badge size={300} name="name" title="title" stars={6} imageUri={imageUri} primaryColor={"#03FFCC"} secondaryColor={"#EDA0F2"}/>
            <Badge size={300} name="name" title="title" stars={3} imageUri={imageUri} primaryColor={"#03FFCC"} secondaryColor={"#EDA0F2"}/>
        </View>
    );
}
