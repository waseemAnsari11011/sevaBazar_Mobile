import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LogoutButton from '../../utils/logout';
import DeviceInfo from 'react-native-device-info';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../components/Icons/Icon';
import { baseURL } from '../../utils/api';
import { fetchContact } from '../../config/redux/actions/contactActions';

// Check if device has a notch
const hasNotch = DeviceInfo.hasNotch();
const phoneNumber = '8116341826'; // The phone number you want to call

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.local);
  const { contact, loading, error } = useSelector(state => state.contact);

  useEffect(() => {
    dispatch(fetchContact());
  }, [dispatch]);

  console.log('contact us--->>', contact);

  let url = data.user.image;
  // console.log('url', url);

  if (url?.startsWith('http:')) {
    // Replace "http" with "https"
    url = url.replace('http:', 'https:');
  } else if (url && url.includes('uploads/customer')) {
    url = `${baseURL}${url}`;
  }

  const openLink = () => {
    Linking.openURL('https://waizcom.com');
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'space-between',
      }}>
      <View>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: `#f5fffa`,
            padding: 20,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: hasNotch ? 80 : 20,
          }}>
          <View style={{ flexDirection: 'row' }}>
            {url && (
              <Image
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: 'contain',
                  borderRadius: 25,
                  marginRight: 15,
                }}
                source={{ uri: url }}
              />
            )}
            {!url && (
              <Image
                style={{
                  height: 50,
                  width: 50,
                  resizeMode: 'contain',
                  borderRadius: 25,
                  marginRight: 15,
                }}
                source={require('../../assets/images/default_profile.png')}
              />
            )}
            <View>
              <Text style={{ color: 'black', fontSize: 20, fontWeight: '600' }}>
                {data.user.name}
              </Text>
              {/* <View style={{flexDirection: 'row', marginTop: 5}}>
              <Ionicons name="call-outline" size={20} />
              <Text style={{marginLeft: 10}}>{data.user.mobile_number}</Text>
            </View> */}
            </View>
          </View>
          <LogoutButton />
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 16, color: 'black', fontWeight: '600' }}>
            Your delivery address
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 8,
              alignItems: 'center',
            }}>
            <View>
              <Text
                style={{
                  fontSize: 17,
                  color: 'black',
                  width: 250,
                  fontWeight: '300',
                }}>
                {data.user.shippingAddresses
                  .filter(i => i.isActive == true)
                  .map(i => i.address)}
              </Text>
            </View>


            <AntDesign
              onPress={() => navigation.navigate('Location List', { goBack: true })}
              name="edit"
              style={{ color: `#000066` }}
              size={20}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Support Ticket')}
          style={styles.needHelpContainer}>
          <View style={styles.itemSubContainer}>
            <Image
              style={[styles.itemImage, { height: 30, width: 30 }]}
              source={require('../../assets/images/headphone.png')}
            />
            <View style={{}}>
              <Text
                style={[styles.itemTitle, { fontWeight: '600', fontSize: 15 }]}>
                Need Help?
              </Text>
              <Text style={{ fontWeight: '300', fontSize: 13 }}>
                We're here for you
              </Text>
            </View>
          </View>
          <AntDesign name="right" style={{ color: 'black' }} size={20} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Edit Profile')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.FontAwesome
              name="user"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Edit Profile</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Location List', { goBack: true })}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.Ionicons
              name="location-sharp"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Shipping Addresses</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('My order')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.Entypo
              name="shopping-cart"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>My orders</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Order History')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.FontAwesome
              name="history"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Order History</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Submit Inquiry')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.FontAwesome
              name="inbox"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Inquiries</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Faqs')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.AntDesign
              name="questioncircle"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Faqs</Text>
          </View>
          <AntDesign name="right" style={{ color: '#000066' }} size={20} />
        </TouchableOpacity>
        <View style={styles.borderBottom}></View>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('Contact us')}
          style={styles.itemContainer}>
          <View style={styles.itemSubContainer}>
            <Icon.Ionicons
              name="call"
              style={styles.itemIcon}
              size={24}
              color="#000066"
            />
            <Text style={styles.itemTitle}>Contact Us</Text>
          </View>
          <AntDesign name="right" style={{color: '#000066'}} size={20} />
        </TouchableOpacity> */}
        {/* <View style={styles.borderBottom}></View> */}
      </View>
      {/* <View style={styles.footer}>
        <Text style={styles.footerText}>Seva Bazar</Text>
        <Text style={styles.footerSubText}>© 2024 Seva Bazar.</Text>
        <TouchableOpacity onPress={openLink}>
          <Text style={[styles.footerSubText, { color: 'blue', textDecorationLine: 'underline' }]}>
            Developed by Waizcom.com
          </Text>
        </TouchableOpacity>
      </View> */}
    </ScrollView>
  );
};
export default ProfileScreen;
const styles = StyleSheet.create({
  borderBottom: {
    borderWidth: 0.7,
    marginLeft: 10,
    marginRight: 10,
    borderColor: `#d3d3d3`,
  },
  itemContainer: {
    padding: 20,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemImage: {
    height: 38,
    width: 38,
    marginRight: 10,
    resizeMode: 'contain',
    padding: 10,
  },
  itemTitle: { color: 'black', fontSize: 16, fontWeight: '400', marginLeft: 10 },
  itemSubContainer: { flexDirection: 'row', alignItems: 'center' },
  needHelpContainer: {
    padding: 15,
    backgroundColor: '#CF9FFF55',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
  },
  footerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerSubText: {
    fontSize: 16,
    color: '#666',
  },
});
