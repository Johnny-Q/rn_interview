import React, { useRef, useEffect } from "react";
import { StyleSheet, Text, View, Image, PanResponder } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Rect, ClipPath, Defs, G } from "react-native-svg";
import { StarIcon } from "./StarIcon";
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
    // const fadeValue = useRef(new Animated.Value(0)).current;
    const portraitFade = useSharedValue(0);
    const descFade = useSharedValue(0);
    const nameFade = useSharedValue(0);
    const titleFade = useSharedValue(0);

    const gestureEventHandler = useAnimatedGestureHandler({

    });
    useEffect(() => {
        portraitFade.value = withTiming(1, { duration: 500 }, () => {
            descFade.value = withTiming(1, { duration: 500 });
        });
        nameFade.value = withTiming(1, { duration: 500 }, () => {
            titleFade.value = withTiming(1, { duration: 500 });
        });
    }, []);

    const animatedStyles = {
        portraitFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: portraitFade.value,
            };
        }),
        descFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: descFade.value,
            };
        }),
        nameFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: nameFade.value,
            };
        }),
        titleFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: titleFade.value,
            };
        }),
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",

            aspectRatio: 1 / 2,
            width: props.size,
            overflow: "hidden",

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
        cardDesc: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            width: 0.7 * props.size,

            margin: 10,
        },
        descItemContainer: {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
        },
        smallSquare: {
            backgroundColor: "black",

            aspectRatio: 1 / 1,
            width: 10,
            margin: 5,
        },
        nameContainer: {
            alignItems: "center",
            justifyContent: "center",
        },
        nameFont: {
            fontSize: 32,
            margin: 5,
        },
        titleFont: {
            fontSize: 16,
        },
    });

    const portraitSize = 0.8 * props.size;
    const portraitBorderWidth = 5;
    const portrait = StyleSheet.create({
        container: {
            alignItems: "center",
            justifyContent: "center",

            aspectRatio: 1 / 1,
            width: portraitSize,
            position: "relative",

            borderRadius: 0.1 * portraitSize,
            borderColor: props.secondaryColor,
            borderWidth: portraitBorderWidth,

            margin: 0.1 * portraitSize,
        },
        doubleBorder: {
            width: portraitSize,
            aspectRatio: 1 / 1,
            overflow: "hidden",

            position: "absolute",
            top: -portraitBorderWidth,
            left: -portraitBorderWidth,

            borderRadius: 0.1 * portraitSize,
            borderColor: props.primaryColor,
            borderWidth: portraitBorderWidth,

            transform: [{ scale: 1 - (1.5 * portraitBorderWidth) / portraitSize }], //don't know why these numbers work out
        },
        floatingSquare: {
            width: 0.2 * portraitSize,
            aspectRatio: 1 / 1,

            position: "absolute",
            top: -0.25 * 0.2 * portraitSize,
            right: -0.25 * 0.2 * portraitSize,

            backgroundColor: "orange",

            borderRadius: 0.1 * 0.2 * portraitSize,
            borderColor: "#fff",
            borderWidth: 1,
        },
        starContainer: {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",

            width: 0.8 * portraitSize,

            position: "absolute",
            bottom: -0.5 * 0.2 * portraitSize,
        },
        star: {
            flexShrink: 1,
        },
    });
    return (
        <View>
            <PanGestureHandler onGestureEvent={gestureEventHandler}>
                <Animated.View style={styles.container}>
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

                    {/* Waifu Portrait */}
                    <Animated.View style={[portrait.container, animatedStyles.portraitFadeAnim]}>
                        <Image source={{ uri: props.imageUri }} style={portrait.doubleBorder}></Image>
                        <View style={portrait.floatingSquare}></View>
                        <View style={portrait.starContainer}>
                            {[...Array(props.stars)].map((_: undefined, i: number) => {
                                return <StarIcon style={portrait.star} size={0.2 * portraitSize} color={props.primaryColor} stroke={props.secondaryColor} strokeWidth={0.2 * portraitSize} key={i}></StarIcon>;
                            })}
                        </View>
                    </Animated.View>
                    {/* End waifu portrait */}

                    <Animated.View style={[styles.cardDesc, animatedStyles.descFadeAnim]}>
                        <View style={styles.descItemContainer}>
                            <View style={styles.smallSquare}></View>
                            <Text>line 1</Text>
                        </View>
                        <View style={styles.descItemContainer}>
                            <View style={styles.smallSquare}></View>
                            <Text>line 2</Text>
                        </View>
                    </Animated.View>

                    <Animated.Text style={[styles.nameFont, animatedStyles.nameFadeAnim]}>{props.name}</Animated.Text>
                    <Animated.Text style={[styles.titleFont, animatedStyles.titleFadeAnim]}>{props.title}</Animated.Text>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}
