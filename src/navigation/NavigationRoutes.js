// Tab Routes
import MainHome from '../containers/tabbar/main/HomeTab';
import TaskTab from '../containers/tabbar/taskList/TaskTab';

// // Screens Route
import Splash from '../containers/auth/Splash';
import WelcomeScreen from '../containers/WelcomeScreen';
import OnBoarding from '../containers/OnBoarding';
import Login from '../containers/auth/Login';
import TabBar from './Type/TabBarNavigation';
import Connect from '../containers/auth/Connect';
import SelfieWithId from '../containers/auth/SelfieWithId';
import HomeListCard from '../containers/tabbar/HomeListCard';
import ClientList from '../containers/tabbar/clientList/Index';
import ServiceList from '../containers/tabbar/serviceList/Index';
import DigiSign from '../containers/tabbar/DigiSign/Index';

export const TabRoute = {
  MainHome,
  TaskTab,
  ClientList,
  DigiSign,
};

export const StackRoute = {
  Splash,
  WelcomeScreen,
  OnBoarding,
  Login,
  TabBar,
  Connect,
  SelfieWithId,
  HomeListCard,
  ServiceList
};
