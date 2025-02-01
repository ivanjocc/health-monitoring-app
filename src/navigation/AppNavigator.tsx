import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import DashboardScreen from "../screens/DashboardScreen";
import HealthDataInputScreen from "../screens/HealthDataInputScreen";
import HealthChartScreen from "../screens/HealthChartScreen";
import { TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createStackNavigator();

export default function AppNavigator({ navigation }: any) {
  const handleLogout = async (navigation: any) => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={({ navigation }) => ({
            title: "Panel de Control",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => handleLogout(navigation)}
                style={{
                  marginRight: 15,
                  padding: 8,
                  backgroundColor: "#d9534f",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="HealthDataInput" component={HealthDataInputScreen} />
        <Stack.Screen name="HealthChart" component={HealthChartScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// .