import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Rect, ClipPath, Defs, G } from "react-native-svg";
type BadgeComponentType = {
    size: number;
    name: string;
    title: string;
    stars: number;
    imageUri: string;
    primaryColor: string;
    secondaryColor: string;
};
export default function Badge(props: BadgeComponentType) {
    const styles = StyleSheet.create({
        container: {
            aspectRatio: 1 / 2,
            width: props.size,
            overflow: "hidden",
            position: "relative",

            backgroundColor: "#fff",

            borderRadius: 0.1 * props.size,

            margin: 5,
            paddingHorizontal: 20,
            paddingVertical: 30,
        },
        svg: {
            position: "absolute",
            top: 0,
            left: 0,
        },
    });
    return (
        <View style={styles.container}>
            {/* Stripes */}
            <Svg style={styles.svg} width={props.size} height={props.size * 2} viewBox="0 0 300 600" fill="none">
                <G clip-path="url(#clip0_2_3)">
                    <Rect width="300" height="600" fill="white" />
                    <G clip-path="url(#clip1_2_3)">
                        <Rect width="500" height="500" transform="translate(211.576 -236) rotate(55)" fill="white" />
                        <Rect x="-200" y="50" width="500" height="200" transform="rotate(-35 -200 50)" fill="#03FFCC" />
                        <Rect x="-70" y="230" width="500" height="15" transform="rotate(-35 -70 230)" fill="#CBF7E6" />
                        <Rect x="-60" y="255" width="500" height="3" transform="rotate(-35 -60 255)" fill="#EDA0F2" />
                    </G>
                </G>
                <Defs>
                    <ClipPath id="clip0_2_3">
                        <Rect width="300" height="600" fill="white" />
                    </ClipPath>
                    <ClipPath id="clip1_2_3">
                        <Rect width="500" height="500" fill="white" transform="translate(211.576 -236) rotate(55)" />
                    </ClipPath>
                </Defs>
            </Svg>
            {/* End stripes */}

        </View>
    );
}
