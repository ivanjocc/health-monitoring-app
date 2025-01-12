import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function Input({ placeholder, secureTextEntry = false }: { placeholder: string; secureTextEntry?: boolean }) {
  return <TextInput style={styles.input} placeholder={placeholder} secureTextEntry={secureTextEntry} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});
