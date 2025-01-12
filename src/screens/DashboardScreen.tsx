import React, { useEffect, useState } from "react";
import {
  View,
  Text,
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

  // Pagination
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = healthData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const storedUser = await AsyncStorage.getItem("user"); 
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          const data = await fetchHealthDataByUser(parsedUser.id);
          setHealthData(data);
        } else {
          Alert.alert("Error", "No se encontró información del usuario.");
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching health data:", error);
        Alert.alert("Error", "No se pudo cargar la información. Inténtalo de nuevo más tarde.");
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

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <>
          <Text style={styles.welcomeText}>Bienvenido, {user.name}!</Text>
          <Text style={styles.emailText}>Correo: {user.email}</Text>

          <Text style={styles.sectionTitle}>Historial de Salud</Text>
          {currentItems.length > 0 ? (
            <>
              <FlatList
                data={currentItems}
                keyExtractor={(item: any) => item._id}
                renderItem={({ item }: any) => (
                  <View style={styles.card}>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Ritmo Cardíaco:</Text>{" "}
                      {item.heartRate} bpm
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Presión Arterial:</Text>{" "}
                      {item.bloodPressure}
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Nivel de Oxígeno:</Text>{" "}
                      {item.oxygenLevel}%
                    </Text>
                    <Text style={styles.cardText}>
                      <Text style={styles.boldText}>Fecha:</Text>{" "}
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                )}
              />

              {/* Paginator */}
              <View style={styles.pagination}>
                <TouchableOpacity
                  onPress={prevPage}
                  disabled={currentPage === 1}
                  style={[
                    styles.pageButton,
                    currentPage === 1 && styles.disabledButton,
                  ]}
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
                    currentPage ===
                      Math.ceil(healthData.length / itemsPerPage) &&
                      styles.disabledButton,
                  ]}
                >
                  <Text style={styles.pageButtonText}>Siguiente</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.noDataText}>
              No hay datos clínicos disponibles.
            </Text>
          )}
        </>
      ) : (
        <Text style={styles.noDataText}>Cargando información del usuario...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
    color: "#555",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "bold",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  pageButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: "#ddd",
  },
  pageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    color: "#333",
  },
  noDataText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 16,
  },
});

export default DashboardScreen;
