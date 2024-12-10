import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (newItem) => {
    var cartCopy = [...cartItems];

    const alreadyExistedItem = cartCopy.find(
      (checkItem) => checkItem._id === newItem._id
    );

    if (alreadyExistedItem) {
      cartCopy = cartCopy.map((checkItem) =>
        checkItem._id === newItem._id
          ? {
              ...checkItem,
              quantity: checkItem.quantity + 1,

              totalPrice: (checkItem.quantity + 1) * checkItem.price,
            }
          : checkItem
      );
    } else {
      cartCopy.push({ ...newItem, quantity: 1, totalPrice: newItem.price });
    }

    localStorage.setItem("cartItems", JSON.stringify(cartCopy));

    setCartItems(cartCopy);
  };

  const decreaseItemQuantity = (ItemToRemove) => {
    var copyItem = [...cartItems];

    const IsItemCheckInCart = cartItems.find(
      (cartItem) => cartItem._id === ItemToRemove._id
    );

    if (IsItemCheckInCart.quantity === 1) {
      copyItem = cartItems.filter(
        (cartItem) => cartItem._id !== ItemToRemove._id
      );
    } else {
      copyItem = cartItems.map((cartItem) =>
        cartItem._id === ItemToRemove._id
          ? {
              ...cartItem,
              quantity: cartItem.quantity - 1,
              totalPrice: cartItem.totalPrice - cartItem.price,
            }
          : cartItem
      );
    }

    localStorage.setItem("cartItems", JSON.stringify(copyItem));

    setCartItems(copyItem);
  };

  const RemoveSpecificItemFromCart = (_id) => {
    const updatedCart = cartItems.filter((item) => item._id !== _id);
    setCartItems(updatedCart);

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    var copyCart = [];

    localStorage.setItem("cartItems", JSON.stringify(copyCart));

    setCartItems(copyCart);
  };

  const [showCart, setShowCart] = useState(false);

  const setShowCartState = (value) => {
    setShowCart(value);
  };

  useEffect(() => {
    const cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
      setCartItems(JSON.parse(cartItems));
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        clearCart,
        decreaseItemQuantity,
        RemoveSpecificItemFromCart,
        showCart,
        setShowCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
