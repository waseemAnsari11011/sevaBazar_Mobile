import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';

const Loading = ({isLoading}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isLoading}
    onRequestClose={() => {}}>
    <View style={styles.container}>
      <View style={styles.modal}>
        <ActivityIndicator size="small" color="#fff" />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 10,
  },
});

export default Loading;
