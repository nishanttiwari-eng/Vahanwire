import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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
  const [currentUser, setCurrentUser] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [bookingCompleted, setBookingCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastOfferUpdate, setLastOfferUpdate] = useState(Date.now());

  const persistTimeoutRef = useRef(null);

  useEffect(() => {
    loadPersistedData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (persistTimeoutRef.current) {
        clearTimeout(persistTimeoutRef.current);
      }
      persistTimeoutRef.current = setTimeout(() => {
        persistData();
      }, 300);
    }
  }, [currentUser, userRequests, offers, bookingCompleted, isLoading]);

  const loadPersistedData = async () => {
    try {
      console.log('Loading persisted data...');
      const keys = [
        'currentUser',
        'userRequests',
        'offers',
        'bookingCompleted',
      ];
      const values = await AsyncStorage.multiGet(keys);

      values.forEach(([key, value]) => {
        if (value) {
          try {
            const parsed = JSON.parse(value);
            switch (key) {
              case 'currentUser':
                console.log('Loaded currentUser:', parsed);
                setCurrentUser(parsed);
                break;
              case 'userRequests':
                console.log('Loaded userRequests:', parsed.length, 'requests');
                setUserRequests(parsed);
                break;
              case 'offers':
                console.log('Loaded offers:', parsed.length, 'offers');
                setOffers(parsed);
                break;
              case 'bookingCompleted':
                console.log('Loaded bookingCompleted:', parsed);
                setBookingCompleted(parsed);
                break;
            }
          } catch (parseError) {
            console.error(`Error parsing ${key}:`, parseError);
          }
        }
      });
    } catch (error) {
      console.error('Error loading persisted data:', error);
    } finally {
      setIsLoading(false);
      console.log('Finished loading persisted data');
    }
  };

  const persistData = async () => {
    try {
      const data = [
        ['currentUser', JSON.stringify(currentUser)],
        ['userRequests', JSON.stringify(userRequests)],
        ['offers', JSON.stringify(offers)],
        ['bookingCompleted', JSON.stringify(bookingCompleted)],
      ];
      await AsyncStorage.multiSet(data);
      console.log('Data persisted successfully');
    } catch (error) {
      console.error('Error persisting data:', error);
    }
  };

  const loginUser = useCallback((userId, userName) => {
    console.log('Logging in user:', {userId, userName});
    setCurrentUser({userId, userName});
  }, []);

  const logoutUser = useCallback(() => {
    console.log('Logging out user');
    setCurrentUser(null);
    setCurrentRole(null);
  }, []);

  const selectRole = useCallback(role => {
    console.log('Selecting role:', role);
    setCurrentRole(role);
  }, []);

  const createRequest = useCallback(
    (name, from, to) => {
      console.log('createRequest called with:', {name, from, to});
      console.log('currentUser:', currentUser);

      if (!currentUser) {
        console.error('Cannot create request: No user logged in');
        return null;
      }

      const request = {
        id: generateId(),
        userId: currentUser.userId,
        userName: name,
        from,
        to,
        status: 'pending',
        timestamp: Date.now(),
      };

      console.log('Created request:', request);
      setUserRequests(prev => {
        const updated = [...prev, request];
        console.log('Updated userRequests:', updated);
        return updated;
      });
      setBookingCompleted(false);
      return request;
    },
    [currentUser],
  );

  const submitOffer = useCallback(
    (requestId, providerName, amount) => {
      console.log('submitOffer called with:', {
        requestId,
        providerName,
        amount,
      });

      const request = userRequests.find(r => r.id === requestId);
      if (!request) {
        console.error('Request not found:', requestId);
        return null;
      }

      const existingOfferIndex = offers.findIndex(
        offer =>
          offer.providerName === providerName && offer.requestId === requestId,
      );

      const newOffer = {
        id:
          existingOfferIndex !== -1
            ? offers[existingOfferIndex].id
            : generateId(),
        requestId,
        providerId:
          existingOfferIndex !== -1
            ? offers[existingOfferIndex].providerId
            : generateId(),
        providerName,
        amount: parseFloat(amount),
        status: 'pending',
        timestamp: Date.now(),
      };

      let updatedOffers;
      if (existingOfferIndex !== -1) {
        updatedOffers = [...offers];
        updatedOffers[existingOfferIndex] = newOffer;
        console.log('Updated existing offer:', newOffer);
      } else {
        updatedOffers = [...offers, newOffer];
        console.log('Added new offer:', newOffer);
      }

      setOffers(updatedOffers);
      setLastOfferUpdate(Date.now());

      setUserRequests(prev =>
        prev.map(r =>
          r.id === requestId ? {...r, status: 'offers_received'} : r,
        ),
      );

      console.log('Total offers now:', updatedOffers.length);
      return newOffer;
    },
    [userRequests, offers],
  );

  const acceptOffer = useCallback(
    offerId => {
      console.log('Accepting offer:', offerId);

      const offer = offers.find(o => o.id === offerId);
      if (!offer) {
        console.error('Offer not found:', offerId);
        return false;
      }

      const updatedOffers = offers.map(o =>
        o.id === offerId ? {...o, status: 'accepted'} : o,
      );
      setOffers(updatedOffers);

      setUserRequests(prev =>
        prev.map(r =>
          r.id === offer.requestId ? {...r, status: 'accepted'} : r,
        ),
      );

      setBookingCompleted(true);
      console.log('Offer accepted successfully');
      return offer;
    },
    [offers],
  );

  const rejectOffer = useCallback(
    offerId => {
      console.log('Rejecting offer:', offerId);

      const offer = offers.find(o => o.id === offerId);
      if (!offer) {
        console.error('Offer not found:', offerId);
        return false;
      }

      const updatedOffers = offers.map(o =>
        o.id === offerId ? {...o, status: 'rejected'} : o,
      );
      setOffers(updatedOffers);

      const hasPendingOffers = updatedOffers.some(
        o => o.requestId === offer.requestId && o.status === 'pending',
      );

      if (!hasPendingOffers) {
        setUserRequests(prev =>
          prev.map(r =>
            r.id === offer.requestId ? {...r, status: 'pending'} : r,
          ),
        );
      }

      console.log('Offer rejected successfully');
      return offer;
    },
    [offers],
  );

  const getRequestById = useCallback(
    requestId => {
      return userRequests.find(r => r.id === requestId);
    },
    [userRequests],
  );

  const getOffersForRequest = useCallback(
    (requestId, statusFilter = null) => {
      let filtered = offers.filter(o => o.requestId === requestId);
      if (statusFilter) {
        filtered = filtered.filter(o => o.status === statusFilter);
      }
      return filtered.sort((a, b) => a.amount - b.amount);
    },
    [offers],
  );

  const getCurrentUserRequests = useCallback(() => {
    if (!currentUser) return [];
    return userRequests.filter(r => r.userId === currentUser.userId);
  }, [currentUser, userRequests]);

  const getCurrentUserActiveRequest = useCallback(() => {
    if (!currentUser) return null;
    const userReqs = userRequests
      .filter(r => r.userId === currentUser.userId && r.status !== 'completed')
      .sort((a, b) => b.timestamp - a.timestamp);
    return userReqs[0] || null;
  }, [currentUser, userRequests]);

  const getAvailableRequests = useCallback(() => {
    return userRequests.filter(r => {
      if (r.status === 'accepted' || r.status === 'completed') {
        return false;
      }
      return true;
    });
  }, [userRequests]);

  const getAcceptedOffersForProvider = useCallback(
    providerName => {
      return offers.filter(
        o => o.providerName === providerName && o.status === 'accepted',
      );
    },
    [offers],
  );

  const hasRejectedOffer = useCallback(
    (requestId, providerName) => {
      return offers.some(
        o =>
          o.requestId === requestId &&
          o.providerName === providerName &&
          o.status === 'rejected',
      );
    },
    [offers],
  );

  const shouldShowOffers = useCallback(() => {
    if (!currentUser) return false;

    const activeRequest = getCurrentUserActiveRequest();
    if (!activeRequest) return false;

    const pendingOffers = offers.filter(
      o => o.requestId === activeRequest.id && o.status === 'pending',
    );

    return pendingOffers.length > 0 && !bookingCompleted;
  }, [currentUser, offers, bookingCompleted, getCurrentUserActiveRequest]);

  const resetApp = useCallback(async () => {
    console.log('Resetting app...');
    setCurrentRole(null);
    setCurrentUser(null);
    setUserRequests([]);
    setOffers([]);
    setBookingCompleted(false);
    try {
      await AsyncStorage.clear();
      console.log('App reset successfully');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }, []);

  const value = {
    currentRole,
    currentUser,
    userRequests,
    offers,
    bookingCompleted,
    lastOfferUpdate,
    isLoading,

    loginUser,
    logoutUser,
    selectRole,
    createRequest,
    submitOffer,
    acceptOffer,
    rejectOffer,
    getRequestById,
    getOffersForRequest,
    getCurrentUserRequests,
    getCurrentUserActiveRequest,
    getAvailableRequests,
    getAcceptedOffersForProvider,
    hasRejectedOffer,
    shouldShowOffers,
    resetApp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useCallback,
//   useEffect,
//   useRef,
// } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {generateId} from '../utils/helpers';

// const AppContext = createContext();

// export const useApp = () => {
//   const context = useContext(AppContext);
//   if (!context) {
//     throw new Error('useApp must be used within AppProvider');
//   }
//   return context;
// };

// export const AppProvider = ({children}) => {
//   const [currentRole, setCurrentRole] = useState(null);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRequests, setUserRequests] = useState([]);
//   const [offers, setOffers] = useState([]);
//   const [bookingCompleted, setBookingCompleted] = useState(false);
//   const [hasViewedOffers, setHasViewedOffers] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const persistTimeoutRef = useRef(null);

//   useEffect(() => {
//     loadPersistedData();
//   }, []);

//   useEffect(() => {
//     if (!isLoading) {
//       if (persistTimeoutRef.current) {
//         clearTimeout(persistTimeoutRef.current);
//       }
//       persistTimeoutRef.current = setTimeout(() => {
//         persistData();
//       }, 500);
//     }
//   }, [
//     currentUser,
//     userRequests,
//     offers,
//     bookingCompleted,
//     hasViewedOffers,
//     isLoading,
//   ]);

//   const loadPersistedData = async () => {
//     try {
//       const keys = [
//         'currentUser',
//         'userRequests',
//         'offers',
//         'bookingCompleted',
//         'hasViewedOffers',
//       ];
//       const values = await AsyncStorage.multiGet(keys);

//       values.forEach(([key, value]) => {
//         if (value) {
//           try {
//             const parsed = JSON.parse(value);
//             switch (key) {
//               case 'currentUser':
//                 setCurrentUser(parsed);
//                 break;
//               case 'userRequests':
//                 setUserRequests(parsed);
//                 break;
//               case 'offers':
//                 setOffers(parsed);
//                 break;
//               case 'bookingCompleted':
//                 setBookingCompleted(parsed);
//                 break;
//               case 'hasViewedOffers':
//                 setHasViewedOffers(parsed);
//                 break;
//             }
//           } catch (parseError) {
//             console.error(`Error parsing ${key}:`, parseError);
//           }
//         }
//       });
//     } catch (error) {
//       console.error('Error loading persisted data:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const persistData = async () => {
//     try {
//       const data = [
//         ['currentUser', JSON.stringify(currentUser)],
//         ['userRequests', JSON.stringify(userRequests)],
//         ['offers', JSON.stringify(offers)],
//         ['bookingCompleted', JSON.stringify(bookingCompleted)],
//         ['hasViewedOffers', JSON.stringify(hasViewedOffers)],
//       ];
//       await AsyncStorage.multiSet(data);
//     } catch (error) {
//       console.error('Error persisting data:', error);
//     }
//   };

//   const loginUser = useCallback((userId, userName) => {
//     setCurrentUser({userId, userName});
//   }, []);

//   const logoutUser = useCallback(() => {
//     setCurrentUser(null);
//     setCurrentRole(null);
//   }, []);

//   const selectRole = useCallback(role => {
//     setCurrentRole(role);
//   }, []);

//   const createRequest = useCallback(
//     (name, from, to) => {
//       if (!currentUser) {
//         console.error('Cannot create request: No user logged in');
//         return null;
//       }

//       const request = {
//         id: generateId(),
//         userId: currentUser.userId,
//         userName: name,
//         from,
//         to,
//         status: 'pending',
//         timestamp: Date.now(),
//       };

//       setUserRequests(prev => [...prev, request]);
//       setBookingCompleted(false);
//       setHasViewedOffers(false);
//       return request;
//     },
//     [currentUser],
//   );

//   const submitOffer = useCallback(
//     (requestId, providerName, amount) => {
//       const request = userRequests.find(r => r.id === requestId);
//       if (!request) {
//         console.error('Request not found:', requestId);
//         return null;
//       }

//       const existingOfferIndex = offers.findIndex(
//         offer =>
//           offer.providerName === providerName && offer.requestId === requestId,
//       );
//       const existingOffer =
//         existingOfferIndex !== -1 ? offers[existingOfferIndex] : null;

//       const newOffer = {
//         id: generateId(),
//         requestId,
//         providerId: existingOffer ? existingOffer.providerId : generateId(),
//         providerName,
//         amount: parseFloat(amount),
//         status: 'pending',
//         timestamp: Date.now(),
//       };

//       let updatedOffers;
//       if (existingOfferIndex !== -1) {
//         updatedOffers = [...offers];
//         updatedOffers[existingOfferIndex] = newOffer;
//       } else {
//         updatedOffers = [...offers, newOffer];
//       }

//       setOffers(updatedOffers);

//       setUserRequests(prev =>
//         prev.map(r =>
//           r.id === requestId ? {...r, status: 'offers_received'} : r,
//         ),
//       );

//       return newOffer;
//     },
//     [userRequests, offers],
//   );

//   const acceptOffer = useCallback(
//     offerId => {
//       const offer = offers.find(o => o.id === offerId);
//       if (!offer) {
//         console.error('Offer not found:', offerId);
//         return false;
//       }

//       const updatedOffers = offers.map(o =>
//         o.id === offerId ? {...o, status: 'accepted'} : o,
//       );
//       setOffers(updatedOffers);

//       setUserRequests(prev =>
//         prev.map(r =>
//           r.id === offer.requestId ? {...r, status: 'accepted'} : r,
//         ),
//       );

//       setBookingCompleted(true);

//       return offer;
//     },
//     [offers],
//   );

//   const rejectOffer = useCallback(
//     offerId => {
//       const offer = offers.find(o => o.id === offerId);
//       if (!offer) {
//         console.error('Offer not found:', offerId);
//         return false;
//       }

//       const updatedOffers = offers.map(o =>
//         o.id === offerId ? {...o, status: 'rejected'} : o,
//       );
//       setOffers(updatedOffers);

//       const hasPendingOffers = updatedOffers.some(
//         o => o.requestId === offer.requestId && o.status === 'pending',
//       );

//       if (!hasPendingOffers) {
//         setUserRequests(prev =>
//           prev.map(r =>
//             r.id === offer.requestId ? {...r, status: 'pending'} : r,
//           ),
//         );
//       }

//       return offer;
//     },
//     [offers],
//   );

//   const getRequestById = useCallback(
//     requestId => {
//       return userRequests.find(r => r.id === requestId);
//     },
//     [userRequests],
//   );

//   const getOffersForRequest = useCallback(
//     (requestId, statusFilter = null) => {
//       let filtered = offers.filter(o => o.requestId === requestId);
//       if (statusFilter) {
//         filtered = filtered.filter(o => o.status === statusFilter);
//       }
//       return filtered;
//     },
//     [offers],
//   );

//   const getCurrentUserRequests = useCallback(() => {
//     if (!currentUser) return [];
//     return userRequests.filter(r => r.userId === currentUser.userId);
//   }, [currentUser, userRequests]);

//   const getCurrentUserActiveRequest = useCallback(() => {
//     if (!currentUser) return null;
//     const userReqs = userRequests
//       .filter(r => r.userId === currentUser.userId && r.status !== 'completed')
//       .sort((a, b) => b.timestamp - a.timestamp);
//     return userReqs[0] || null;
//   }, [currentUser, userRequests]);

//   const getAvailableRequests = useCallback(() => {
//     return userRequests.filter(r => {
//       if (r.status === 'accepted' || r.status === 'completed') {
//         return false;
//       }
//       return true;
//     });
//   }, [userRequests]);

//   const getAcceptedOffersForProvider = useCallback(
//     providerName => {
//       return offers.filter(
//         o => o.providerName === providerName && o.status === 'accepted',
//       );
//     },
//     [offers],
//   );

//   const hasRejectedOffer = useCallback(
//     (requestId, providerName) => {
//       return offers.some(
//         o =>
//           o.requestId === requestId &&
//           o.providerName === providerName &&
//           o.status === 'rejected',
//       );
//     },
//     [offers],
//   );

//   const resetApp = useCallback(async () => {
//     setCurrentRole(null);
//     setCurrentUser(null);
//     setUserRequests([]);
//     setOffers([]);
//     setBookingCompleted(false);
//     setHasViewedOffers(false);
//     try {
//       await AsyncStorage.clear();
//     } catch (error) {
//       console.error('Error clearing storage:', error);
//     }
//   }, []);

//   const markOffersViewed = useCallback(() => {
//     setHasViewedOffers(true);
//   }, []);

//   const shouldShowOffers = useCallback(() => {
//     if (!currentUser) return false;

//     const activeRequest = getCurrentUserActiveRequest();
//     if (!activeRequest) return false;

//     const pendingOffers = offers.filter(
//       o => o.requestId === activeRequest.id && o.status === 'pending',
//     );

//     return pendingOffers.length > 0 && !bookingCompleted;
//   }, [currentUser, offers, bookingCompleted, getCurrentUserActiveRequest]);

//   const value = {
//     currentRole,
//     currentUser,
//     userRequests,
//     offers,
//     bookingCompleted,
//     hasViewedOffers,

//     loginUser,
//     logoutUser,
//     selectRole,
//     createRequest,
//     submitOffer,
//     acceptOffer,
//     rejectOffer,
//     getRequestById,
//     getOffersForRequest,
//     getCurrentUserRequests,
//     getCurrentUserActiveRequest,
//     getAvailableRequests,
//     getAcceptedOffersForProvider,
//     hasRejectedOffer,
//     resetApp,
//     markOffersViewed,
//     shouldShowOffers,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

// export default AppContext;
