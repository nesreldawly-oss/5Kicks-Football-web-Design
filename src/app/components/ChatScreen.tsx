import { useState, useEffect, useRef } from "react";
import { Send, Users, Shield, MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Screen, User as UserType, Message } from "../types";
import { sendMessageApi, getMessagesApi, getChatChannelsApi } from "../services/api";

type ChatScreenProps = {
    user: UserType | null;
    onNavigate: (screen: Screen, data?: any) => void;
};

type Channel = {
    id: string;
    name: string;
    type: string;
};

export default function ChatScreen({ user, onNavigate }: ChatScreenProps) {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) {
            getChatChannelsApi(user.id).then(setChannels);
        }
    }, [user]);

    useEffect(() => {
        if (selectedChannel) {
            loadMessages();
            const interval = setInterval(loadMessages, 3000); // Polling for "not-real-time" feel
            return () => clearInterval(interval);
        }
    }, [selectedChannel]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const loadMessages = () => {
        if (selectedChannel) {
            getMessagesApi(selectedChannel.id).then(setMessages);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedChannel || !newMessage.trim()) return;

        await sendMessageApi({
            senderId: user.id,
            senderName: user.fullName,
            text: newMessage,
            channelId: selectedChannel.id,
        });

        setNewMessage("");
        loadMessages();
    };

    if (!user) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" size="icon" onClick={() => onNavigate("home")}>
                    <ArrowLeft size={20} />
                </Button>
                <div>
                    <h2 className="flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Messages
                    </h2>
                    <p className="text-sm text-muted-foreground">Chat with admin and your teams</p>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Channels List */}
                <Card className="w-80 flex flex-col p-4">
                    <h4 className="mb-4 px-2">Channels</h4>
                    <div className="space-y-2 flex-1 overflow-y-auto">
                        {channels.map((channel) => (
                            <button
                                key={channel.id}
                                onClick={() => setSelectedChannel(channel)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${selectedChannel?.id === channel.id
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "hover:bg-accent text-muted-foreground"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {channel.type === "admin" ? (
                                        <Shield size={18} />
                                    ) : (
                                        <Users size={18} />
                                    )}
                                    <span className="font-medium truncate">{channel.name}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 flex flex-col overflow-hidden relative">
                    {selectedChannel ? (
                        <>
                            <div className="p-4 border-b border-border flex items-center justify-between bg-accent/30">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        {selectedChannel.type === "admin" ? <Shield className="text-primary" /> : <Users className="text-primary" />}
                                    </div>
                                    <div>
                                        <p className="font-bold">{selectedChannel.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedChannel.type === "admin" ? "Directly with 5Kicks Admin" : "Team Members"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {messages.length === 0 && (
                                        <div className="text-center py-10">
                                            <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                                            <p className="text-muted-foreground">No messages yet. Say hi!</p>
                                        </div>
                                    )}
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.senderId === user.id;
                                        return (
                                            <div
                                                key={msg.id || idx}
                                                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                                            >
                                                <div className="flex items-center gap-2 mb-1 px-1">
                                                    {!isMe && <span className="text-xs font-bold text-primary">{msg.senderName}</span>}
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div
                                                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${isMe
                                                        ? "bg-primary text-primary-foreground rounded-tr-none"
                                                        : "bg-accent text-accent-foreground rounded-tl-none"
                                                        }`}
                                                >
                                                    <p className="text-sm">{msg.text}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2 bg-background">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                />
                                <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                    <Send size={18} />
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <MessageSquare size={40} className="text-primary" />
                            </div>
                            <h3 className="mb-2">Your Conversations</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Select a channel from the left to start chatting with the 5Kicks admin or your team members.
                            </p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
