import { io } from "socket.io-client";

const socket = io("http://localhost:3001");  //repalce with your ip address

export default socket;
