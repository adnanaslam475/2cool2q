import React from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import LoginScreen from "../screens/user/login";
import RegisterScreen from "../screens/user/register";
import MenuScreen from "../screens/menu/menu";
import MainScreen from "../screens/main";
import ForgotScreen from "../screens/user/forgot";
import FeedbackScreen from "../screens/feedback/feedback";

const RootStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },
  Menu: {
    screen: MenuScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },
  Main: {
    screen: MainScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },
  ForgotPassword: {
    screen: ForgotScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },

  Feedback: {
    screen: FeedbackScreen,
    navigationOptions: {
      headerShown: false,
      gestureEnabled: false,
    },
  },
});

const AppNavigator = createAppContainer(RootStack);
export default AppNavigator;
