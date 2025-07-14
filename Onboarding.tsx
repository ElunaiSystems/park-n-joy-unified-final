import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, X, Car, MapPin, Users, Shield, 
  Heart, Sun, Baby, Sparkles, Calendar, Star, Zap, Globe,
  Camera, Music, BookOpen, Gift, Settings, Navigation
} from 'lucide-react';
import JoyCharacter from './JoyCharacter';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [familyName, setFamilyName] = useState('');
  const [familyMembers, setFamilyMembers] = useState([{ name: '', age: '', relationship: 'child' }]);
  const [vehicleType, setVehicleType] = useState('');
  const [accessibilityNeeds, setAccessibilityNeeds] = useState<string[]>([]);
  const [joyTone, setJoyTone] = useState('cheerful');
  const [raynesWayDefault, setRaynesWayDefault] = useState(false);
  const [kidsInCarDefault, setKidsInCarDefault] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      id: 'welcome',
      title: '🎉 Welcome to Park N Joy!',
      subtitle: 'Your magical family travel companion',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <JoyCharacter 
              size="xl" 
              animation="idle" 
              interactive={false}
            />
          </div>
          <div className="space-y-4">
            <p className="text-lg text-muted-foreground">
              Discover amazing family-friendly stops, plan safe routes, and create unforgettable memories!
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center p-3 bg-primary-soft rounded-lg">
                <MapPin className="w-6 h-6 text-primary mx-auto mb-2" />
                <span className="text-sm font-medium">Joy Pins</span>
              </div>
              <div className="text-center p-3 bg-accent-soft rounded-lg">
                <Shield className="w-6 h-6 text-accent mx-auto mb-2" />
                <span className="text-sm font-medium">Safe Routes</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'family',
      title: '👨‍👩‍👧‍👦 Tell Us About Your Family',
      subtitle: 'Help us personalize your experience',
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Family Name</label>
            <Input
              placeholder="The Johnson Family"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="touch-friendly"
            />
          </div>
          
          <div className="space-y-4">
            <label className="text-sm font-medium block">Family Members</label>
            {familyMembers.map((member, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => {
                      const updated = [...familyMembers];
                      updated[index].name = e.target.value;
                      setFamilyMembers(updated);
                    }}
                  />
                  <Input
                    placeholder="Age"
                    value={member.age}
                    onChange={(e) => {
                      const updated = [...familyMembers];
                      updated[index].age = e.target.value;
                      setFamilyMembers(updated);
                    }}
                  />
                </div>
                <select
                  value={member.relationship}
                  onChange={(e) => {
                    const updated = [...familyMembers];
                    updated[index].relationship = e.target.value;
                    setFamilyMembers(updated);
                  }}
                  className="w-full p-2 border rounded-lg mt-2"
                >
                  <option value="child">Child</option>
                  <option value="adult">Adult</option>
                  <option value="teen">Teen</option>
                  <option value="toddler">Toddler</option>
                  <option value="baby">Baby</option>
                </select>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setFamilyMembers([...familyMembers, { name: '', age: '', relationship: 'child' }])}
            className="w-full"
          >
            + Add Family Member
          </Button>
        </div>
      )
    },
    {
      id: 'vehicle',
      title: '🚗 Your Vehicle & Needs',
      subtitle: 'Help us find the perfect stops',
      content: (
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Vehicle Type</label>
            <div className="grid grid-cols-2 gap-3">
              {['Car', 'SUV', 'Van', 'RV', 'Truck', 'Motorcycle'].map((type) => (
                <Button
                  key={type}
                  variant={vehicleType === type ? 'default' : 'outline'}
                  onClick={() => setVehicleType(type)}
                  className="h-12"
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Accessibility Needs</label>
            <div className="space-y-2">
              {[
                'Wheelchair accessible',
                'Stroller friendly',
                'Visual impairment support',
                'Hearing impairment support',
                'Autism-friendly',
                'Senior-friendly'
              ].map((need) => (
                <label key={need} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={accessibilityNeeds.includes(need)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setAccessibilityNeeds([...accessibilityNeeds, need]);
                      } else {
                        setAccessibilityNeeds(accessibilityNeeds.filter(n => n !== need));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{need}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'joy-personality',
      title: '✨ Meet Joy, Your AI Assistant',
      subtitle: 'Customize how Joy helps your family',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <JoyCharacter 
                size="lg" 
                animation="idle"
              />
            </div>
            <p className="text-muted-foreground">
              Joy will help you discover amazing stops, plan safe routes, and make every trip magical!
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-3 block">Joy's Personality</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cheerful', name: 'Cheerful', icon: '😊' },
                { id: 'calm', name: 'Calm', icon: '😌' },
                { id: 'playful', name: 'Playful', icon: '🎪' },
                { id: 'gentle', name: 'Gentle', icon: '🤗' }
              ].map((tone) => (
                <Button
                  key={tone.id}
                  variant={joyTone === tone.id ? 'default' : 'outline'}
                  onClick={() => setJoyTone(tone.id)}
                  className="h-16 flex-col gap-1"
                >
                  <span className="text-xl">{tone.icon}</span>
                  <span className="text-sm">{tone.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'special-modes',
      title: '🌟 Special Travel Modes',
      subtitle: 'Enable features that matter to your family',
      content: (
        <div className="space-y-6">
          <Card className="p-4 border-2 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-accent" />
                <div>
                  <h3 className="font-semibold">☀️ Rayne's Way</h3>
                  <p className="text-sm text-muted-foreground">Sun-safe routing for light-sensitive families</p>
                </div>
              </div>
              <Switch
                checked={raynesWayDefault}
                onCheckedChange={setRaynesWayDefault}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Prioritizes shaded playgrounds, covered rest areas, and indoor activities during peak UV hours.
            </div>
          </Card>
          
          <Card className="p-4 border-2 border-accent/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Baby className="w-6 h-6 text-primary" />
                <div>
                  <h3 className="font-semibold">🚸 Kids in Car Mode</h3>
                  <p className="text-sm text-muted-foreground">Family-friendly suggestions & gentle reminders</p>
                </div>
              </div>
              <Switch
                checked={kidsInCarDefault}
                onCheckedChange={setKidsInCarDefault}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Joy uses softer language and focuses on kid-friendly activities and safety.
            </div>
          </Card>
          
          <div className="bg-gradient-to-r from-primary-soft to-accent-soft p-4 rounded-lg">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Heart className="w-4 h-4" />
              What Makes Park N Joy Special
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✨ AI-powered stop recommendations</li>
              <li>🌳 Shade-prioritized routing options</li>
              <li>🎪 Family-friendly verification system</li>
              <li>📱 Works offline for emergency situations</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'ready',
      title: '🎉 You\'re All Set!',
      subtitle: 'Ready to start your adventure?',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <JoyCharacter 
              size="xl" 
              animation="idle" 
              interactive={false}
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Welcome to the Joy Family! 🎊</h3>
            <p className="text-muted-foreground">
              Your profile is ready! Joy will now help you discover amazing family-friendly stops and plan the perfect routes.
            </p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <div className="text-center p-3 bg-primary-soft rounded-lg">
                <Star className="w-6 h-6 text-primary mx-auto mb-1" />
                <span className="text-xs font-medium">Earn Joy Points</span>
              </div>
              <div className="text-center p-3 bg-accent-soft rounded-lg">
                <Globe className="w-6 h-6 text-accent mx-auto mb-1" />
                <span className="text-xs font-medium">Explore Pins</span>
              </div>
            </div>
          </div>
          
          <Card className="p-4 bg-gradient-to-r from-secondary-soft to-primary-soft border-0">
            <h4 className="font-semibold mb-2">🌟 Pro Tips for New Families:</h4>
            <ul className="space-y-1 text-sm text-left">
              <li>• Tap the Joy button anytime for help</li>
              <li>• Enable location for personalized suggestions</li>
              <li>• Submit your own favorite family spots</li>
              <li>• Check emergency mode features before trips</li>
            </ul>
          </Card>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipSetup = () => {
    // Save minimal data and complete onboarding
    localStorage.setItem('parknjoy-skip-setup', 'true');
    onComplete();
  };

  const completeOnboarding = () => {
    // Save all collected data
    const userData = {
      familyName,
      familyMembers,
      vehicleType,
      accessibilityNeeds,
      joyTone,
      raynesWayDefault,
      kidsInCarDefault,
      setupCompleted: true,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('parknjoy-user-data', JSON.stringify(userData));
    onComplete();
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: currentSlide * scrollContainerRef.current.clientWidth,
        behavior: 'smooth'
      });
    }
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/30 to-accent-soft/30 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-card/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Park N Joy</h1>
            <p className="text-xs text-muted-foreground">Family Setup</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={skipSetup}>
          Skip Setup
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentSlide + 1} of {slides.length}
          </span>
          <span className="text-sm font-medium">
            {Math.round(((currentSlide + 1) / slides.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollContainerRef}
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className="w-full flex-shrink-0 px-4 py-6 overflow-y-auto"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">{slide.title}</h2>
                  <p className="text-muted-foreground">{slide.subtitle}</p>
                </div>
                
                <div className="min-h-[400px]">
                  {slide.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 bg-card/80 backdrop-blur-sm border-t">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {currentSlide === slides.length - 1 ? (
            <Button onClick={completeOnboarding} className="btn-joy">
              🚀 Let's Go!
            </Button>
          ) : (
            <Button
              onClick={nextSlide}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;