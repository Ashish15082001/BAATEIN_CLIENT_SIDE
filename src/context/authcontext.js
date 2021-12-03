import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
} from "@firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "@firebase/firestore";
import React, { useCallback } from "react";
import { useState, useEffect, useContext } from "react";
import { v4 } from "uuid";
import { auth, db } from "../firebase/firebase";

export const AuthContext = React.createContext({
  currentUser: null,
  currentUserDetails: null,
  currentSocketId: null,
  activeRoomData: null,
  isCurrentUserSocketUpdated: false,
  upDateUserData: () => {},
  register: () => {},
  signIn: () => {},
  signout: () => {},
  forgotPassword: () => {},
  registerUserOnDatabase: () => {},
  storeSocketId: () => {},
  updateCurrentUsersDetails: () => {},
  setCanCurrentUserJoinRoomTrue: () => {},
  registerRoomOnDatabase: () => {},
  getRoomData: () => {},
  addNewMemberToRoom: () => {},
  setActiveRooData: () => {},
  updateActiveRoomMembers: () => {},
  updateActiveRoomMessages: () => {},
  addNewMessageToRoom: () => {},
});

export const useAuth = () => useContext(AuthContext);

const ContextProvider = function (props) {
  console.log("infinte render check....");

  const [currentUser, setCurrentUser] = useState(null);
  const [usersCollection] = useState(collection(db, "users"));
  const [roomsCollection] = useState(collection(db, "rooms"));

  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [currentSocketId, setCurrentSocketId] = useState(null);
  const [isCurrentUserSocketUpdated, setIsCurrentUserSocketUpdated] =
    useState(false);

  const [activeRoomData, setActiveRooData] = useState(null);

  const getCurrentUserDetails = useCallback(
    async function (email) {
      const q = query(usersCollection, where("email", "==", email));
      let userDataDetails;

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        userDataDetails = { FirebaseId: doc.id, ...doc.data() };
      });

      setCurrentUserDetails({ ...userDataDetails });
    },
    [usersCollection]
  );

  const getRoomData = useCallback(
    async function (roomId) {
      const q = query(roomsCollection, where("roomId", "==", roomId));
      let roomData;

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        roomData = { FirebaseId: doc.id, ...doc.data() };
      });

      return roomData;
    },
    [roomsCollection]
  );

  const addNewMemberToRoom = async function ({ roomId, userName }) {
    const roomData = await getRoomData(roomId);

    if (!roomData) {
      return;
    }

    const updatedMembers = [...roomData.members, userName];

    const roomName = roomData.roomName;
    const createdBy = roomData.createdBy;

    const updatedRooms = [
      ...currentUserDetails.rooms,
      { createdBy, roomId, roomName },
    ];

    updateDoc(doc(db, "rooms", `${roomData.FirebaseId}`), {
      members: updatedMembers,
    });
    updateDoc(doc(db, "users", `${currentUserDetails.FirebaseId}`), {
      rooms: updatedRooms,
    });
  };

  const addNewMessageToRoom = function ({ sender, message }) {
    console.log("activeRoomData = ", activeRoomData);
    if (!activeRoomData) {
      return;
    }

    const updatedMessages = [...activeRoomData.messages, { sender, message }];

    updateDoc(doc(db, "rooms", `${activeRoomData.FirebaseId}`), {
      messages: updatedMessages,
    });
  };

  useEffect(() => {
    const unsubsribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getCurrentUserDetails(user.email);
      } else {
        setCurrentUserDetails(null);
      }
      setCurrentUser(user);
    });
    return () => unsubsribe();
  }, [getCurrentUserDetails, setCurrentUser]);

  const register = function (email, passsword) {
    return createUserWithEmailAndPassword(auth, email, passsword);
  };

  const registerUserOnDatabase = function (email, userName) {
    const clientId = v4();

    return addDoc(usersCollection, {
      clientId,
      email,
      userName,
      currentSocketId: null,
      friends: [],
      rooms: [],
      friendRequestRecieved: [],
      friendRequestSent: [],
    });
  };

  const registerRoomOnDatabase = function (newRoomData) {
    return addDoc(roomsCollection, { ...newRoomData });
  };

  const signIn = function (email, passsword) {
    return signInWithEmailAndPassword(auth, email, passsword);
  };

  const signout = function () {
    upDateUserData(currentUserDetails.FirebaseId, {
      currentSocketId: null,
    });
    return signOut(auth);
  };

  const forgotPassword = function (email) {
    return sendPasswordResetEmail(auth, email, {
      url: "http://localhost:3000/login",
    });
  };

  const storeSocketId = useCallback(
    function (socketId) {
      setCurrentSocketId(socketId);
    },
    [setCurrentSocketId]
  );

  const updateCurrentUsersDetails = function (updatedData) {
    setCurrentUserDetails(updatedData);
  };

  const upDateUserData = function (userFirebaseId, updatedContentObject) {
    updateDoc(doc(db, "users", `${userFirebaseId}`), {
      ...updatedContentObject,
    });
  };

  const updateActiveRoomMembers = useCallback(
    function (userName) {
      console.log("inside update room memmers");
      setActiveRooData((oldState) => {
        if (oldState) {
          const updatedRoomMembers = [userName, ...oldState.members];
          return { ...oldState, members: updatedRoomMembers };
        }
      });
    },
    [setActiveRooData]
  );

  const updateActiveRoomMessages = useCallback(
    function ({ message, sender }) {
      setActiveRooData((oldState) => {
        if (oldState) {
          const updatedRoomMessages = [
            ...oldState.messages,
            { sender, message },
          ];
          return { ...oldState, messages: updatedRoomMessages };
        }
      });
    },
    [setActiveRooData]
  );

  if (isCurrentUserSocketUpdated === false) {
    if (currentSocketId && currentUserDetails) {
      setCurrentUserDetails((oldState) => ({
        ...oldState,
        currentSocketId,
      }));
      upDateUserData(currentUserDetails.FirebaseId, { currentSocketId });
      setIsCurrentUserSocketUpdated(true);
    }
  }

  if (currentUserDetails === null && isCurrentUserSocketUpdated)
    setIsCurrentUserSocketUpdated(false);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        upDateUserData,
        currentSocketId,
        register,
        activeRoomData,
        updateActiveRoomMembers,
        registerRoomOnDatabase,
        signIn,
        addNewMessageToRoom,
        signout,
        forgotPassword,
        registerUserOnDatabase,
        currentUserDetails,
        isCurrentUserSocketUpdated,
        storeSocketId,
        updateCurrentUsersDetails,
        getRoomData,
        addNewMemberToRoom,
        setActiveRooData,
        updateActiveRoomMessages,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
