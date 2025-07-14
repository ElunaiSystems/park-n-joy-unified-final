import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Mic, MicOff, Volume2, Zap, Sparkles, Heart } from "lucide-react";
import JoyCharacter from './JoyCharacter';

interface JoyMessage {
  id: string;
  type: 'joy' | 'user';
  content: string;
  timestamp: Date;
  emotion?: 'happy' | 'excited' | 'helpful' | 'playful';
}

interface JoyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  kidsInCarMode?: boolean;
  raynesWayEnabled?: boolean;
}

export default function JoyAssistant({ isOpen, onClose, kidsInCarMode = false, raynesWayEnabled = false }: JoyAssistantProps) {
  const [messages, setMessages] = useState<JoyMessage[]>([
    {
      id: '1',
      type: 'joy',
      content: "Hi there, amazing family! I'm Joy, your magical travel companion! 🌟 Ready to discover some incredible adventures together?",
      timestamp: new Date(),
      emotion: 'excited'
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [currentScript, setCurrentScript] = useState('welcome');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const joyScripts = {
    welcome: kidsInCarMode ? [
      "Hi sweethearts! I'm Joy and I'm SO excited to go on adventures with you! 🌈✨",
      "I know where all the coolest playgrounds and ice cream stops are hiding!",
      "Should we find somewhere super fun to explore together?"
    ] : [
      "Hi there, amazing family! I'm Joy, your magical travel companion! 🌟",
      "I know all the best family-friendly spots along your route!",
      "Want me to find some playgrounds or splash pads nearby?"
    ],
    driving: kidsInCarMode ? [
      "You're all being such wonderful travelers! 🚗💫",
      "Ooh, I see something exciting coming up - a playground with swings that go super high!",
      "Are those little legs getting wiggly? I know the perfect stretching spot!"
    ] : [
      "Great job keeping everyone safe on the road! 🚗",
      "I spy something fun coming up in 2 miles - should we make a quick stop?",
      "Kids getting restless? I know a perfect place to stretch those legs!"
    ],
    raynesWay: [
      "I found a beautiful shaded park with lots of trees for comfort! 🌳",
      "This next stop has covered picnic areas - perfect for staying cool!",
      "Sun-smart choice! This spot has indoor play areas and air conditioning."
    ],
    arrived: [
      "Yay! You made it to another awesome stop! 🎉",
      "Don't forget to collect your joy memories here!",
      "Ready for the next part of your adventure?"
    ],
    emergency: [
      "I'm here to help keep your family safe. 🛡️",
      "I've shared your location with your emergency contacts.",
      "Everything will be okay. You're doing great!"
    ],
    community: [
      "Thank you for sharing that amazing spot! 💖",
      "I'll review your pin and share it with other families soon!",
      "You're helping make travel more joyful for everyone!"
    ]
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addJoyMessage = (content: string, emotion: JoyMessage['emotion'] = 'helpful') => {
    const newMessage: JoyMessage = {
      id: Date.now().toString(),
      type: 'joy',
      content,
      timestamp: new Date(),
      emotion
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'find-playground':
        const playgroundMsg = raynesWayEnabled 
          ? "🎪 I found 3 amazing shaded playgrounds within 5 minutes! The closest one has covered play areas and clean restrooms. Want directions?"
          : "🎪 I found 3 amazing playgrounds within 5 minutes! The closest one has shaded seating and clean restrooms. Want directions?";
        addJoyMessage(playgroundMsg, 'excited');
        break;
      case 'bathroom-break':
        addJoyMessage("🚻 There's a family-friendly rest stop with clean facilities just 2 miles ahead! It also has a picnic area if you want to grab a snack.", 'helpful');
        break;
      case 'food-stop':
        const foodMsg = kidsInCarMode
          ? "🍎 Tummies rumbling? I know a super fun restaurant with a play area and kid-sized tables! Should we go there?"
          : "🍎 I see you're getting hungry! There's a family restaurant with a kids menu and play area 8 minutes away. Should I add it to your route?";
        addJoyMessage(foodMsg, 'happy');
        break;
      case 'entertainment':
        const gameMsg = kidsInCarMode
          ? "🎵 Let's play a magical game! I spy with my little eye... something yellow that lights up the world! Can you guess what it is?"
          : "🎵 How about a fun car game? I spy with my little eye... something that starts with 'T' and helps us get places! Can the kids guess?";
        addJoyMessage(gameMsg, 'playful');
        break;
      case 'safety-check':
        addJoyMessage("🛡️ Everything looks great! Seatbelts are secure, and I'm monitoring your route for any updates. You're doing an amazing job keeping everyone safe!", 'helpful');
        break;
      case 'submit-pin':
        addJoyMessage("💖 I'd love to add your special discovery to the Joy Map! Just tell me the name of the place and what makes it special for families!", 'excited');
        break;
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Start listening
      setTimeout(() => {
        addJoyMessage("I heard you perfectly! Let me help with that right away! 👂", 'helpful');
        setIsListening(false);
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <Card className="w-full max-w-md mx-auto mb-0 rounded-t-3xl rounded-b-none card-joy border-0 min-h-[70vh] flex flex-col">
        {/* Joy Header */}
        <div className="p-6 bg-gradient-to-r from-primary to-accent text-white rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <JoyCharacter 
                size="md" 
                animation={isListening ? "talking" : "idle"} 
                className="text-white"
              />
              <div>
                <h3 className="text-lg font-bold">Joy Assistant</h3>
                <p className="text-white/80 text-sm">Your family's magical helper</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Joy Status */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full pulse-joy" />
            <span className="text-white/90 text-sm">
              {kidsInCarMode 
                ? "Ready for magical adventures! ✨👨‍👩‍👧‍👦" 
                : raynesWayEnabled 
                ? "Sun-smart mode active! ☀️🌳" 
                : "Ready to help your family! ✨"
              }
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-accent-soft text-foreground mr-4'
                }`}
              >
                {message.type === 'joy' && (
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-accent" />
                    <span className="text-xs font-medium text-accent">Joy</span>
                  </div>
                )}
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-border/50">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { 
                id: 'find-playground', 
                label: raynesWayEnabled ? '🎪 Shaded Play' : '🎪 Find Play Area', 
                variant: 'joy-soft' as const 
              },
              { id: 'bathroom-break', label: '🚻 Restroom Stop', variant: 'adventure-soft' as const },
              { 
                id: 'food-stop', 
                label: kidsInCarMode ? '🍎 Yummy Treats' : '🍎 Food & Snacks', 
                variant: 'joy-soft' as const 
              },
              { 
                id: 'entertainment', 
                label: kidsInCarMode ? '🎵 Fun Games' : '🎵 Car Games', 
                variant: 'adventure-soft' as const 
              },
              { id: 'safety-check', label: '🛡️ Safety Check', variant: 'emergency' as const },
              { id: 'submit-pin', label: '💖 Add Joy Pin', variant: 'secondary' as const }
            ].map((action) => (
              <Button
                key={action.id}
                variant={action.variant}
                size="sm"
                onClick={() => handleQuickAction(action.id)}
                className="text-xs h-10 p-2"
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-3">
            <Button
              variant={isListening ? "emergency" : "joy"}
              size="icon"
              onClick={toggleListening}
              className="rounded-full"
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>
            
            <div className="flex-1 flex items-center gap-2">
              {isListening ? (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                    <div className="w-1 h-6 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                    <div className="w-1 h-5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-muted-foreground">Listening...</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Tap to ask Joy anything!</span>
              )}
            </div>

            <Button variant="ghost" size="icon">
              <Volume2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}