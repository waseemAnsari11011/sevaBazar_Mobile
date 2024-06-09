import AsyncStorage from '@react-native-async-storage/async-storage';

// Action to save data to AsyncStorage
export const saveData = (key, value) => {
  return async dispatch => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      dispatch({type: 'SAVE_DATA_SUCCESS', payload: {key, value}});
    } catch (error) {
      dispatch({type: 'SAVE_DATA_ERROR', payload: error});
    }
  };
};

// Action to load data from AsyncStorage
export const loadData = key => {
  return async dispatch => {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        dispatch({
          type: 'LOAD_DATA_SUCCESS',
          payload: {key, value: JSON.parse(data)},
        });
        return {success: true, data: JSON.parse(data)};
      } else {
        dispatch({type: 'LOAD_DATA_ERROR', payload: 'Data not found'});
        return {success: false, data: 'Data not found'};
      }
    } catch (error) {
      dispatch({type: 'LOAD_DATA_ERROR', payload: error});
      return {success: false, data: 'Data not found'};
    }
  };
};

export const deleteData = key => {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem(key);
      dispatch({type: 'DELETE_DATA_SUCCESS', payload: {key, value}});
    } catch (error) {
      dispatch({type: 'DELETE_DATA_ERROR', payload: error});
    }
  };
};

export const clearAllData = () => async dispatch => {
  try {
    await AsyncStorage.clear(); // Clear local storage
    dispatch({type: 'CLEAR_ALL_DATA'});
  } catch (error) {
    console.error(error);
    dispatch({type: 'CLEAR_ALL_DATA_ERROR', payload: error});
  }
};
