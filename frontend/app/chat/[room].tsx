import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import socket from "../utils/socket";

export default function ChatScreen() {
  const { room, user } = useLocalSearchParams<{ room: string; user: string }>();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ text: string; sender: string; timestamp: number }[]>([]);

  useEffect(() => {
    socket.emit("joinRoom", room);
    socket.on("chatHistory", (history) => setMessages(history));
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.off("chatHistory");
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (!message) return;
    const msg = {
      text: message,
      sender: user,
      room,
      timestamp: Date.now(),
    };
    socket.emit("sendMessage", msg);
    setMessage("");
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderItem = ({ item }: { item: typeof messages[number] }) => {
    const isSender = item.sender === user;
    return (
      <View
        style={{
          alignSelf: isSender ? "flex-end" : "flex-start",
          backgroundColor: isSender ? "#DCF8C6" : "#E0E0E0",
          borderRadius: 10,
          padding: 10,
          marginVertical: 4,
          maxWidth: "75%",
        }}
      >
        <Text style={{ fontWeight: "bold", marginBottom: 2 }}>{item.sender}</Text>
        <Text>{item.text}</Text>
        <Text style={{ fontSize: 10, color: "#555", marginTop: 5, textAlign: "right" }}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ textAlign: "center", fontWeight: "bold", marginBottom: 10 }}>Room: {room}</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <TextInput
        style={{ borderWidth: 1, padding: 10, borderRadius: 8, marginBottom: 10 }}
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
