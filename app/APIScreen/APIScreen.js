import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View, Alert, Image, Dimensions, TouchableOpacity, ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon, Avatar } from '@rneui/themed';

const windowsHeight = Dimensions.get("screen").height;

export default APIScreen = (props) => {
    const navigation = useNavigation();
    console.log("consider...", props.route.params.json)
    return (
        <View style={{ flex: 1, backgroundColor: "green" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
                <Image /* source={require('../assets/alailogo.png')} */ source={props.route.params} style={{ width: "100%", height: "100%" }} resizeMode={"cover"} />
                <TouchableOpacity style={{ position: "absolute", right: 2, bottom: windowsHeight / 5.7, zIndex: 5, opacity: 1 }}
                    onPress={e => navigation.navigate("MainScreen")}
                >
                    <Avatar rounded
                        size={50}
                        containerStyle={{ backgroundColor: "#3ECFBF", borderColor: "#FFFFFF", borderWidth: 4 }}
                        icon={{ name: 'plus', type: 'font-awesome' }}
                    />
                </TouchableOpacity>
                <View style={{ height: windowsHeight / 5, width: "100%", backgroundColor: "#1E2226", opacity: 0.8, position: "absolute", bottom: 0, zIndex: 2, borderTopLeftRadius: 10 }}>
                    <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16, width: "80%", marginLeft: 15, marginTop: 15 }}>{props.route.params.json.results[0].formatted_address}</Text>
                </View>
            </View>

        </View>
    )

};