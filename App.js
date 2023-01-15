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
import DeviceInfo from 'react-native-device-info';
import { check, PERMISSIONS, RESULTS, request, checkMultiple, openSettings } from 'react-native-permissions';
import Rootnavigator from './rootnavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */

const windowsWidth = Dimensions.get("screen").width;
const windowsHeight = Dimensions.get("screen").height;


export default App = () => {

  useEffect(() => {
    if (Platform.OS === 'android') {
      if (DeviceInfo.getApiLevel() >= 23) {
        requestPermissionAndroid()
      }
    } else if (Platform.OS === 'ios') {
      requestPermissionIOS()
    }
  });

  const requestPermissionAndroid = async () => {
    console.log('get android permission ....')
    request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log('This feature is not available (on this device / in this context)');
          break;
        case RESULTS.DENIED:
          console.log('The permission has not been requested / is denied but requestable');
          break;
        case RESULTS.LIMITED:
          console.log('The permission is limited: some actions are possible');
          break;
        case RESULTS.GRANTED:
          console.log('The permission is granted');
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
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }


  return (
    <SafeAreaProvider>
      <Rootnavigator />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
