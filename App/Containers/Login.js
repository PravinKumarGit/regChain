import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import Images from '../Themes/Images.js'; // Import Images.js class from Image Folder for images.
import Styles from './Styles/LoginScreenStyle'; // Import LoginScreenStyle.js class from Styles Folder to maintain UI.
import STRINGS from '../GlobalString/StringData'; // Import StringData.js class for string localization.
import {callPostApi} from '../Services/webApiHandler.js'; // Import webApiHandler.js class for calling api.
var GLOBAL = require('../Constants/global'); // Import Global class for getting URLs.
import KeyboardSpacer from 'react-native-keyboard-spacer'; // Import keyboard spacer class for handling keyboard.
import CheckBox from 'react-native-checkbox';
export const PERSISTENT_LOGIN = 'persistent-login';
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      usernameError: '',
      passwordError: '',
      password: '',
      animating: false,
      showError: false,
      connectionInfo: '',
      visble: false,
      showPage: false,
      persistentlogin: false,
    };
    console.log('hi this is new place.');
    this.handleFirstConnectivityChange = this.handleFirstConnectivityChange.bind(
      this,
    );
  }
  // Method calls when login button pressed and after validation of all fields, call login api.
  onLoginPress() {
    if (this.state.connectionInfo != 'none') {
      this.setState({animating: true}, this.callValidation);
    } else {
      this.dropdown.alertWithType(
        'error',
        'Error',
        'Please check your internet connection.',
      );
    }
  }

  callValidation() {
    if (this.state.username == '') {
      this.setState({usernameError: STRINGS.t('username_error_message')});

      this.setState({username: ''});
    } else {
      this.setState({usernameError: ''});
    }
    if (this.state.password == '') {
      this.setState({
        passwordError: STRINGS.t('blank_password_acc_error_message'),
      });
    } else if (this.state.password.length < 6) {
      this.setState({passwordError: STRINGS.t('password_error_message')});
      this.setState({password: ''});
    } else {
      this.setState({passwordError: ''});
    }
    if (this.state.username != '' && this.state.password.length >= 6) {
      this.callapi();
    } else {
      this.setState({animating: false});
    }
  }

  componentDidMount() {
    console.log('Login', 'hum yhi h.');
    // BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    // NetInfo.isConnected.addEventListener(
    //   'connectionChange',
    //   this._handleConnectivityChange,
    // );

    AsyncStorage.getItem(PERSISTENT_LOGIN).then(resultpl => {
      if (resultpl !== null && resultpl !== 'false') {
        val = false;
        AsyncStorage.setItem('speakToTextVal', JSON.stringify(val)).then(() => {
          console.log('Done');
        });
        this.props.navigator.push({name: 'Dashboard', index: 0});
      } else {
        this.setState({
          showPage: true,
        });
      }
    });

    AsyncStorage.getItem('username').then(resultpl => {
      if (resultpl !== null && resultpl !== '') {
        const username = resultpl.replace(/\\/g, '');
        this.setState({
          username,
        });
      }
    });
    // NetInfo.getConnectionInfo().then(connectionInfo => {
    //   this.setState({
    //     connectionInfo: connectionInfo.type,
    //   });
    //   console.log(
    //     'Initial, type: ' +
    //       connectionInfo.type +
    //       ', effectiveType: ' +
    //       connectionInfo.effectiveType,
    //   );
    // });

    // NetInfo.addEventListener(
    //   'connectionChange',
    //   this.handleFirstConnectivityChange,
    // );
  }

  handleFirstConnectivityChange(connectionInfo) {
    this.setState({
      connectionInfo: connectionInfo.type,
    });
    console.log(
      'First change, type: ' +
        connectionInfo.type +
        ', effectiveType: ' +
        connectionInfo.effectiveType,
    );

    if (connectionInfo.type != 'none') {
      this.setState({animating: 'false'}, this.componentDidMount);
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange,
    );
  }

  handleBackButtonClick() {
    return false;
  }

  backPressed = () => {
    Alert.alert(
      'Exit App',
      'Do you want to exit?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => BackHandler.exitApp()},
      ],
      {cancelable: false},
    );

    return true;
  };

  _handleConnectivityChange(status) {
    console.log(
      '*********_handleConnectivityChange: Network Connectivity status *******: ' +
        status,
    );
  }
  // Methods call for Login
  callapi() {
    callPostApi(GLOBAL.BASE_URL + GLOBAL.Login_Api, {
      email: this.state.username,
      password: this.state.password,
    }).then(response => {
      console.log('login user details ' + JSON.stringify(result));
      // Continue your code here...
      this.setState({animating: false});
      if (result.status == 'success') {
        this.setState({passwordError: ''});
        this.setState({usernameError: ''});
        AsyncStorage.setItem(
          PERSISTENT_LOGIN,
          this.state.persistentlogin.toString(),
        );
        AsyncStorage.setItem('userDetail', JSON.stringify(result.data)); //Save user detail in local storage
        this.moveToDashboard();
      } else {
        this.setState({passwordError: ''});
        this.setState({usernameError: ''});
        this.dropdown.alertWithType('error', 'Error', result.message);
      }
    });
  }
  // Method to get saved data from local storage
  getSavedData() {
    AsyncStorage.getItem('userDetail')
      .then(value => {
        Alert.alert('User Detail' + value);
      })
      .done();
  }
  // Method to move on signUp screen.
  moveToSignUp() {
    this.props.navigator.push({name: 'SignUp', index: 0});
  }
  // Method to move on signUp screen.
  moveToDashboard() {
    this.props.navigator.push({name: 'Dashboard', index: 0});
  }
  // Method to move on signUp screen.
  moveToForgotPassword() {
    this.props.navigator.push({name: 'ForgotPassword', index: 0});
  }
  // Method to move on signUp screen.
  moveToForgotUsername() {
    this.props.navigator.push({name: 'ForgotUsername', index: 0});
  }

  onRememberMe(val) {
    if (val == true) {
      this.state.persistentlogin = true;
    } else {
      this.state.persistentlogin = false;
    }
  }

  onIconClick(msg) {
    this.dropdown.alertWithType('error', 'Error', msg);
  }

  // Default render method and create UI for Login Screen
  render() {
    if (this.state.animating == true) {
      this.state.scrollvalue = false;
      this.state.visble = true;
    } else {
      this.state.scrollvalue = true;
      this.state.visble = false;
    }
    let showable;
    console.log(this.state, this.props, 'login render');
    return (
      <View>
        <Text>{JSON.stringify(this.state)}</Text>
      </View>
    );
    if (this.state.showPage) {
      showable = (
        <View style={Styles.backgroundImage}>
          <View>
            <Spinner
              visible={this.state.visble}
              textContent={'Loading...'}
              textStyle={{color: '#FFF'}}
            />
          </View>
          <View style={Styles.iphonexHeader} />
          <ImageBackground
            style={Styles.logoBackgroundStyle}
            source={Images.loginScreenBase}>
            <Image style={Styles.logoBackGround1} source={Images.logoImage} />
            <Image
              style={Styles.logoBackGround1}
              source={Images.costFirstText}
            />
          </ImageBackground>

          <ScrollView style={Styles.scroll_container}>
            <View style={Styles.viewContainer}>
              <View style={Styles.backgroundViewContainer}>
                <Image style={Styles.logoImage} source={Images.username} />
                <TextInput
                  ref={'Username'}
                  value={this.state.username.toString()}
                  placeholderTextColor={
                    this.state.usernameError == '' ? '#999999' : 'red'
                  }
                  placeholder={
                    this.state.usernameError == ''
                      ? STRINGS.t('Username')
                      : this.state.usernameError
                  }
                  underlineColorAndroid="transparent"
                  secureTextEntry={false}
                  style={Styles.textInput}
                  returnKeyType="next"
                  keyboardType="email-address"
                  onChangeText={val =>
                    this.setState({username: val, usernameError: ''})
                  }
                />
                {this.state.usernameError != '' ? (
                  <Icon
                    name="ios-alert"
                    onPress={() => this.onIconClick(this.state.usernameError)}
                    style={{color: 'red'}}
                  />
                ) : null}
              </View>
              <View style={Styles.lineViewTextBox} />
              {this.state.usernameError != '' ? (
                <View style={Styles.lineErrorView} />
              ) : (
                <View style={Styles.lineView} />
              )}
              <View style={Styles.backgroundViewContainer}>
                <Image style={Styles.logoImage} source={Images.password} />
                <TextInput
                  ref={'Password'}
                  value={this.state.password.toString()}
                  placeholderTextColor={
                    this.state.passwordError == '' ? '#999999' : 'red'
                  }
                  placeholder={
                    this.state.passwordError == ''
                      ? STRINGS.t('Password')
                      : this.state.passwordError
                  }
                  underlineColorAndroid="transparent"
                  secureTextEntry={true}
                  style={Styles.textInput}
                  onChangeText={val =>
                    this.setState({password: val, passwordError: ''})
                  }
                />
                {this.state.passwordError != '' ? (
                  <Icon
                    onPress={() => this.onIconClick(this.state.passwordError)}
                    name="ios-alert"
                    style={{color: 'red'}}
                  />
                ) : null}
              </View>
              <View style={Styles.lineViewTextBox} />
              {this.state.passwordError != '' ? (
                <View style={Styles.lineErrorView} />
              ) : (
                <View style={Styles.lineView} />
              )}
              <View style={Styles.checkBoxContainer}>
                <CheckBox
                  label={STRINGS.t('Remember_Me')}
                  onChange={this.onRememberMe.bind(this)}
                />
              </View>
              <TouchableOpacity
                style={Styles.buttonContainer}
                onPress={this.onLoginPress.bind(this)}>
                <Text style={Styles.style_btnLogin}> {STRINGS.t('Login')}</Text>
              </TouchableOpacity>

              <View style={Styles.forgotContainer}>
                <Text style={Styles.forgotStyles}> {STRINGS.t('Forgot')} </Text>

                <TouchableOpacity
                  onPress={this.moveToForgotUsername.bind(this)}>
                  <Text style={Styles.usernameAndPasswordStyles}>
                    {' '}
                    {STRINGS.t('USERNAME')}
                  </Text>
                </TouchableOpacity>
                <Text style={Styles.slashStyle}> / </Text>
                <TouchableOpacity
                  onPress={this.moveToForgotPassword.bind(this)}>
                  <Text style={Styles.usernameAndPasswordStyles}>
                    {' '}
                    {STRINGS.t('PASSWORD')}
                  </Text>
                </TouchableOpacity>
              </View>

              <KeyboardSpacer />
            </View>
          </ScrollView>

          <View style={Styles.footerParent}>
            <View style={Styles.footerlineView} />
            <View style={Styles.footerContainer}>
              <Text style={Styles.memberStyles}>
                {' '}
                {STRINGS.t('Not_A_Member')}{' '}
              </Text>
              <TouchableOpacity onPress={this.moveToSignUp.bind(this)}>
                <Text style={Styles.usernameAndPasswordStyles}>
                  {' '}
                  {STRINGS.t('SIGNUP')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={Styles.iphonexFooter} />
          </View>
          <DropdownAlert ref={ref => (this.dropdown = ref)} />
        </View>
      );
    } else {
      showable = <View />;
    }
    return <View style={{flex: 1}}>{showable}</View>;
  }
}

export default Login;
