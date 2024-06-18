import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from '../../../components/Icons/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { fetchContact } from '../../../config/redux/actions/contactActions';
import Loading from '../../../components/Loading';

const Contactus = () => {
    const dispatch = useDispatch();
    const { contact, loading, error } = useSelector(state => state.contact);
  
    useEffect(() => {
      dispatch(fetchContact());
    }, [dispatch]);

if(loading){
    return <Loading />
}
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>You can get in touch with us through below platforms. Our Team will reach out to you as soon as it would be possible</Text>
      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Icon.FontAwesome name="phone" size={24} color="black" />
          <Text style={styles.contactText}>{contact.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Icon.FontAwesome name="envelope" size={24} color="black" />
          <Text style={styles.contactText}>{contact.email}</Text>
        </View>
      </View>
      <View style={styles.socialContainer}>
        <View style={styles.socialItem}>
          <Icon.FontAwesome name="instagram" size={24} color="#C13584" />
          <Text style={styles.socialText}>{contact.instagramId}</Text>
        </View>
        <View style={styles.socialItem}>
          <Icon.FontAwesome name="twitter" size={24} color="#1DA1F2" />
          <Text style={styles.socialText}>{contact.twitterId}</Text>
        </View>
        <View style={styles.socialItem}>
          <Icon.FontAwesome name="facebook" size={24} color="#4267B2" />
          <Text style={styles.socialText}>{contact.facebookId}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Seva Bazar</Text>
        <Text style={styles.footerSubText}>Since 2024</Text>
      </View>
    </View>
  );
}

export default Contactus;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  contactContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 10,
  },
  socialContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  socialText: {
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
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
