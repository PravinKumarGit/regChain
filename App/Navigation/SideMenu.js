import PropTypes from "prop-types";
import React, { Component } from "react";
import { NavigationActions } from "react-navigation";
import { connect } from "react-redux";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  AsyncStorage,
  DeviceEventEmitter,
  ImageBackground
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { Images } from "../Themes";
import styles from "./Styles/SideMenuStyle";
import constants from "../Config/constants";
import config from "../Config/AppConfig";
class SideMenu extends Component {
  constructor() {
    super();
    this.state = {
      valid: null,
      listData: []
    };
  }
  navigateToScreen(route, param) {
    this.props.navigation.closeDrawer();
    // this.props.navigation.navigate(route, param);
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      params: param
    });
    this.props.navigation.dispatch(navigateAction);
  }
  async componentDidMount() {
    DeviceEventEmitter.addListener("LoggedIn", () => {
      this.setState({ valid: true, listData: constants.LOGGEDIN_MENU });
    });
    await this.checkValid();
  }
  checkValid() {
    AsyncStorage.getItem("token").then(token => {
      console.log("toekn", token);
      if (token) {
        this.setState({ valid: true, listData: constants.LOGGEDIN_MENU });
      } else {
        this.setState({ listData: constants.MENU });
      }
    });
  }
  async Logout() {
    this.state.listData.forEach(value => {
      value.selected = false;
    });
    this.state.listData[0].selected = true;
    if (this.state.valid) {
      await AsyncStorage.removeItem("token");
      this.navigateToScreen("LaunchScreen");
      this.setState({
        valid: false,
        listData: constants.MENU
      });
    } else {
      this.navigateToScreen("LoginScreen");
    }
  }
  optionSelected(data) {
    this.state.listData.forEach(value => {
      value.selected = false;
    });
    data.selected = true;
    switch (data.option) {
      case "Home":
        {
          this.navigateToScreen("LaunchScreen");
        }
        break;
      case "Profile":
        {
          this.navigateToScreen("ProfileScreen");
        }
        break;
      case "Subscriptions":
        {
          this.navigateToScreen("SubscriptionDetail");
        }
        break;
      // case "Videos":
      //   {
      //     this.navigateToScreen("Videos", {
      //       url: config.YOUTUBE_URL
      //     });
      //   }
      //   break;
      // case "Community Events":
      //   {
      //     this.navigateToScreen("Videos", {
      //       url: config.COMMUNITY_EVENTS_URL
      //     });
      //   }
      //   break;
      case "Contact Us":
        {
          this.navigateToScreen("ContactUs");
        }
        break;
      case "Terms & Conditions":
        {
          this.navigateToScreen("TermsAndConditions");
        }
        break;
      case "Notifications":
        {
          this.navigateToScreen("Notifications");
        }
        break;
      case "Welcome Video":
        {
          this.navigateToScreen("IntroVideo", {
            url: config.WELCOME_VIDEO
          });
        }
        break;
    }
    this.setState({});
  }
  render() {
    const List = this.state.listData.map(data => {
      return (
        <View key={data.option}>
          <View style={styles.horizontalLine} />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => this.optionSelected(data)}
            style={styles.navSectionStyle}
          >
            <Text
              style={
                data.selected ? styles.navItemStyleSeleted : styles.navItemStyle
              }
            >
              {data.option}
            </Text>
            <Image
              source={data.selected ? Images.orangeArrow : Images.greyArrow}
              style={styles.arrow}
            />
          </TouchableOpacity>
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <ScrollView>
          <View>
            <Text style={styles.sectionHeadingStyle}>Menu</Text>
            {List}
            <View style={styles.horizontalLine} />
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                // onPress={() => this.optionSelected(data)}
                style={styles.navSectionStyle}
              >
                <Text style={styles.navItemStyle}>App Version</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 10
                  }}
                >
                  <Text style={styles.navItemStyleSeleted}>{DeviceInfo.getVersion()}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.horizontalLine} />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => this.Logout()}
              style={styles.navSectionStyle}
            >
              <Text style={styles.navItemStyle}>
                {this.state.valid ? "Logout" : "Login"}
              </Text>
            </TouchableOpacity>
            <View style={styles.horizontalLine} />
          </View>
        </ScrollView>
        <ImageBackground
          source={Images.loginBottom}
          style={styles.footerBottom}
          resizeMode="stretch"
        ></ImageBackground>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch({ type: "USER_LOGOUT" });
    }
  };
};

export default connect(mapDispatchToProps)(SideMenu);
