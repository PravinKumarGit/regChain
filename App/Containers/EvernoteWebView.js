import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Clipboard,
  ToastAndroid,
  AlertIOS,
  Platform,
  Image,
  Linking,
  BackHandler,
  WebView,
  AsyncStorage
} from 'react-native';
var GLOBAL = require('../Constants/global');
import RentVsBuyStyle from './Styles/RentVsBuyStyle';
import Images from '../Themes/Images.js';
import STRINGS from '../GlobalString/StringData'  // Import StringData.js class for string localization.
var Header = require('./HomeHeader');
import WebViewBridge from 'react-native-webview-bridge';


export default class EvernoteWebView extends Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);     
    this.state = {
      pdf : '',
      result : '',
      user_id_result : '',
      userID : 0,
    }
  
    AsyncStorage.getItem("userDetail").then((value) => {
      newstr = value.replace(/\\/g, "");
      var newstr = JSON.parse(newstr);
      this.setState({
        user_id_result : newstr.user_id
      });
    });


    AsyncStorage.getItem("pdfFileName").then(
      (resultpl) =>{ 
        if(resultpl !== null && resultpl !== 'false'){
            this.setState({
              result : resultpl
            }, this.callState);
          } 
       });
  }

  componentWillUnmount() {		
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }
  
  handleBackButtonClick = () => {
      this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
      return true;
  }

  callState() {
    this.setState({
      pdf : this.state.result,
      userID : this.state.user_id_result
    });

    console.log("pdf file " + this.state.result);


  }

  onBridgeMessage(message) {
    const { webviewbridge } = this.refs;
    console.log("message " + JSON.stringify(message));
    switch (message) {
      case "hello from webview":
        webviewbridge.sendToBridge("hello from react-native");
        break;
      case "success":
        AsyncStorage.setItem("socialicon", "evernote");
        this.props.navigator.push({name: 'GoogleSigninExample', index: 0 });
        break;        
        case "error":
        AsyncStorage.setItem("socialicon", "evernoteerror");
        this.props.navigator.push({name: 'GoogleSigninExample', index: 0 }); 
        break;
    }
  }  

  render() {
    return (
      <WebViewBridge
      ref="webviewbridge"
      onBridgeMessage={this.onBridgeMessage.bind(this)}
      source={{uri: 'http://demoadmin.costsfirst.com/lovedeeptest/Evernote.php?pdf='+ this.state.pdf+'&userId='+this.state.userID }}/>
      
    )
} 


}

