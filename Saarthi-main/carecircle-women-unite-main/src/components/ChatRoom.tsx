import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowDown, X } from 'lucide-react';

interface Message {
  id: number;
  user: string;
  message: string;
  time: string;
  isAnonymous?: boolean;
}

interface ChatRoomProps {
  roomName: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  initialMessages: Message[];
  roomColor: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomName,
  description,
  isOpen,
  onClose,
  initialMessages,
  roomColor
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        user: isAnonymous ? 'Anonymous' : 'You',
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAnonymous
      };
      
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate response after a delay
      setTimeout(() => {
        const responses = [
          "Thank you for sharing. You're not alone in this journey. ❤️",
          "Sending you virtual hugs. It's brave of you to reach out.",
          "I understand exactly how you feel. Let's support each other.",
          "Here's a helpful tip that worked for me...",
          "Would you like to connect with a counselor? Type /askexpert"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        const responseMessage: Message = {
          id: messages.length + 2,
          user: 'CareCircle Member',
          message: randomResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isAnonymous: true
        };
        
        setMessages(prev => [...prev, responseMessage]);
      }, 1500);
    }
  };

  const handleCommand = (command: string) => {
    if (command.startsWith('/')) {
      let commandResponse = '';
      
      if (command === '/askexpert') {
        commandResponse = '🩺 Expert notified! A counselor will join shortly.';
      } else if (command.startsWith('/reminder')) {
        commandResponse = `⏰ Reminder set: ${command.replace('/reminder ', '')}`;
      } else if (command.startsWith('/log')) {
        commandResponse = `📝 Logged to MediVault: ${command.replace('/log ', '')}`;
      } else if (command === '/hide identity') {
        setIsAnonymous(true);
        commandResponse = '🔒 Anonymous mode activated';
      } else {
        commandResponse = `Command "${command}" executed successfully!`;
      }

      const commandMessage: Message = {
        id: messages.length + 1,
        user: 'System',
        message: commandResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, commandMessage]);
      setNewMessage('');
      return;
    }
    
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col bg-card shadow-[var(--shadow-warm)]">
        {/* Header */}
        <div className={`p-4 rounded-t-lg text-white`} style={{ backgroundColor: roomColor }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{roomName}</h3>
              <p className="text-sm opacity-90">{description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Anonymous Toggle */}
          <div className="mt-3 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input 
                type="checkbox" 
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded"
              />
              Anonymous Mode
            </label>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-care-accent">
                  {message.user}
                </span>
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
              </div>
              <div className={`p-3 rounded-lg max-w-[80%] ${
                message.user === 'You' 
                  ? 'bg-care-accent text-white ml-auto' 
                  : message.user === 'System'
                  ? 'bg-care-warm text-care-deep'
                  : 'bg-care-soft text-foreground'
              }`}>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message or use commands like /askexpert, /reminder..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  if (newMessage.startsWith('/')) {
                    handleCommand(newMessage);
                  } else {
                    handleSendMessage();
                  }
                }
              }}
              className="flex-1"
            />
            <Button 
              onClick={() => {
                if (newMessage.startsWith('/')) {
                  handleCommand(newMessage);
                } else {
                  handleSendMessage();
                }
              }}
              className="bg-care-accent hover:bg-care-accent/90"
            >
              Send
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Quick commands: /askexpert, /reminder [text], /log mood [feeling], /hide identity
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatRoom;