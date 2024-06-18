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
        const existingItem = updatedCartItems[existingItemIndex];

        // Increase item quantity
        existingItem.quantity++;

        // Increase variation quantities
        existingItem.variations = existingItem.variations.map(variation => {
          if (variation.quantity > 0) {
            return { ...variation, quantity: variation.quantity + 1 };
          }
          return variation;
        });

        updatedCartItems[existingItemIndex] = existingItem;

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
          .map(item => {
            if (item._id === action.payload) {
              if (item.quantity > 1) {
                // Decrease item quantity
                const updatedItem = { ...item, quantity: item.quantity - 1 };

                // Decrease variation quantities if they are greater than zero
                updatedItem.variations = item.variations.map(variation => {
                  if (variation.quantity > 0) {
                    return { ...variation, quantity: variation.quantity - 1 };
                  }
                  return variation;
                });

                return updatedItem;
              } else if (item.quantity === 1) {
                // If quantity is 1, remove the item
                return null;
              }
            }
            return item;
          })
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
