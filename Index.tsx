import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import Onboarding from "@/components/Onboarding";
import JoyAssistant from "@/components/JoyAssistant";
import StoryMode from "@/components/StoryMode";
import { 
  Car, MapPin, Users, Shield, Gift, Sparkles, Navigation, Calendar, Zap, 
  MessageCircle, Trophy, Settings, Sun, Baby, Siren, BookOpen, Heart,
  Star, Camera, Palette, Volume2, Moon, X
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showJoyAssistant, setShowJoyAssistant] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [raynesWayEnabled, setRaynesWayEnabled] = useState(false);
  const [kidsInCarMode, setKidsInCarMode] = useState(false);
  const [joyPoints, setJoyPoints] = useState(567);
  const [badges, setBadges] = useState(8);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem('parknjoy-onboarded');
    if (hasOnboarded) {
      setShowOnboarding(false);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('parknjoy-onboarded', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Car className="w-7 h-7 text-white bounce-joy" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Park N Joy</h1>
              <p className="text-sm text-muted-foreground">Welcome back, Family!</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-accent text-accent-foreground">
            🌟 Founding Family
          </Badge>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Hero Welcome */}
        <Card className="card-feature p-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-10 h-10 text-white float-gentle" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Ready for Your Next Adventure?</h2>
          <p className="text-muted-foreground mb-6">
            Discover amazing family-friendly stops, plan magical trips, and create unforgettable memories together!
          </p>
          
          {/* Main Action Button */}
          <Button variant="joy" onClick={() => navigate('/plan')} className="w-full h-16 text-lg mb-4">
            <Navigation className="w-6 h-6 mr-2" />
            ❇️ Plan My Trip
          </Button>
          
          {/* Quick Mode Toggles */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={`p-3 rounded-lg border-2 transition-all ${raynesWayEnabled ? 'border-primary bg-primary-soft' : 'border-border bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className={`w-5 h-5 ${raynesWayEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">☀️ Rayne's Way</span>
                </div>
                <Switch 
                  checked={raynesWayEnabled} 
                  onCheckedChange={setRaynesWayEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Sun-safe routing</p>
            </div>
            
            <div className={`p-3 rounded-lg border-2 transition-all ${kidsInCarMode ? 'border-accent bg-accent-soft' : 'border-border bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Baby className={`w-5 h-5 ${kidsInCarMode ? 'text-accent' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">🚸 Kids in Car</span>
                </div>
                <Switch 
                  checked={kidsInCarMode} 
                  onCheckedChange={setKidsInCarMode}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Kid-friendly mode</p>
            </div>
          </div>
        </Card>

        {/* Joy Dashboard */}
        <Card className="card-joy p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 icon-joy" />
              🏅 Joy Points & Badges
            </h3>
            <Badge variant="secondary" className="bg-primary-soft text-primary">
              Level 3 Explorer
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-3xl font-bold text-primary">{joyPoints}</div>
              <p className="text-xs text-muted-foreground">Joy Points</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">{badges}</div>
              <p className="text-xs text-muted-foreground">Badges Earned</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">12</div>
              <p className="text-xs text-muted-foreground">Pins Visited</p>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary" className="bg-primary-soft text-primary">🎪 Playground Pro</Badge>
            <Badge variant="secondary" className="bg-accent-soft text-accent">🌳 Shade Seeker</Badge>
            <Badge variant="secondary" className="bg-secondary-soft text-secondary">🍦 Sweet Explorer</Badge>
          </div>
        </Card>

        {/* Main Features Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="joy-soft" className="h-20 flex-col p-4" onClick={() => setShowJoyAssistant(true)}>
            <MessageCircle className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">💬 Talk to Joy</span>
            <span className="text-xs text-muted-foreground">Voice & chat</span>
          </Button>
          
          <Button variant="adventure-soft" className="h-20 flex-col p-4" onClick={() => navigate('/find-stops')}>
            <MapPin className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">🗺️ Find Stops</span>
            <span className="text-xs text-muted-foreground">Discover places</span>
          </Button>
          
          <Button variant="joy-soft" className="h-20 flex-col p-4" onClick={() => setShowSettings(true)}>
            <Settings className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">⚙️ Customize Joy</span>
            <span className="text-xs text-muted-foreground">Preferences</span>
          </Button>
          
          <Button variant="emergency" className="h-20 flex-col p-4" onClick={() => navigate('/emergency')}>
            <Siren className="w-6 h-6 mb-2" />
            <span className="text-sm font-semibold">🚨 Emergency Mode</span>
            <span className="text-xs text-muted-foreground">Safety first</span>
          </Button>
        </div>

        {/* Story Mode & Special Features */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-joy p-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => setShowStoryMode(true)}>
            <div className="text-center">
              <BookOpen className="w-8 h-8 icon-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">🧩 Story Mode</h3>
              <p className="text-xs text-muted-foreground">Magical tales & tips</p>
            </div>
          </Card>
          
          <Card className="card-joy p-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/contribute')}>
            <div className="text-center">
              <Heart className="w-8 h-8 icon-joy mx-auto mb-2" />
              <h3 className="font-semibold text-sm">💖 Contribute Pin</h3>
              <p className="text-xs text-muted-foreground">Share joy spots</p>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="card-joy p-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/share')}>
            <div className="text-center">
              <Gift className="w-8 h-8 icon-accent mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Share Joy</h3>
              <p className="text-xs text-muted-foreground">Invite friends & family</p>
            </div>
          </Card>
          
          <Card className="card-joy p-4 cursor-pointer hover:scale-105 transition-transform">
            <div className="text-center">
              <Camera className="w-8 h-8 icon-secondary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Joy Memories</h3>
              <p className="text-xs text-muted-foreground">Photo gallery</p>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 icon-joy" />
            Recent Adventures
          </h3>
          
          <div className="space-y-3">
            {[
              { name: "Sunshine Park Playground", date: "2 days ago", rating: 5, type: "🎪" },
              { name: "Shady Oaks Rest Stop", date: "1 week ago", rating: 4, type: "🌳" },
              { name: "Ice Cream Dreams", date: "2 weeks ago", rating: 5, type: "🍦" }
            ].map((adventure, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{adventure.type}</span>
                  <div>
                    <h4 className="font-medium text-sm">{adventure.name}</h4>
                    <p className="text-xs text-muted-foreground">{adventure.date}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-accent-soft text-accent-foreground">
                  {"⭐".repeat(adventure.rating)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Joy Stats */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4">Your Joy Journey</h3>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">12</div>
              <p className="text-xs text-muted-foreground">Joy Pins Visited</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">3</div>
              <p className="text-xs text-muted-foreground">Trips Planned</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-foreground">567</div>
              <p className="text-xs text-muted-foreground">Joy Points</p>
            </div>
          </div>
        </Card>

        {/* Tips & Inspiration */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4">Joy Tips</h3>
          
          <div className="bg-primary-soft p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 icon-joy" />
              Today's Family Tip
            </h4>
            <p className="text-sm text-muted-foreground">
              🌳 Turn on "Rayne's Way" mode for shade-prioritized routing - perfect for sunny day adventures with little ones!
            </p>
          </div>
        </Card>
      </main>

      {/* Joy Assistant FAB */}
      <div className="fixed bottom-6 right-6">
        <Button 
          variant="joy" 
          size="fab"
          className="pulse-joy"
          onClick={() => setShowJoyAssistant(true)}
        >
          <Zap className="w-8 h-8" />
        </Button>
      </div>

      {/* Joy Assistant Modal */}
      <JoyAssistant 
        isOpen={showJoyAssistant} 
        onClose={() => setShowJoyAssistant(false)}
        kidsInCarMode={kidsInCarMode}
        raynesWayEnabled={raynesWayEnabled}
      />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md card-joy">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold">⚙️ Customize Joy</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Joy's Voice & Tone</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="joy-soft" size="sm">Cheerful</Button>
                    <Button variant="outline" size="sm">Calm</Button>
                    <Button variant="outline" size="sm">Playful</Button>
                    <Button variant="outline" size="sm">Gentle</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Animation Style</h4>
                  <div className="flex gap-2">
                    <Button variant="joy-soft" size="sm">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Magical
                    </Button>
                    <Button variant="outline" size="sm">Subtle</Button>
                    <Button variant="outline" size="sm">None</Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Appearance</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dark Mode</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Large Text</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Voice Feedback</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Theme Colors</h4>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-primary" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-transparent" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 border-2 border-transparent" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 border-2 border-transparent" />
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button variant="joy" className="flex-1">Save Changes</Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Story Mode Modal */}
      <StoryMode 
        isOpen={showStoryMode} 
        onClose={() => setShowStoryMode(false)}
        kidsInCarMode={kidsInCarMode}
      />
    </div>
  );
};

export default Index;
