
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

export const sendTypingWS = (payload) => {
  if (!stompClient) return;
  stompClient.send("/app/chat.typing", {}, JSON.stringify(payload));

};