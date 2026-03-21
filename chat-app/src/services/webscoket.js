// import SockJS from "sockjs-client";
// import Stomp from "stompjs";

// let stompClient = null;
// let isConnecting = false;
// let pendingCallbacks = [];

// export const connectWebSocket = (onConnected) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     console.error("WebSocket token missing");
//     return;
//   }

//   if (stompClient?.connected) {
//     onConnected?.();
//     return;
//   }

//   if (onConnected) {
//     pendingCallbacks.push(onConnected);
//   }

//   if (isConnecting) return;

//   const socket = new SockJS("http://localhost:8080/ws");
//   stompClient = Stomp.over(socket);
//   stompClient.debug = null;
//   isConnecting = true;

//   stompClient.connect(
//     {
//       Authorization: `Bearer ${token}`,
//     },
//     () => {
//       isConnecting = false;

//       const callbacks = [...pendingCallbacks];
//       pendingCallbacks = [];
//       callbacks.forEach((callback) => callback?.());
//     },
//     (error) => {
//       isConnecting = false;
//       pendingCallbacks = [];
//       stompClient = null;
//       console.error("WebSocket connection error:", error);
//     }
//   );
// };

// export const subscribeToChat = (chatId, callback) => {
//   if (!stompClient?.connected) {
//     console.error("WebSocket is not connected");
//     return null;
//   }

//   return stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {
//     callback(JSON.parse(message.body));
//   });
// };

// export const sendMessageWS = (payload) => {
//   if (!stompClient?.connected) {
//     console.error("WebSocket is not connected");
//     return false;
//   }

//   stompClient.send("/app/chat.send", {}, JSON.stringify(payload));
//   return true;
// };

// export const disconnectWebSocket = () => {
//   if (!stompClient) return;

//   stompClient.disconnect(() => {
//     console.log("WebSocket disconnected");
//   });

//   stompClient = null;
//   isConnecting = false;
//   pendingCallbacks = [];
// };
import SockJS from "sockjs-client";
import Stomp from "stompjs";

let stompClient = null;

export const connectWebSocket = (onConnected) => {

  if (stompClient?.connected) {
    onConnected && onConnected();
    return;
  }


  const socket = new SockJS("http://localhost:8080/ws");

  stompClient = Stomp.over(socket);

  const token = localStorage.getItem("token");

  stompClient.connect(
    { Authorization: "Bearer " + token },
    () => {

      console.log("WebSocket Connected");
      window.stompClient = stompClient;

      onConnected && onConnected();
    }
  );
};

export const getStompClient = () => stompClient;
export const subscribeToChat = (chatId, callback) => {

  if (!stompClient) return;

  stompClient.subscribe(`/topic/chat/${chatId}`, (message) => {

    const msg = JSON.parse(message.body);

    callback(msg);
  });
};

export const sendMessageWS = (payload) => {

  if (!stompClient) return;

  stompClient.send(
    "/app/chat.send",
    {},
    JSON.stringify(payload)
  );
};