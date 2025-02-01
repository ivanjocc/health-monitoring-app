import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchHealthDataByUser } from "../services/api";

const DashboardScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");

  // Pagination
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          let data = await fetchHealthDataByUser(parsedUser.id);

          // Ordenar datos por fecha (de más reciente a más antigua)
          data.sort(
            (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setHealthData(data);
        } else {
          Alert.alert("Error", "No se encontró información del usuario.");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
        Alert.alert(
          "Error",
          "No se pudo cargar la información. Inténtalo de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const nextPage = () => {
    if (currentPage < Math.ceil(healthData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {user.name}!</Text>
          <Text style={styles.emailText}>Correo: {user.email}</Text>

          <View style={styles.logoutContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>

          {/* Health Data */}
          <Text style={styles.sectionTitle}>Historial de Salud</Text>
          <FlatList
            data={healthData.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            keyExtractor={(item: any) => item._id}
            renderItem={({ item }: any) => (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <Text style={styles.boldText}>🫀 Ritmo Cardíaco:</Text>
                  <Text style={styles.cardValue}>{item.heartRate} bpm</Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.boldText}>🩸 Presión Arterial:</Text>
                  <Text style={styles.cardValue}>{item.bloodPressure}</Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.boldText}>🌬️ Nivel de Oxígeno:</Text>
                  <Text style={styles.cardValue}>{item.oxygenLevel}%</Text>
                </View>

                <View style={styles.cardRow}>
                  <Text style={styles.boldText}>📅 Fecha:</Text>
                  <Text style={styles.cardValue}>
                    {new Date(item.createdAt).toLocaleString()}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              <View style={styles.pagination}>
                <TouchableOpacity
                  onPress={prevPage}
                  disabled={currentPage === 1}
                  style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
                >
                  <Text style={styles.pageButtonText}>Anterior</Text>
                </TouchableOpacity>
                <Text style={styles.pageIndicator}>
                  Página {currentPage} de{" "}
                  {Math.ceil(healthData.length / itemsPerPage)}
                </Text>
                <TouchableOpacity
                  onPress={nextPage}
                  disabled={
                    currentPage === Math.ceil(healthData.length / itemsPerPage)
                  }
                  style={[
                    styles.pageButton,
                    currentPage === Math.ceil(healthData.length / itemsPerPage) &&
                      styles.disabledButton,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        </>
      ) : (
        <Text style={styles.noDataText}>Cargando información del usuario...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  welcomeText: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  emailText: { fontSize: 16, textAlign: "center", color: "#555", marginBottom: 16 },
  logoutContainer: { alignItems: "center", marginBottom: 20 },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  boldText: { fontSize: 16, fontWeight: "bold", color: "#333" },
  cardValue: { fontSize: 16, color: "#007bff", fontWeight: "bold" },
  pagination: { flexDirection: "row", justifyContent: "center", paddingBottom: 20 },
  pageButton: { padding: 12, backgroundColor: "#007bff", borderRadius: 8, marginHorizontal: 10 },
  disabledButton: { backgroundColor: "#ddd" },
  pageButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  pageIndicator: { fontSize: 16, fontWeight: "bold", color: "#333" },
  noDataText: { fontSize: 16, color: "#999", textAlign: "center", marginTop: 16 },
});

export default DashboardScreen;
