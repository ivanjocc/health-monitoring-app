import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HealthDataInputScreen = ({ navigation }: any) => {
  const [heartRate, setHeartRate] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [oxygenLevel, setOxygenLevel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveHealthData = async () => {
    if (!heartRate || !bloodPressure || !oxygenLevel) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Error", "No se encontró información del usuario.");
        return;
      }

      const user = JSON.parse(storedUser);
      const response = await fetch("http://127.0.0.1:5001/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          heartRate,
          bloodPressure,
          oxygenLevel,
          createdAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo guardar la información.");
      }

      setHeartRate("");
      setBloodPressure("");
      setOxygenLevel("");
      Alert.alert("Éxito", "Datos guardados correctamente.");
      navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      console.error("Error al guardar datos:", error);
      Alert.alert("Error", "No se pudo guardar la información.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("HealthChart")}
        style={styles.chartButton}
      >
        <Text style={styles.chartButtonText}>Ver Gráficos</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Ingresar Datos de Salud</Text>

      <TextInput
        style={styles.input}
        placeholder="Ritmo Cardíaco (bpm)"
        keyboardType="numeric"
        value={heartRate}
        onChangeText={setHeartRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Presión Arterial (ej: 120/80)"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />

      <TextInput
        style={styles.input}
        placeholder="Nivel de Oxígeno (%)"
        keyboardType="numeric"
        value={oxygenLevel}
        onChangeText={setOxygenLevel}
      />

      <TouchableOpacity
        onPress={handleSaveHealthData}
        style={styles.saveButton}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar Datos</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  saveButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  chartButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  chartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HealthDataInputScreen;
