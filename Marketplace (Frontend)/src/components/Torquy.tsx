import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const TORQUY_ANSWERS: Record<string, string> = {
    'hello': "Hi there! I'm Torquy, your ChainTorque assistant. How can I help you today?",
    'hi': "Hello! Ready to build or buy something amazing?",
    'upload': "To upload a model, click the 'Upload' button in the navigation bar. You'll need to fill in the details and upload your 3D file (GLB/GLTF/OBJ).",
    'mint': "Minting turns your 3D model into an NFT on the blockchain. This proves your ownership and allows you to sell it securely.",
    'buy': "You can buy items by browsing the marketplace, clicking on a product, and hitting the 'Purchase' button. Make sure your wallet is connected!",
    'wallet': "We support MetaMask and other Web3 wallets. Click 'Connect Wallet' in the top right to get started.",
    'connect': "Click the 'Connect Wallet' button in the top right corner to link your Ethereum wallet.",
    'fees': "Our platform fee is 2.5% per transaction. This helps us maintain the marketplace.",
    'default': "I'm still tuning my engine! I didn't quite catch that. Try asking about uploading, buying, or minting.",
};

const Torquy: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Beep boop! 🤖 I'm Torquy. Need help navigating the marketplace?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI thinking delay
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let responseText = TORQUY_ANSWERS['default'];

            // Simple keyword matching
            for (const key of Object.keys(TORQUY_ANSWERS)) {
                if (key !== 'default' && lowerInput.includes(key)) {
                    responseText = TORQUY_ANSWERS[key];
                    break;
                }
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: 'bot',
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMsg]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col transition-all animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-primary p-4 flex justify-between items-center text-primary-foreground">
                        <div className="flex items-center gap-2">
                            <div className="bg-white/20 p-1.5 rounded-full">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Torquy AI</h3>
                                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    Online
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary-foreground hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 bg-background/95 backdrop-blur-sm h-80 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.sender === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-br-none'
                                            : 'bg-muted text-foreground rounded-bl-none'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3 flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-muted/30 border-t border-border flex gap-2">
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 bg-background focus-visible:ring-1"
                        />
                        <Button size="icon" onClick={handleSend} disabled={!inputText.trim() || isTyping}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className={`rounded-full h-14 w-14 shadow-lg transition-transform hover:scale-105 ${isOpen ? 'bg-muted text-foreground hover:bg-muted/90' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6" />
                ) : (
                    <div className="relative">
                        <Bot className="h-7 w-7" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                    </div>
                )}
            </Button>
        </div>
    );
};

export default Torquy;
