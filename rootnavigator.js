import React, { useState, useEffect } from 'react';

import { Dimensions, useWindowDimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from './app/MainScreen/MainScreen';
import SplashScreen from './app/SplashScreen/SplashScreen';
import APIScreen from './app/APIScreen/APIScreen'
import { Button, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default rootNavigator = () => {

    const RenderNavigator = () => {
        return (
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    name="Home"
                    component={SplashScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="MainScreen"
                    component={MainScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="APIScreen"
                    component={APIScreen}
                    options={{
                        headerShown: false,
                    }}
                />


            </Stack.Navigator>
        );
    };

    return (
        <NavigationContainer>{RenderNavigator()}</NavigationContainer>

    );
};