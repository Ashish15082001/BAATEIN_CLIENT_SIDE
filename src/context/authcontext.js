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
  activeFriendData: null,
  activePersonalChat: null,
  isCurrentUserSocketUpdated: false,
  refreshCurrentUsersDetails: () => {},
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
  updateCurrentUsersFriendRequetsRecieved: () => {},
  updateCurrentUsersFriendRequetsSent: () => {},
  updateCurrentUsersFriends: () => {},
  getAnyUserDetail: () => {},
  registerNewPersonalChat: () => {},
  getAnyPersonalChatDetail: () => {},
  addNewMessageToPersonalChat: () => {},
  storeActiveFriendData: () => {},
  setActivePersonalChatData: () => {},
  updateActivePersonalChatData: () => {},
});

export const useAuth = () => useContext(AuthContext);

const ContextProvider = function (props) {
  console.log("infinte render check....");

  const [currentUser, setCurrentUser] = useState(null);
  const [usersCollection] = useState(collection(db, "users"));
  const [roomsCollection] = useState(collection(db, "rooms"));
  const [personalChatCollection] = useState(collection(db, "personal chats"));

  const [currentUserDetails, setCurrentUserDetails] = useState(null);
  const [currentSocketId, setCurrentSocketId] = useState(null);
  const [isCurrentUserSocketUpdated, setIsCurrentUserSocketUpdated] =
    useState(false);

  const [activeRoomData, setActiveRooData] = useState(null);
  const [activeFriendData, setActiveFriendData] = useState(null);
  const [activePersonalChat, setActivePersonalChat] = useState(null);

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

  const getAnyUserDetail = async function (email) {
    const q = query(usersCollection, where("email", "==", email));
    let userDataDetails;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      userDataDetails = { FirebaseId: doc.id, ...doc.data() };
    });

    return userDataDetails;
  };

  const getAnyPersonalChatDetail = async function (chatId) {
    const q = query(personalChatCollection, where("chatId", "==", chatId));
    let personalChatDetails;

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      personalChatDetails = { FirebaseId: doc.id, ...doc.data() };
    });

    return personalChatDetails;
  };

  const registerNewPersonalChat = function (personalChatObject) {
    return addDoc(personalChatCollection, personalChatObject);
  };

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

  const storeActiveFriendData = function (activeFriendData) {
    setActiveFriendData(activeFriendData);
  };

  const setActivePersonalChatData = async function (chatId) {
    const personalChatDetail = await getAnyPersonalChatDetail(chatId);
    console.log(personalChatDetail);
    setActivePersonalChat(personalChatDetail);
  };

  const updateActivePersonalChatData = function ({ newMessage }) {
    setActivePersonalChat((oldState) => {
      console.log("newMessage = ", newMessage);
      if (!oldState) return oldState;
      if (oldState.chatId !== newMessage.chatId) return oldState;

      return {
        ...oldState,
        messages: [
          ...oldState.messages,
          {
            senderEmail: newMessage.senderEmail,
            message: newMessage.message,
            date: newMessage.date,
            time: newMessage.time,
          },
        ],
      };
    });
  };

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

    updateCurrentUsersDetails({
      ...currentUserDetails,
      rooms: updatedRooms,
    });

    updateDoc(doc(db, "rooms", `${roomData.FirebaseId}`), {
      members: updatedMembers,
    });
    updateDoc(doc(db, "users", `${currentUserDetails.FirebaseId}`), {
      rooms: updatedRooms,
    });
  };

  const addNewMessageToPersonalChat = function (FirebaseId, messages) {
    updateDoc(doc(db, "personal chats", `${FirebaseId}`), {
      messages,
    });
  };

  const addNewMessageToRoom = function ({
    sender,
    senderEmail,
    message,
    date,
    time,
  }) {
    if (!activeRoomData) {
      return;
    }

    const updatedMessages = [
      ...activeRoomData.messages,
      { sender, senderEmail, message, date, time },
    ];
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

  const upDateUserData = function (userFirebaseId, updatedContentObject) {
    updateDoc(doc(db, "users", `${userFirebaseId}`), {
      ...updatedContentObject,
    });
  };

  const updateCurrentUsersDetails = function (updatedData) {
    setCurrentUserDetails(updatedData);
  };

  const updateActiveRoomMembers = useCallback(
    function (userName) {
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
    function ({ message, sender, senderEmail, roomId, date, time }) {
      console.log("hi");
      setActiveRooData((oldState) => {
        if (oldState && oldState.roomId === roomId) {
          const updatedRoomMessages = [
            ...oldState.messages,
            { sender, senderEmail, message, date, time },
          ];
          return { ...oldState, messages: updatedRoomMessages };
        }

        return oldState;
      });
    },
    [setActiveRooData]
  );

  const refreshCurrentUsersDetails = async function (_) {
    // getCurrentUserDetails(email);
  };

  const updateCurrentUsersFriendRequetsRecieved = function ({ payload, type }) {
    if (type === "ADD") {
      updateCurrentUsersDetails((oldState) => ({
        ...oldState,
        friendRequestRecieved: [...oldState.friendRequestRecieved, payload],
      }));
    } else if (type === "DELETE") {
      setCurrentUserDetails((oldState) => ({
        ...oldState,
        friendRequestRecieved: oldState.friendRequestRecieved.filter(
          (user) => user.email !== payload.email
        ),
      }));
    }
  };

  const updateCurrentUsersFriendRequetsSent = function ({ payload, type }) {
    // if (type === "ADD")
    //   setCurrentUserDetails((oldState) => ({
    //     ...oldState,
    //     friendRequestRecieved: [...oldState.friendRequestRecieved, updatedData],
    //   }));
    // else
    if (type === "DELETE")
      setCurrentUserDetails((oldState) => ({
        ...oldState,
        friendRequestSent: oldState.friendRequestSent.filter(
          (user) => user.email !== payload.email
        ),
      }));
  };

  const updateCurrentUsersFriends = function ({ payload, type }) {
    if (type === "ADD")
      setCurrentUserDetails((oldState) => ({
        ...oldState,
        friends: [...oldState.friends, payload],
      }));
  };

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
        activeFriendData,
        activePersonalChat,
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
        refreshCurrentUsersDetails,
        updateCurrentUsersFriendRequetsRecieved,
        updateCurrentUsersFriendRequetsSent,
        updateCurrentUsersFriends,
        getAnyUserDetail,
        registerNewPersonalChat,
        getAnyPersonalChatDetail,
        addNewMessageToPersonalChat,
        storeActiveFriendData,
        setActivePersonalChatData,
        updateActivePersonalChatData,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;
