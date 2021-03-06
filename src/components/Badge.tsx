import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, PanResponder } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
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
    const [flipped, setFlipped] = useState(false);
    const fadeIn = useSharedValue(0);
    const cardDescFadeIn = useSharedValue(0);

    const rotation = useSharedValue(0);
    const offset = useSharedValue(0);

    const gestureEventHandler = useAnimatedGestureHandler({
        onStart: (e) => {
            //mark the start of the swipe
            offset.value = e.absoluteX;
        },
        onActive: (e) => {
            if (flipped) return; //if the card was already flipped, don't do the swipe
            rotation.value = e.absoluteX - offset.value;

            //bound the rotation
            if (rotation.value < 0) rotation.value = 0;
            if (rotation.value > props.size) rotation.value = props.size;
        },
        onEnd: (e) => {
            if (flipped) return;

            //swiped more than halfway through the card, just complete the swipe animation
            if (rotation.value >= props.size) { //if the user flipped the card all the way, mark the badge as flipped
                runOnJS(setFlipped)(true); 
            } else if (rotation.value > props.size / 2) { //if the card was half flipped, complete the animation and mark the badge as flipped
                rotation.value = withTiming(props.size, { duration: 200 }, () => {
                    runOnJS(setFlipped)(true); //
                });
            } else { //reset the badge to it's original position with an animation
                rotation.value = withTiming(0, { duration: 200 });
            }
        },
    });

    //once the badge is flipped, load in the other details
    useEffect(() => {
        if (flipped) {
            fadeIn.value = withTiming(2, { duration: 1000 });
        }
    }, [flipped]);

    const animatedStyles = {
        portraitFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: interpolate(fadeIn.value, [0, 1, 2], [0, 1, 1]),
                transform: [{ translateY: interpolate(fadeIn.value, [0, 1, 2], [10, 0, 0]) }],
            };
        }),
        nameFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: interpolate(fadeIn.value, [0, 1, 2], [0, 1, 1]),
                transform: [{ translateY: interpolate(fadeIn.value, [0, 1, 2], [10, 0, 0]) }],
            };
        }),
        descFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: interpolate(fadeIn.value, [0, 1, 2], [0, 0, 1]),
                transform: [{ translateY: interpolate(fadeIn.value, [0, 1, 2], [10, -10, 0]) }],
            };
        }),
        titleFadeAnim: useAnimatedStyle(() => {
            return {
                opacity: interpolate(fadeIn.value, [0, 1, 2], [0, 0, 1]),
                transform: [{ translateY: interpolate(fadeIn.value, [0, 1, 2], [10, -10, 0]) }],
            };
        }),
        rotationAnim: useAnimatedStyle(() => {
            const rotate = interpolate(rotation.value, [0, props.size / 2, props.size], [-180, -90, 0]);
            return {
                transform: [
                    {
                        rotateY: `${rotate}deg`,
                    },
                ],
            };
        }),
    };

    const badgeStyles = StyleSheet.create({
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
                <Animated.View style={[badgeStyles.container, animatedStyles.rotationAnim]}>
                    {/* Stripes */}
                    <Svg style={badgeStyles.svg} width={props.size} height={props.size * 2} viewBox="0 0 300 600" fill="none">
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

                    <Animated.View style={[badgeStyles.cardDesc, animatedStyles.descFadeAnim]}>
                        <View style={badgeStyles.descItemContainer}>
                            <View style={badgeStyles.smallSquare}></View>
                            <Text>line 1</Text>
                        </View>
                        <View style={badgeStyles.descItemContainer}>
                            <View style={badgeStyles.smallSquare}></View>
                            <Text>line 2</Text>
                        </View>
                    </Animated.View>

                    <Animated.Text style={[badgeStyles.nameFont, animatedStyles.nameFadeAnim]}>{props.name}</Animated.Text>
                    <Animated.Text style={[badgeStyles.titleFont, animatedStyles.titleFadeAnim]}>{props.title}</Animated.Text>
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}
