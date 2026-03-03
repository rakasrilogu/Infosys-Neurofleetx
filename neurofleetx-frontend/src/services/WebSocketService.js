// src/services/WebSocketService.js
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketService = {
  client: null,
  connected: false,
  subscriptionQueue: [],
  reconnectAttempts: 0,
  maxReconnectAttempts: 5,

  // Get token from storage
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

    // ✅ Create client with authentication headers
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
      
      // ✅ Add authentication headers for STOMP connection
      connectHeaders: {
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: (frame) => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log("✅ WebSocket connected with authentication");
        console.log("Connection frame:", frame);

        // Process queued subscriptions
        this.subscriptionQueue.forEach(({ destination, callback }) => {
          this.subscribe(destination, callback);
        });
        this.subscriptionQueue = [];

        if (onConnectedCallback) onConnectedCallback();
      },

      onStompError: (frame) => {
        this.connected = false;
        console.error("❌ STOMP error:", frame);
        
        // Handle authentication errors
        if (frame.headers && frame.headers.message && 
            frame.headers.message.includes('Access Denied')) {
          console.error("🚫 WebSocket authentication failed - redirecting to login");
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = '/login';
        }
      },

      onWebSocketError: (error) => {
        this.connected = false;
        console.error("❌ WebSocket connection error:", error);
      },

      onDisconnect: () => {
        this.connected = false;
        console.log("⚠️ WebSocket disconnected");
        
        // Attempt reconnection if not intentional
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`🔄 Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          setTimeout(() => this.connect(onConnectedCallback), 3000 * this.reconnectAttempts);
        }
      },

      // ✅ Add debug logging
      debug: (str) => {
        console.log('STOMP Debug:', str);
      }
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
      const subscription = this.client.subscribe(destination, (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log(`📨 Received from ${destination}:`, data);
          callback(data);
        } catch (err) {
          console.error("❌ Failed to parse WebSocket message:", err);
        }
      });
      console.log(`📡 Subscribed to ${destination}`);
      return subscription;
    } else {
      console.warn(`⚠️ Not connected yet. Queuing subscription to ${destination}`);
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
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(`📤 Sent message to ${destination}:`, message);
    } else {
      console.error("❌ WebSocket not connected. Cannot send to", destination);
    }
  },

  isConnected() {
    return this.connected;
  },

  // ✅ Get connection status for UI
  getConnectionStatus() {
    return {
      connected: this.connected,
      reconnectAttempts: this.reconnectAttempts,
      maxReconnectAttempts: this.maxReconnectAttempts
    };
  }
};

export default WebSocketService;
