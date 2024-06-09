import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  StatusBar,
} from 'react-native';
import Icon from './Icons/Icon';
import DeviceInfo from 'react-native-device-info';

// Check if device has a notch
const hasNotch = DeviceInfo.hasNotch();

const CustomHeader = ({navigation, title}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon.MaterialIcons name="keyboard-backspace" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 0.4,
    borderBottomColor: '#ccc',
  },
  backButton: {
    paddingRight: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CustomHeader;
