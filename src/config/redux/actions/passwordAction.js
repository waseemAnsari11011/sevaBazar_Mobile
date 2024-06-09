import api from '../../../utils/api';

export const sendOtp = body => {
  console.log('body', body);

  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/send_mail_otp', body);
      resolve({
        success: true,
        message: 'otp sent successfully',
        data: response.data,
      });
    } catch (error) {
      //   console.log('err', error.response.data.error.message);
      reject({
        success: false,
        message: error.response.data.error.message,
        data: error,
      });
    }
  });
};

export const verifyOtp = body => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/verify_otp', body);
      resolve({
        success: true,
        message: 'otp verified successfully',
        data: response.data,
      });
    } catch (error) {
      reject({success: false, message: 'otp not verified', data: error});
    }
  });
};

export const updatePassword = body => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.post('/update_forget_pass', body);
      resolve({
        success: true,
        message: 'password updated successfully',
        data: response.data,
      });
    } catch (error) {
      reject({success: false, message: error, data: error});
    }
  });
};
