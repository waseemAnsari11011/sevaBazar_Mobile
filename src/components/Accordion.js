import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Animated, StyleSheet} from 'react-native';
import Icon from './Icons/Icon';
// import { MaterialIcons } from '@expo/vector-icons';

const Accordion = ({title, children}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animatedHeight, setAnimatedHeight] = useState(new Animated.Value(0));

  const toggleAccordion = () => {
    if (isOpen) {
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setIsOpen(!isOpen);
  };

  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, children ? 200 : 0],
  });

  return (
    <View>
      <TouchableOpacity style={styles.titleContainer} onPress={toggleAccordion}>
        <Text style={styles.title}>{title}</Text>
        <Icon.MaterialIcons
          name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <Animated.View style={[styles.contentContainer, {height: height}]}>
        {isOpen ? children : null}
      </Animated.View>
      <View style={styles.borderBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    overflow: 'hidden',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Accordion;
