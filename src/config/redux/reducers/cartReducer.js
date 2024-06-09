import {
  DECREASE_QUANTITY,
  ADD_TO_CART,
  CLEAR_CART,
  REMOVE_ITEM,
} from '../actions/types';

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
  response: null,
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      // Check if item already exists in cart
      const existingItemIndex = state.cartItems.findIndex(
        item => item._id === action.payload._id,
      );
      if (existingItemIndex !== -1) {
        // If item exists, update its quantity
        const updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex].quantity++;
        return {
          ...state,
          cartItems: updatedCartItems,
          isCountdownVisible: true,
        };
      } else {
        // If item doesn't exist, add it to cart with quantity 1
        return {
          ...state,
          cartItems: [...state.cartItems, { ...action.payload, quantity: 1 }],
          isCountdownVisible: true,
        };
      }

    case DECREASE_QUANTITY:
      return {
        ...state,
        cartItems: state.cartItems
          .map((item, index) =>
            item._id === action.payload && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item._id === action.payload && item.quantity === 1
                ? null
                : item,
          )
          .filter(item => item !== null),
      };

    case REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item._id !== action.payload),
      };

    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
      };

    default:
      return state;
  }
};

export default cartReducer;
