import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Correct import for Ionicons
import { fetchFAQs } from '../../../config/redux/actions/faqActions';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../../components/Loading';

const Faqs = () => {
    const dispatch = useDispatch();
    const { loading, error, faqs } = useSelector((state) => state.faq);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        dispatch(fetchFAQs());
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    const renderItem = ({ item }) => {
        const isSelected = item._id === selectedId;

        return (
            <View>
                <TouchableOpacity onPress={() => setSelectedId(isSelected ? null : item._id)}>
                    <View style={[styles.questionContainer, isSelected && {
                       
                        marginBottom:0
                    }]}>
                        <Text style={styles.questionText}>{item.question}</Text>
                        <Icon
                            name={isSelected ? 'chevron-up' : 'chevron-down'}
                            size={20}
                            color="green"
                        />
                    </View>
                </TouchableOpacity>
                {isSelected && (
                    <View style={styles.answerContainer}>
                        <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={faqs}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                extraData={selectedId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'white',
    },
    headerText: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    questionContainer: {
        borderRadius:10,
        marginBottom:15,
        backgroundColor: '#C7F6C770',
        padding: 16,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center'
    },
    questionText: {
        fontSize: 17,
        width: '90%',
    },
    answerContainer: {
        padding: 16,
        borderWidth:1,
        borderRadius:10,
        marginVertical:15,
        borderColor:'green'
         
    },
    answerText: {
        fontSize: 16,
    },
});

export default Faqs;
