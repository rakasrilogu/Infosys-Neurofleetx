// src/services/WebSocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_WS_URL =
  process.env.REACT_APP_WS_URL || "http://localhost:8081";

const WebSocketService = {
  client: null,
  connected: false,
  subscriptionQueue: [],
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,

  getAuthToken() {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  },

  connect(onConnectedCallback) {
    if (this.client && this.connected) {
      console.log("🔄 WebSocket already connected");
      if (onConnectedCallback) onConnectedCallback();
      return;
    }

    const token = this.getAuthToken();
    if (!token) {
      console.error("❌ No authentication token found for WebSocket");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${API_WS_URL}/ws`),

      connectHeaders: {
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },

      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log("✅ WebSocket connected");

        this.subscriptionQueue.forEach(({ destination, callback }) => {
          this.subscribe(destination, callback);
        });
        this.subscriptionQueue = [];

        if (onConnectedCallback) onConnectedCallback();
      },

      onStompError: (frame) => {
        this.connected = false;
        console.error("❌ STOMP error:", frame);

        if (
          frame.headers &&
          frame.headers.message &&
          frame.headers.message.includes("Access Denied")
        ) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
        }
      },

      onWebSocketError: (error) => {
        this.connected = false;
        console.error("❌ WebSocket error:", error);
      },

      onDisconnect: () => {
        this.connected = false;
        console.log("⚠️ WebSocket disconnected");

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(
            () => this.connect(onConnectedCallback),
            3000 * this.reconnectAttempts
          );
        }
      },

      debug: (str) => {
        console.log("STOMP:", str);
      },
    });

    this.client.activate();
  },

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
      this.subscriptionQueue = [];
      this.reconnectAttempts = 0;
      console.log("🔌 WebSocket disconnected");
    }
  },

  subscribe(destination, callback) {
    if (this.client && this.connected) {
      return this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          callback(data);
        } catch (err) {
          console.error("❌ JSON parse error:", err);
        }
      });
    } else {
      this.subscriptionQueue.push({ destination, callback });
    }
  },

  send(destination, message) {
    if (this.client && this.connected) {
      const token = this.getAuthToken();
      this.client.publish({
        destination,
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.error("❌ WebSocket not connected");
    }
  },

  isConnected() {
    return this.connected;
  },

  getConnectionStatus() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts,
    };
  },
};

export default WebSocketService;
