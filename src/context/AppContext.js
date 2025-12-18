import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {generateId} from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({children}) => {
  const [currentRole, setCurrentRole] = useState(null);
  const [userRequest, setUserRequest] = useState(null);
  const [offers, setOffers] = useState([]);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [hasViewedOffers, setHasViewedOffers] = useState(false);

  useEffect(() => {
    loadPersistedData();
  }, []);

  useEffect(() => {
    persistData();
  }, [userRequest, offers, bookingCompleted, hasViewedOffers]);

  const loadPersistedData = async () => {
    try {
      const storedRequest = await AsyncStorage.getItem('userRequest');
      const storedOffers = await AsyncStorage.getItem('offers');
      const storedBooking = await AsyncStorage.getItem('bookingCompleted');
      const storedViewed = await AsyncStorage.getItem('hasViewedOffers');

      if (storedRequest) {
        setUserRequest(JSON.parse(storedRequest));
      }
      if (storedOffers) {
        setOffers(JSON.parse(storedOffers));
      }
      if (storedBooking) {
        setBookingCompleted(JSON.parse(storedBooking));
      }
      if (storedViewed) {
        setHasViewedOffers(JSON.parse(storedViewed));
      }
    } catch (error) {
      console.error('Error loading persisted data:', error);
    }
  };

  const persistData = async () => {
    try {
      await AsyncStorage.setItem('userRequest', JSON.stringify(userRequest));
      await AsyncStorage.setItem('offers', JSON.stringify(offers));
      await AsyncStorage.setItem(
        'bookingCompleted',
        JSON.stringify(bookingCompleted),
      );
      await AsyncStorage.setItem(
        'hasViewedOffers',
        JSON.stringify(hasViewedOffers),
      );
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  };

  const selectRole = useCallback(role => {
    setCurrentRole(role);
  }, []);

  const createRequest = useCallback((name, from, to) => {
    const request = {
      id: generateId(),
      name,
      from,
      to,
      timestamp: Date.now(),
    };
    setUserRequest(request);
    setOffers([]);
    setBookingCompleted(false);
    return request;
  }, []);

  const submitOffer = useCallback(
    (providerName, amount) => {
      if (!userRequest) return null;

      const existingOfferIndex = offers.findIndex(
        offer => offer.providerName === providerName,
      );

      const newOffer = {
        id: generateId(),
        providerName,
        amount: parseFloat(amount),
        requestId: userRequest.id,
        timestamp: Date.now(),
        accepted: false,
      };

      if (existingOfferIndex !== -1) {
        const updatedOffers = [...offers];
        updatedOffers[existingOfferIndex] = newOffer;
        setOffers(updatedOffers);
      } else {
        setOffers(prev => [...prev, newOffer]);
      }

      return newOffer;
    },
    [userRequest, offers],
  );

  const acceptOffer = useCallback(
    offerId => {
      const updatedOffers = offers.map(offer =>
        offer.id === offerId ? {...offer, accepted: true} : offer,
      );
      setOffers(updatedOffers);
      setBookingCompleted(true);
      return true;
    },
    [offers],
  );

  const resetApp = useCallback(async () => {
    setCurrentRole(null);
    setUserRequest(null);
    setOffers([]);
    setBookingCompleted(false);
    setHasViewedOffers(false);
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  const markOffersViewed = useCallback(() => {
    setHasViewedOffers(true);
  }, []);

  const shouldShowOffers = useCallback(() => {
    return offers.length > 0 && !bookingCompleted;
  }, [offers, bookingCompleted]);

  const value = {
    currentRole,
    userRequest,
    offers,
    bookingCompleted,
    hasViewedOffers,

    selectRole,
    createRequest,
    submitOffer,
    acceptOffer,
    resetApp,
    markOffersViewed,
    shouldShowOffers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;