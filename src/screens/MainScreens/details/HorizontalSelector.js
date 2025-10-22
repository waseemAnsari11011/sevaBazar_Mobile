// src/screens/MainScreens/details/HorizontalSelector.js

import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const HorizontalSelector = ({
  attributeName,
  options,
  selectedValue,
  onSelect,
  isOptionAvailable,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{attributeName}:</Text>
      <View style={styles.optionsContainer}>
        {options.map(option => {
          const isSelected = selectedValue === option;
          const isAvailable = isOptionAvailable(attributeName, option);

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                isSelected && styles.selectedOption,
                !isAvailable && styles.disabledOption,
              ]}
              onPress={() => isAvailable && onSelect(attributeName, option)}
              activeOpacity={isAvailable ? 0.7 : 1}
              disabled={!isAvailable}>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.selectedOptionText,
                  !isAvailable && styles.disabledOptionText,
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  selectedOption: {
    borderColor: '#e84118',
    backgroundColor: '#e84118',
  },
  disabledOption: {
    borderColor: '#e0e0e0',
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  optionText: {
    fontSize: 14,
    color: '#555',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledOptionText: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
});

export default HorizontalSelector;
