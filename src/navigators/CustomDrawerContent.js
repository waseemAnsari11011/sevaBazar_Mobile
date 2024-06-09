import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Dimensions,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Icon from '../components/Icons/Icon';
import LogoutButton, {showAlert} from '../utils/logout';
import {useSelector} from 'react-redux';
const windowWidth = Dimensions.get('window').width;

const CustomDrawerContent = props => {
  const {data} = useSelector(state => state.local);

  // console.log(data);

  const handleLogout = () => {
    console.log('User logged out');
  };

  return (
    <View style={styles.drawerContainer}>
      <ImageBackground
        source={require('../assets/images/drawer_back_food.gif')}
        style={styles.drawerHeader}>
        <View style={styles.imageOverlay} />
        <Image
          style={{height: 100, width: 100, borderRadius: 50}}
          source={
            data.user?.image_url ===
            'https://poon2.xonierconnect.com/storage/images/users/'
              ? require('../assets/images/default_profile.png')
              : {uri: data.user.image_url}
          }
        />
        <View style={{marginTop: 15, alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 22, fontWeight: '700'}}>
            {data.user.name}
          </Text>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '500'}}>
            {data.user.email}
          </Text>
        </View>
      </ImageBackground>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={styles.logoutButton} onPress={showAlert}>
          <LogoutButton isVisible={true} />
        </View>
      </DrawerContentScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    height: windowWidth / 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawerHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  logoutButtonText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#DB4437',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default CustomDrawerContent;
