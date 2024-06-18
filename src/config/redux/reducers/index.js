import { combineReducers } from 'redux';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import storageReducer from './storageReducer';
import profileReducer from './profileReducer';
import similarProductsReducer from './similiarProductsReducer';
import productsByCategoryReducer from './productsByCategoryReducer';
import recentlyAddedProductsReducer from './recentlyAddedReducer';
import categoryReducer from './categoryReducer';
import discountedProductsReducer from './discountedProductsReducers';
import searchReducer from './searchReducer';
import ordersReducer from './orderReducer';
import inquiryReducer from './inquiryReducer';
import faqReducer from './faqReducer';
import contactReducer from './contactReducer';
import customerReducer from './customerReducer';
import bannerReducer from './bannerReducer';
import productReducer from './productReducer';

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  local: storageReducer,
  profile: profileReducer,
  similarProducts: similarProductsReducer,
  categoryProducts: productsByCategoryReducer,
  recentlyAddedProducts: recentlyAddedProductsReducer,
  categories: categoryReducer,
  discountedProducts: discountedProductsReducer,
  search: searchReducer,
  orders: ordersReducer,
  inquiry: inquiryReducer,
  faq: faqReducer,
  contact: contactReducer,
  customer: customerReducer,
  banners: bannerReducer,
  product: productReducer
});

export default rootReducer;
