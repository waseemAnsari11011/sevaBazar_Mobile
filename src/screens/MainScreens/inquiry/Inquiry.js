import { StyleSheet, Text, TextInput, Button, View, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInquiry, fetchInquiries } from '../../../config/redux/actions/inquiryActions';
import Icon from '../../../components/Icons/Icon';

const Inquiry = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const inquiries = useSelector(state => state.inquiry.inquiries);
  const loading = useSelector(state => state.inquiry.loading);
  const userId = useSelector(state => state.local.data.user._id);

  useEffect(() => {
    dispatch(fetchInquiries(userId));
  }, [dispatch]);

  const handleSubmit = () => {
    dispatch(createInquiry(subject, message, userId));
    setModalVisible(false);
    setSubject('');
    setMessage('');
  };
  const inquiryListItem = ({ item }) => {

    console.log("enquiry->", item)

    // Parse the ISO 8601 date string into a Date object
    const createdAtDate = new Date(item.createdAt);
    const responedDate = new Date(item.respondedAt);

    // Format the date as desired (for example: "June 9, 2024 10:35 AM")
    const formattedCreatedDate = `${createdAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${createdAtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    const formattedRespondedDate = `${responedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${createdAtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

    return (
      <View style={stylesListItem.inquiryItem}>
        <View style={stylesListItem.userSection}>
          <Text style={stylesListItem.userName}>{item.subject}</Text>
          <Text style={stylesListItem.date}>• {formattedCreatedDate}</Text>
        </View>
        <Text style={stylesListItem.inquiryResponseText}>{item.message}</Text>
        {item.response && <View style={stylesListItem.userComment}>
          <Text style={stylesListItem.commentDate}>Response on {formattedRespondedDate}</Text>
          <Text style={stylesListItem.commentText}>{item.response}</Text>
        </View>}
      </View>
    )
  };



  return (
    <View style={styles.container}>
      <Button title="Open Inquiry Form" onPress={() => setModalVisible(true)} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={inquiries}
          keyExtractor={(item) => item._id.toString()}
          renderItem={inquiryListItem}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
              <Text style={styles.title}>Submit an Inquiry</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} >
              <Icon.MaterialIcons name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Subject</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter subject"
              value={subject}
              onChangeText={setSubject}
            />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter message"
              value={message}
              onChangeText={setMessage}
              multiline={true}
              numberOfLines={4}
            />

            <Button title="Submit" onPress={handleSubmit} />

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Inquiry;

const stylesListItem = StyleSheet.create({
  inquiryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  responseLabel: {
    fontSize: 14,
    color: '#666',
  },
  designClass: {
    color: '#0066cc',
  },
  inquiryResponseText: {
    fontSize: 16,
    marginVertical: 8,
  },
  userComment: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  commentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  inquiryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  inquirySubject: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inquiryMessage: {
    fontSize: 16,
    marginVertical: 8,
  },
  inquiryResponse: {
    fontSize: 16,
    color: 'green',
  },
  inquiryStatus: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
