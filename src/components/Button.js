import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const ButtonComponent = ({title, onPress, disabled, color, icon}) => {
  const buttonStyle = [
    styles.button,
    {backgroundColor: color || '#1e90ff'},
    disabled && styles.disabled,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
      <View style={styles.container}>
        {icon && (
          <Icon name={icon} size={24} color="#fff" style={styles.icon} />
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 10,
  },
});

export default ButtonComponent;
