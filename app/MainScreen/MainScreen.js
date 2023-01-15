/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, RESULTS, request, checkMultiple, openSettings } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { RNS3 } from 'react-native-aws3';
import { decode } from "base64-arraybuffer";
import {
    S3Client,
    CreateBucketCommand,
    DeleteBucketCommand,
} from "@aws-sdk/client-s3";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const windowsWidth = Dimensions.get("screen").width;
const windowsHeight = Dimensions.get("screen").height;

const xs = windowsWidth > 0 && windowsWidth < 418
const sm = windowsWidth > 417 && windowsWidth < 768
const md = windowsWidth > 767 && windowsWidth < 1024
const lg = windowsWidth > 1023

const MainScreen = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [geoLocation, setgeoLocation] = React.useState({});
    const [sourceURI, setSourceURI] = React.useState("");
    useEffect(() => {
        if (Platform.OS === 'android') {
            if (DeviceInfo.getApiLevel() >= 23) {
                requestPermissionAndroid()
            }
            /*  else {
               getUserCurrentLocation()
             } */

        } else if (Platform.OS === 'ios') {
            requestPermissionIOS()
        }
    })

    const awsCall = async (data) => {
        console.log("internal")
        const file = {
            // `uri` can also be a file system path (i.e. file://)
            uri: data,
            name: "image.jpg",
            type: "image/jpg"
        }

        const options = {
            keyPrefix: "images/",
            bucket: "streeteye",
            region: "ap-south-1",
            accessKey: "AKIAUIBE3O24IEJFGHAB",
            secretKey: "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",
            successActionStatus: 201
        }
        try {
            RNS3.put(file, options).then(response => {
                if (response.status !== 201)
                    throw new Error("Failed to upload image to S3");
                console.log(response.body);
            })
        } catch (error) {
            console.log(error)
        }

    }

    const getUserCurrentLocation = async () => {
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = JSON.stringify(position);
                console.log(initialPosition);
                revereseGeoCode(position.coords.latitude, position.coords.longitude)
            },
            error => console.log('Error', JSON.stringify(error)),
            {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 10000
            },
        );
    }

    const revereseGeoCode = async (lat, long) => {
        console.log(lat, long)
        var geoloc = {};
        var keyValue = "77cd3d7b69c56b97e4f1e771f0ae42b7";
        //var keyValue = "pk.42d3248bbe8a658b6ae3835d07ac32a4"

        const options = {
            mediaType: 'photo',
            includeBase64: true
        };
        launchCamera(options, (res) => {      //res is callback, https://github.com/react-native-image-picker/react-native-image-picker/blob/main/README.md#options.
            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                // console.log("res", res)
                //awsCall(res.assets[0].uri)
                setSourceURI(res.assets[0].base64);
                awsCall(`data:image/png;base64,${res.assets[0].base64}`)
                navigation.navigate('APIScreen', { uri: `data:image/png;base64,${res.assets[0].base64}`, json: geoloc });
                return res;
            }
        });
        try {
            const response = await fetch(
                `https://apis.mapmyindia.com/advancedmaps/v1/${keyValue}/rev_geocode?&lng=${long}&lat=${lat}&region=ind`,
                //`https://us1.locationiq.com/v1/reverse?key=${keyValue}&lat=${lat}&lon=${long}&format=json`
            );
            const json = await response.json();
            setgeoLocation(json);
            console.log(json)
            geoloc = { ...json }
        } catch (error) {
            console.error(error);
        }


    }
    /*     const reverseGeo = async (lat, long, keyValue) => {
            console.log("reverse geo")
            const res = await fetch(
                //`https://apis.mapmyindia.com/advancedmaps/v1/${keyValue}/rev_geocode?&lng=${long}&lat=${lat}&region=ind`,
                `https://us1.locationiq.com/v1/reverse?key=${keyValue}&lat=${lat}&lon=${long}&format=json`
            ).then(function (response) {
                console.log(response);
            }).catch(function (error) {
                console.error(error);
            });
        }  */


    const requestPermissionAndroid = async () => {
        console.log('get android permission ....')
        request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
            switch (result) {
                case RESULTS.UNAVAILABLE:
                    console.log('This feature is not available (on this device / in this context)');
                    //getUserCurrentLocation()
                    break;
                case RESULTS.DENIED:
                    console.log('The permission has not been requested / is denied but requestable');
                    break;
                case RESULTS.LIMITED:
                    console.log('The permission is limited: some actions are possible');
                    //getUserCurrentLocation()
                    break;
                case RESULTS.GRANTED:
                    console.log('The permission is granted');
                    //getUserCurrentLocation()
                    break;
                case RESULTS.BLOCKED:
                    console.log('The permission is denied and not requestable anymore');
                    break;
            }
        });
    };

    const requestPermissionIOS = async () => {
        check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log('This feature is not available (on this device / in this context)');
                        //getUserCurrentLocation()
                        break;
                    case RESULTS.DENIED:
                        console.log('The permission has not been requested / is denied but requestable');
                        break;
                    case RESULTS.LIMITED:
                        console.log('The permission is limited: some actions are possible');
                        //getUserCurrentLocation()
                        break;
                    case RESULTS.GRANTED:
                        console.log('The permission is granted');
                        // getUserCurrentLocation()
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                // …
            });
    }


    return (
        <SafeAreaView>
            <StatusBar animated={true} backgroundColor={"#2F15B6"} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic">
                <View style={{ width: windowsWidth, height: windowsHeight, justifyContent: "space-evenly", alignItems: "center" }}>
                    <Image source={require('../assets/alailogo.png')} style={{ width: "50%", flex: 0.05 }} />
                    <TouchableOpacity style={{ backgroundColor: "#2F15B6", width: "60%", flex: .05, justifyContent: "center", alignItems: "center", borderRadius: 10 }}
                        onPress={e => getUserCurrentLocation()}>
                        <Text style={{ color: "#FFFFFF" }}>Click here to capture image</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

});

export default MainScreen;