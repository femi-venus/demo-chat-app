import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ marginBottom: 10 }}>Enter your username (e.g., User1, User2)</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <TextInput
        placeholder="Room ID"
        value={room}
        onChangeText={setRoom}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Enter Chat" onPress={() => router.push(`/chat/${room}?user=${username}`)} />
    </View>
  );
}
