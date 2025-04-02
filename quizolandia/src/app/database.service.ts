import { Injectable } from '@angular/core';
import WebSocket from 'ws';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor() {
    if(typeof window !== 'undefined') {
      setTimeout(() : void => {
        this.initWebSocket();
      });
    }
  }
  private socket! : WebSocket
  private initWebSocket() : void {
    try {
      this.socket = new WebSocket('ws://localhost:8080');
      this.socket.onopen = () => {
        console.log('WebSocket connection established');
      };
      this.socket.onmessage = (event) : void => {
        console.log('Message from server:', event.data);
      };
      this.socket.onerror = (error) : void => {
        console.error('WebSocket error:', error);
      };
      this.socket.onclose = () : void => {
        console.log('WebSocket connection closed');
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }

}
