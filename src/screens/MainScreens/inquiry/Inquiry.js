import { StyleSheet, Text, TextInput, Button, View, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createInquiry, fetchInquiries } from '../../../config/redux/actions/inquiryActions';
import Icon from '../../../components/Icons/Icon';
import ButtonComponent from '../../../components/Button';
import { Card, Title, Paragraph } from 'react-native-paper';

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
  const InquiryListItem = ({ item, isLastItem }) => {


    const createdAtDate = new Date(item.createdAt);
    const respondedDate = new Date(item.respondedAt);

    const formattedCreatedDate = `${createdAtDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${createdAtDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    const formattedRespondedDate = `${respondedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${respondedDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;

    return (
      <Card style={[stylesListItem.card, isLastItem && stylesListItem.lastCard]}>
        <Card.Content>
          <View style={stylesListItem.userSection}>
            <Title style={stylesListItem.userName}>{item.subject}</Title>
            <Text style={stylesListItem.date}>• {formattedCreatedDate}</Text>
          </View>
          <Paragraph style={stylesListItem.inquiryResponseText}>{item.message}</Paragraph>
          {item.response && (
            <View style={stylesListItem.userComment}>
              <Text style={stylesListItem.commentDate}>Response on {formattedRespondedDate}</Text>
              <Paragraph style={stylesListItem.commentText}>{item.response}</Paragraph>
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };




  return (
    <View style={styles.container}>
      <ButtonComponent title="Open Inquiry Form" onPress={() => setModalVisible(true)} color={'#ff6600'} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View style={{ marginTop: 20, paddingBottom:30 }}>
          <FlatList
            data={inquiries}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item, index }) => (
              <InquiryListItem
                item={item}
                index={index}
                isLastItem={index === inquiries.length - 1}
              />
            )}
          />
        </View>


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

            <ButtonComponent color={'#ff6600'} title="Submit" onPress={handleSubmit} />

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Inquiry;

const stylesListItem = StyleSheet.create({
  card: {
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  lastCard: {
    marginBottom: 16,
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
  inquiryResponseText: {
    fontSize: 16,
    marginVertical: 8,
  },
  userComment: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#C7F6C770',
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
    padding: 15,
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
    color: '#ff6600',
  },
  inquiryStatus: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
