import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';

const ErrorAlert = ({errorMessage, onClose}) => {
  const {error} = useSelector(state => state.auth);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={Boolean(errorMessage)}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.message}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ErrorAlert;
