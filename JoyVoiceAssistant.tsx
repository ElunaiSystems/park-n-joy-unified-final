import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX, Zap, Heart, Navigation } from 'lucide-react';
import { type JoyStop } from '@/services/mappingService';

interface JoyVoiceAssistantProps {
  raynesWayMode?: boolean;
  kidsInCar?: boolean;
  onStopSuggestion?: (stop: JoyStop) => void;
}

export default function JoyVoiceAssistant({ 
  raynesWayMode = false, 
  kidsInCar = false,
  onStopSuggestion 
}: JoyVoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [volume, setVolume] = useState(0.7);
  const [isActive, setIsActive] = useState(false);

  // Mock Joy responses based on context
  const joyResponses = {
    greeting: kidsInCar 
      ? "Hello wonderful family! I'm Joy, your friendly travel assistant. I see you have little adventurers with you - let's make this trip magical! 🎪"
      : "Hi there! I'm Joy, your travel companion. Ready to discover amazing family-friendly stops along your route?",
    
    raynesWayActivated: "Perfect! I've switched to Rayne's Way mode. I'll prioritize shaded outdoor stops and indoor play areas to keep everyone comfortable in the sun. ☀️",
    
    stopSuggestion: raynesWayMode
      ? "I found a shaded playground just 3 minutes ahead with covered picnic areas and clean restrooms. Want to stretch those little legs in the shade?"
      : "There's a fantastic family playground coming up in 5 minutes. It has great reviews for cleanliness and safety - perfect for a fun break!",
    
    emergencyMode: "I'm here to help. I've located the nearest family-safe stops with clean facilities and good lighting. Stay calm, and let's get you somewhere safe.",
    
    thanks: kidsInCar
      ? "You're so welcome! Thanks for sharing that awesome stop with other families. You just earned 50 Joy Points! 🌟"
      : "Thank you for contributing to our Joy community! Your pin submission helps other families discover great stops."
  };

  const mockStopSuggestions: JoyStop[] = [
    {
      id: 'voice_suggest_1',
      name: raynesWayMode ? 'Shaded Adventure Park' : 'Sunshine Family Playground',
      type: 'playground',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      address: '123 Joy Lane, Family City',
      joyRating: 4.7,
      shadeScore: raynesWayMode ? 9 : 6,
      accessibilityScore: 8,
      familyFriendly: true,
      joyVerified: true,
      confidence: 'high',
      features: raynesWayMode 
        ? ['covered_playground', 'shaded_seating', 'restrooms', 'parking']
        : ['playground', 'restrooms', 'parking', 'some_shade'],
      description: raynesWayMode 
        ? 'Beautiful playground with full shade coverage and misting systems'
        : 'Well-maintained playground with modern equipment and family amenities',
      images: [],
      suggestedBy: 'joy_ai',
      moderationStatus: 'approved',
      submittedAt: new Date().toISOString()
    }
  ];

  const speakMessage = (message: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      setCurrentMessage(message);
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.volume = volume;
      utterance.rate = kidsInCar ? 0.9 : 1.0; // Slightly slower for kids
      utterance.pitch = kidsInCar ? 1.2 : 1.0; // Slightly higher pitch for kids
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setCurrentMessage('');
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentMessage('');
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      // Fallback for browsers without speech recognition
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleVoiceCommand("suggest a stop"); // Mock command
      }, 2000);
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);

    if (command.includes('stop') || command.includes('break') || command.includes('playground')) {
      const suggestion = mockStopSuggestions[0];
      speakMessage(joyResponses.stopSuggestion);
      onStopSuggestion?.(suggestion);
    } else if (command.includes('thank') || command.includes('thanks')) {
      speakMessage(joyResponses.thanks);
    } else if (command.includes('emergency') || command.includes('help')) {
      speakMessage(joyResponses.emergencyMode);
    } else if (command.includes('shade') || command.includes('rayne')) {
      speakMessage(joyResponses.raynesWayActivated);
    } else {
      speakMessage(kidsInCar 
        ? "I didn't quite catch that, sweetie! Try asking me about playgrounds, rest stops, or restaurants!"
        : "I'm not sure about that. Try asking about stops, restaurants, or playgrounds along your route."
      );
    }
  };

  const toggleActive = () => {
    if (!isActive) {
      setIsActive(true);
      speakMessage(joyResponses.greeting);
    } else {
      setIsActive(false);
      stopSpeaking();
    }
  };

  return (
    <Card className={`p-4 ${isActive ? 'ring-2 ring-primary' : ''} transition-all`}>
      <div className="space-y-4">
        {/* Joy Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isSpeaking ? 'bg-primary animate-pulse' : 'bg-gradient-to-br from-primary to-accent'
            }`}>
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold flex items-center gap-2">
                Joy Assistant
                {kidsInCar && <Badge variant="secondary" className="bg-pink-100 text-pink-800">Kids Mode</Badge>}
                {raynesWayMode && <Badge variant="secondary" className="bg-orange-100 text-orange-800">☀️ Rayne's Way</Badge>}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready to help'}
              </p>
            </div>
          </div>
          
          <Button 
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={toggleActive}
          >
            {isActive ? 'Active' : 'Activate Joy'}
          </Button>
        </div>

        {/* Current Message Display */}
        {currentMessage && (
          <div className="p-3 bg-primary-soft rounded-lg">
            <p className="text-sm text-primary font-medium">
              💬 Joy says: "{currentMessage}"
            </p>
          </div>
        )}

        {/* Voice Controls */}
        {isActive && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={startListening}
                disabled={isSpeaking}
                className="flex-1"
              >
                {isListening ? <Mic className="w-4 h-4 mr-1" /> : <MicOff className="w-4 h-4 mr-1" />}
                {isListening ? 'Listening...' : 'Ask Joy'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => speakMessage(joyResponses.greeting)}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="joy-soft"
                size="sm"
                onClick={() => {
                  const suggestion = mockStopSuggestions[0];
                  speakMessage(joyResponses.stopSuggestion);
                  onStopSuggestion?.(suggestion);
                }}
              >
                <Navigation className="w-3 h-3 mr-1" />
                Suggest Stop
              </Button>
              
              <Button
                variant="adventure-soft"
                size="sm"
                onClick={() => speakMessage(joyResponses.thanks)}
              >
                <Heart className="w-3 h-3 mr-1" />
                Say Thanks
              </Button>
            </div>

            {/* Voice Tips */}
            <div className="p-2 bg-muted/50 rounded text-xs text-muted-foreground">
              💡 Try saying: "Find a playground", "Suggest a restaurant", or "Thank you Joy"
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}