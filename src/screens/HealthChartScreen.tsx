import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchHealthDataByUser } from "../services/api";
import { useFocusEffect } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HealthChartScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        let data = await fetchHealthDataByUser(parsedUser.id);

        data.sort((a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt));
        setHealthData(data);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Text onPress={() => navigation.navigate("Dashboard")} style={styles.headerButton}>
          Volver al Dashboard
        </Text>
      ),
    });
  }, [navigation]);

  // Extraer datos 📊
  const heartRates = healthData.map((item: any) => item.heartRate);
  const oxygenLevels = healthData.map((item: any) => item.oxygenLevel);
  const bloodPressures = healthData.map((item: any) => parseInt(item.bloodPressure.split("/")[0]));
  const labels = healthData.map((_, index) => index + 1);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <Text style={styles.title}>Gráficos de Salud</Text>

          <View style={styles.chartsContainer}>
            {/* 📊 Ritmo Cardíaco */}
            {heartRates.length > 0 && (
              <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Ritmo Cardíaco</Text>
                <LineChart
                  data={{
                    labels: labels.slice(-5),
                    datasets: [{ data: heartRates.slice(-5) }],
                  }}
                  width={screenWidth * 0.85}
                  height={screenHeight * 0.20} // Reducido
                  yAxisSuffix=" bpm"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {/* 📊 Nivel de Oxígeno */}
            {oxygenLevels.length > 0 && (
              <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Nivel de Oxígeno</Text>
                <LineChart
                  data={{
                    labels: labels.slice(-5),
                    datasets: [{ data: oxygenLevels.slice(-5) }],
                  }}
                  width={screenWidth * 0.85}
                  height={screenHeight * 0.20} // Reducido
                  yAxisSuffix="%"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}

            {/* 📊 Presión Arterial Sistólica */}
            {bloodPressures.length > 0 && (
              <View style={styles.chartBox}>
                <Text style={styles.chartTitle}>Presión Arterial (Sistólica)</Text>
                <LineChart
                  data={{
                    labels: labels.slice(-5),
                    datasets: [{ data: bloodPressures.slice(-5) }],
                  }}
                  width={screenWidth * 0.85}
                  height={screenHeight * 0.20} // Reducido
                  yAxisSuffix=" mmHg"
                  chartConfig={chartConfig}
                  bezier
                  style={styles.chart}
                />
              </View>
            )}
          </View>
        </>
      ) : (
        <Text style={styles.noDataText}>Cargando información del usuario...</Text>
      )}
    </View>
  );
};

// 📊 Configuración general de los gráficos
const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(34, 202, 236, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: { r: "6", strokeWidth: "2", stroke: "#22caec" },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Centrar contenido
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  chartsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  chartBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: screenWidth * 0.90,
    alignItems: "center",
    elevation: 3, // Sombra en Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  chart: {
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
  headerButton: {
    color: "#007bff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 15,
  },
});

export default HealthChartScreen;
