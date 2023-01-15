import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    ImageBackground,
    Dimensions,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
class Home extends Component {
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" }}>
                <StatusBar backgroundColor={"#2F15B6"} />
                <View style={{ flex: 0.4, width: "50%", justifyContent: "center", alignItems: "center" }}>
                    <Image
                        source={require('../assets/alailogo.png')}
                        style={{
                            width: '100%',
                            height: windowWidth / 2,
                        }}
                        resizeMode={"contain"}
                    />
                </View>
                <View style={{ position: "absolute", bottom: 30 }}>
                    <Text style={{ color: "#2F15B6", fontWeight: "800" }}>Copyright © {new Date().getFullYear()} Alai Labs India Pvt Ltd.</Text>
                </View>

            </View>
        );
    }
}
class FirstPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            component: <Home />,
        };
    }
    componentDidMount() {

        this.timeoutHandle = setTimeout(() => {
            this.props.navigation.navigate('MainScreen');
        }, 3000);
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    }

    render() {
        return <Home />;
    }
}

export default FirstPage;
