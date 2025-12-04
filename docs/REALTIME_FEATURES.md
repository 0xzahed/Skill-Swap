# Real-time Features Implementation Guide

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Phase:** 4 - Real-time Features

---

## Table of Contents

1. [Overview](#overview)
2. [Real-time Chat System](#real-time-chat-system)
3. [Live Notifications](#live-notifications)
4. [Real-time Availability Updates](#real-time-availability-updates)
5. [Socket.io Implementation](#socketio-implementation)
6. [Frontend Integration](#frontend-integration)

---

## Overview

This document details the implementation of real-time features using Socket.io (already installed) and Firebase Realtime Database for live updates, chat messaging, and instant notifications.

### Technologies Used

- **Socket.io 4.8.1** - Already installed, WebSocket library
- **Firebase Realtime Database** - For live data sync
- **React Hooks** - For real-time state management

---

## Real-time Chat System

### **Feature Overview**

**Purpose:** Direct messaging between students and providers

**Location:**

- `/messages` - Main messages page
- `/messages/:conversationId` - Individual conversation
- Chat widget on booking pages

### **User Flow**

1. **Initiate Conversation:**

   - Student views skill details
   - Clicks "Message Provider"
   - Chat window opens
   - Conversation created

2. **Send Message:**

   - Type message in input
   - Press Enter or click Send
   - Message appears instantly
   - Receiver gets notification

3. **Receive Message:**
   - Real-time message delivery
   - Typing indicator shows
   - Read receipts update
   - Notification sound plays

### **Database Structure**

**Realtime Database Path:**

```
conversations/
  {conversationId}/
    metadata/
      participants: ["userId1", "userId2"]
      skillId: "skill123"
      createdAt: timestamp
      lastMessageAt: timestamp

    messages/
      {messageId}/
        senderId: "userId1"
        text: "Hello, I'm interested in your course"
        timestamp: 1732627200000
        read: false
        type: "text"
```

### **Implementation Files**

#### **1. Chat Page Component**

**File:** `src/Pages/Messages.jsx`

```jsx
import React, { useState, useEffect, use } from "react";
import { AuthContext } from "../providers/AuthProvider";
import ConversationList from "../Components/Chat/ConversationList";
import ChatWindow from "../Components/Chat/ChatWindow";
import {
  initializeChat,
  subscribeToConversations,
} from "../services/chat.service";

const Messages = () => {
  const { user } = use(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Initialize chat service
    initializeChat(user.uid);

    // Subscribe to conversations
    const unsubscribe = subscribeToConversations(user.uid, (convs) => {
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <ConversationList
              conversations={conversations}
              selectedId={selectedConversation?.id}
              onSelect={setSelectedConversation}
              loading={loading}
            />
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <ChatWindow
                conversation={selectedConversation}
                currentUserId={user.uid}
              />
            ) : (
              <div className="bg-white rounded-lg shadow h-96 flex items-center justify-center">
                <p className="text-gray-500">
                  Select a conversation to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
```

#### **2. Conversation List Component**

**File:** `src/Components/Chat/ConversationList.jsx`

```jsx
import React from "react";
import { formatDistanceToNow } from "date-fns";

const ConversationList = ({ conversations, selectedId, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelect(conv)}
          className={`bg-white p-4 rounded-lg cursor-pointer transition hover:shadow-md ${
            selectedId === conv.id ? "ring-2 ring-[#422AD5]" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={
                  conv.otherUser.photo ||
                  "https://i.postimg.cc/5y8zTvMg/default-avatar.png"
                }
                alt={conv.otherUser.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {conv.otherUser.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">
                  {conv.otherUser.name}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(conv.lastMessageAt, { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-gray-600 truncate">
                {conv.lastMessage}
              </p>

              {conv.unreadCount > 0 && (
                <div className="mt-1">
                  <span className="bg-[#422AD5] text-white text-xs px-2 py-1 rounded-full">
                    {conv.unreadCount}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {conversations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No conversations yet
        </div>
      )}
    </div>
  );
};

export default ConversationList;
```

#### **3. Chat Window Component**

**File:** `src/Components/Chat/ChatWindow.jsx`

```jsx
import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaSmile, FaPaperclip } from "react-icons/fa";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import {
  subscribeToMessages,
  sendMessage,
  markAsRead,
  sendTypingIndicator,
} from "../../services/chat.service";

const ChatWindow = ({ conversation, currentUserId }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Subscribe to messages
    const unsubscribe = subscribeToMessages(conversation.id, (msgs) => {
      setMessages(msgs);
      scrollToBottom();

      // Mark messages as read
      markAsRead(conversation.id, currentUserId);
    });

    // Subscribe to typing indicator
    const typingUnsubscribe = subscribeToTyping(
      conversation.id,
      currentUserId,
      setOtherUserTyping
    );

    return () => {
      unsubscribe();
      typingUnsubscribe();
    };
  }, [conversation.id, currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator(conversation.id, currentUserId, true);

      setTimeout(() => {
        setIsTyping(false);
        sendTypingIndicator(conversation.id, currentUserId, false);
      }, 3000);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputText.trim()) return;

    const messageData = {
      conversationId: conversation.id,
      senderId: currentUserId,
      receiverId: conversation.otherUser.id,
      text: inputText.trim(),
      type: "text",
    };

    await sendMessage(messageData);
    setInputText("");
    setIsTyping(false);
    sendTypingIndicator(conversation.id, currentUserId, false);
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      {/* Chat Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <img
          src={conversation.otherUser.photo}
          alt={conversation.otherUser.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{conversation.otherUser.name}</h3>
          <p className="text-sm text-gray-500">
            {conversation.otherUser.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}

        {otherUserTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            title="Attach file"
          >
            <FaPaperclip size={20} />
          </button>

          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            title="Emoji"
          >
            <FaSmile size={20} />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#422AD5]"
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#422AD5] text-white p-3 rounded-full hover:bg-[#3319B0] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
```

#### **4. Message Bubble Component**

**File:** `src/Components/Chat/MessageBubble.jsx`

```jsx
import React from "react";
import { format } from "date-fns";
import { FaCheck, FaCheckDouble } from "react-icons/fa";

const MessageBubble = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwn
            ? "bg-[#422AD5] text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">
          {message.text}
        </p>

        <div
          className={`flex items-center gap-1 mt-1 text-xs ${
            isOwn ? "text-purple-100" : "text-gray-500"
          }`}
        >
          <span>{format(message.timestamp, "HH:mm")}</span>

          {isOwn && (
            <span>
              {message.read ? (
                <FaCheckDouble className="text-blue-300" />
              ) : (
                <FaCheck />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
```

#### **5. Chat Service**

**File:** `src/services/chat.service.js`

```javascript
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  update,
  serverTimestamp,
} from "firebase/database";
import app from "../Firebase/Firebase.config";

const db = getDatabase(app);

/**
 * Initialize chat service
 */
export const initializeChat = (userId) => {
  // Set user online status
  const userStatusRef = ref(db, `userStatus/${userId}`);
  set(userStatusRef, {
    online: true,
    lastSeen: serverTimestamp(),
  });

  // Set offline on disconnect
  onDisconnect(userStatusRef).set({
    online: false,
    lastSeen: serverTimestamp(),
  });
};

/**
 * Subscribe to user's conversations
 */
export const subscribeToConversations = (userId, callback) => {
  const conversationsRef = ref(db, `userConversations/${userId}`);

  return onValue(conversationsRef, async (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }

    const conversations = await Promise.all(
      Object.entries(data).map(async ([convId, convData]) => {
        // Get last message
        const lastMessageRef = ref(db, `conversations/${convId}/messages`);
        const lastMsgSnapshot = await get(
          query(lastMessageRef, limitToLast(1))
        );
        const lastMessage = Object.values(lastMsgSnapshot.val() || {})[0];

        // Get unread count
        const unreadCount = await getUnreadCount(convId, userId);

        return {
          id: convId,
          ...convData,
          lastMessage: lastMessage?.text || "",
          lastMessageAt: lastMessage?.timestamp || convData.createdAt,
          unreadCount,
        };
      })
    );

    // Sort by last message time
    conversations.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
    callback(conversations);
  });
};

/**
 * Subscribe to messages in a conversation
 */
export const subscribeToMessages = (conversationId, callback) => {
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);

  return onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }

    const messages = Object.entries(data).map(([id, msg]) => ({
      id,
      ...msg,
    }));

    // Sort by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);
    callback(messages);
  });
};

/**
 * Send a message
 */
export const sendMessage = async (messageData) => {
  const {
    conversationId,
    senderId,
    receiverId,
    text,
    type = "text",
  } = messageData;

  // Add message to conversation
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);
  const newMessageRef = push(messagesRef);

  await set(newMessageRef, {
    senderId,
    receiverId,
    text,
    type,
    timestamp: serverTimestamp(),
    read: false,
  });

  // Update conversation metadata
  const conversationRef = ref(db, `conversations/${conversationId}/metadata`);
  await update(conversationRef, {
    lastMessageAt: serverTimestamp(),
    lastMessage: text,
  });

  // Update unread count for receiver
  const unreadRef = ref(
    db,
    `userConversations/${receiverId}/${conversationId}/unreadCount`
  );
  await set(unreadRef, increment(1));

  // Send notification to receiver
  await sendMessageNotification(receiverId, senderId, text);

  return newMessageRef.key;
};

/**
 * Mark messages as read
 */
export const markAsRead = async (conversationId, userId) => {
  const messagesRef = ref(db, `conversations/${conversationId}/messages`);
  const snapshot = await get(messagesRef);

  if (!snapshot.exists()) return;

  const updates = {};
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val();
    if (message.receiverId === userId && !message.read) {
      updates[`${childSnapshot.key}/read`] = true;
    }
  });

  if (Object.keys(updates).length > 0) {
    await update(messagesRef, updates);

    // Reset unread count
    const unreadRef = ref(
      db,
      `userConversations/${userId}/${conversationId}/unreadCount`
    );
    await set(unreadRef, 0);
  }
};

/**
 * Send typing indicator
 */
export const sendTypingIndicator = async (conversationId, userId, isTyping) => {
  const typingRef = ref(db, `conversations/${conversationId}/typing/${userId}`);
  await set(typingRef, isTyping);
};

/**
 * Subscribe to typing indicator
 */
export const subscribeToTyping = (conversationId, currentUserId, callback) => {
  const typingRef = ref(db, `conversations/${conversationId}/typing`);

  return onValue(typingRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback(false);
      return;
    }

    // Check if other user is typing
    const otherUserTyping = Object.entries(data).some(
      ([userId, isTyping]) => userId !== currentUserId && isTyping
    );

    callback(otherUserTyping);
  });
};

/**
 * Create new conversation
 */
export const createConversation = async (userId1, userId2, skillId = null) => {
  const conversationId = [userId1, userId2].sort().join("_");

  const conversationRef = ref(db, `conversations/${conversationId}/metadata`);
  const snapshot = await get(conversationRef);

  // If conversation exists, return it
  if (snapshot.exists()) {
    return conversationId;
  }

  // Create new conversation
  await set(conversationRef, {
    participants: [userId1, userId2],
    createdAt: serverTimestamp(),
    skillId,
    lastMessageAt: serverTimestamp(),
  });

  // Add to both users' conversation lists
  const user1ConvRef = ref(
    db,
    `userConversations/${userId1}/${conversationId}`
  );
  const user2ConvRef = ref(
    db,
    `userConversations/${userId2}/${conversationId}`
  );

  const user1Data = await getUserData(userId1);
  const user2Data = await getUserData(userId2);

  await set(user1ConvRef, {
    otherUser: {
      id: userId2,
      name: user2Data.displayName,
      photo: user2Data.photoURL,
    },
    unreadCount: 0,
  });

  await set(user2ConvRef, {
    otherUser: {
      id: userId1,
      name: user1Data.displayName,
      photo: user1Data.photoURL,
    },
    unreadCount: 0,
  });

  return conversationId;
};

export default {
  initializeChat,
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  markAsRead,
  sendTypingIndicator,
  subscribeToTyping,
  createConversation,
};
```

---

## Live Notifications

### **Feature Overview**

**Purpose:** Real-time in-app notifications for important events

**Notification Types:**

- New booking request
- Booking confirmation
- New message
- Review received
- Payment received
- Session reminder

### **Implementation**

#### **Notification Component**

**File:** `src/Components/Notifications/NotificationBell.jsx`

```jsx
import React, { useState, useEffect, use } from "react";
import { FaBell } from "react-icons/fa";
import { AuthContext } from "../../providers/AuthProvider";
import {
  subscribeToNotifications,
  markNotificationRead,
} from "../../services/notification.service";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { user } = use(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToNotifications(user.uid, (notifs) => {
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMarkRead = async (notificationId) => {
    await markNotificationRead(notificationId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition"
      >
        <FaBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown
          notifications={notifications}
          onClose={() => setIsOpen(false)}
          onMarkRead={handleMarkRead}
        />
      )}
    </div>
  );
};

export default NotificationBell;
```

---

## Real-time Availability Updates

### **Feature Overview**

**Purpose:** Show live slot availability when booking

**Implementation:**

```jsx
// Subscribe to availability changes
const subscribeToAvailability = (skillId, callback) => {
  const availabilityRef = ref(db, `skillAvailability/${skillId}`);

  return onValue(availabilityRef, (snapshot) => {
    callback(snapshot.val());
  });
};

// Update availability in real-time
const updateSlotAvailability = async (skillId, date, slotId, available) => {
  const slotRef = ref(db, `skillAvailability/${skillId}/${date}/${slotId}`);
  await update(slotRef, { available, updatedAt: serverTimestamp() });
};
```

---

## Socket.io Implementation

### **Backend Socket Server**

**File:** `backend/functions/src/socket.js`

```javascript
const socketIO = require("socket.io");
const admin = require("firebase-admin");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decodedToken = await admin.auth().verifyIdToken(token);
      socket.userId = decodedToken.uid;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's room
    socket.join(socket.userId);

    // Handle typing indicator
    socket.on("typing", ({ conversationId, isTyping }) => {
      socket.to(conversationId).emit("user-typing", {
        userId: socket.userId,
        isTyping,
      });
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { initializeSocket, getIO };
```

### **Frontend Socket Client**

**File:** `src/services/socket.service.js`

```javascript
import { io } from "socket.io-client";
import { auth } from "../Firebase/Firebase.config";

let socket = null;

export const connectSocket = async () => {
  const token = await auth.currentUser?.getIdToken();

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default { connectSocket, disconnectSocket, getSocket };
```

---

**Next Document:** Proceed to `PAYMENT_SYSTEM.md` for Stripe payment integration details.
