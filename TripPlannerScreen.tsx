import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, MapPin, Plus, Calendar, Clock, Users2, Sparkles, Navigation, Sun, Zap, Filter, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripStop {
  id: string;
  name: string;
  type: 'start' | 'stop' | 'destination';
  joyRating: number;
  shadeAvailable: boolean;
  familyFriendly: boolean;
}

export default function TripPlannerScreen() {
  const navigate = useNavigate();
  const [tripStops, setTripStops] = useState<TripStop[]>([
    { id: '1', name: 'Home Sweet Home', type: 'start', joyRating: 5, shadeAvailable: true, familyFriendly: true },
    { id: '2', name: 'Adventure Destination', type: 'destination', joyRating: 5, shadeAvailable: true, familyFriendly: true }
  ]);
  const [raynesWayEnabled, setRaynesWayEnabled] = useState(false);
  const [stretchStopsEnabled, setStretchStopsEnabled] = useState(true);
  const [cleanBathroomsFilter, setCleanBathroomsFilter] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const addStop = () => {
    const newStop: TripStop = {
      id: Date.now().toString(),
      name: 'New Joy Stop',
      type: 'stop',
      joyRating: 4,
      shadeAvailable: true,
      familyFriendly: true
    };
    setTripStops(prev => [...prev.slice(0, -1), newStop, prev[prev.length - 1]]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Trip Planner</h1>
            <p className="text-xs text-muted-foreground">Design your family adventure</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Trip Overview */}
        <Card className="card-feature p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Family Road Trip</h2>
              <p className="text-muted-foreground">Create magical memories together</p>
            </div>
          </div>
          
          {/* Trip Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <Calendar className="w-5 h-5 icon-joy mx-auto mb-1" />
              <p className="text-xs font-medium">Today</p>
              <p className="text-xs text-muted-foreground">Departure</p>
            </div>
            <div className="text-center">
              <Clock className="w-5 h-5 icon-adventure mx-auto mb-1" />
              <p className="text-xs font-medium">4h 30m</p>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
            <div className="text-center">
              <Users2 className="w-5 h-5 icon-accent mx-auto mb-1" />
              <p className="text-xs font-medium">Family</p>
              <p className="text-xs text-muted-foreground">2 Adults, 2 Kids</p>
            </div>
          </div>
        </Card>

        {/* Trip Filters */}
        <Card className="card-joy p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Trip Preferences</h3>
            <Button variant="joy-soft" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>

          {/* Primary Toggles - Always Visible */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className={`p-3 rounded-lg border-2 transition-all ${raynesWayEnabled ? 'border-primary bg-primary-soft' : 'border-border bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className={`w-5 h-5 ${raynesWayEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <span className="text-sm font-medium">☀️ Rayne's Way (Sun-Safe Routing)</span>
                    <p className="text-xs text-muted-foreground">Prioritize shaded stops and indoor activities</p>
                  </div>
                </div>
                <Switch 
                  checked={raynesWayEnabled} 
                  onCheckedChange={setRaynesWayEnabled}
                />
              </div>
            </div>
          </div>

          {/* Additional Filters */}
          {showFilters && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">🚶 Stretch Stops</span>
                </div>
                <Switch 
                  checked={stretchStopsEnabled} 
                  onCheckedChange={setStretchStopsEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">🚻 Clean Bathrooms</span>
                </div>
                <Switch 
                  checked={cleanBathroomsFilter} 
                  onCheckedChange={setCleanBathroomsFilter}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Route Builder */}
        <Card className="card-joy p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Route</h3>
            <Button variant="joy-soft" size="sm" onClick={addStop}>
              <Plus className="w-4 h-4" />
              Add Stop
            </Button>
          </div>

          <div className="space-y-3">
            {tripStops.map((stop, index) => (
              <div key={stop.id} className="relative">
                {/* Connection Line */}
                {index < tripStops.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border" />
                )}
                
                <div className="flex items-start gap-3">
                  {/* Stop Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    stop.type === 'start' ? 'bg-primary' :
                    stop.type === 'destination' ? 'bg-secondary' :
                    'bg-accent'
                  }`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>

                  {/* Stop Details */}
                  <div className="flex-1">
                    <Input 
                      value={stop.name} 
                      className="font-medium border-0 p-0 h-auto bg-transparent text-base"
                      placeholder="Enter location..."
                    />
                    
                    {/* Joy Features */}
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary" className="bg-primary-soft text-primary text-xs">
                        ⭐ Joy Rating: {stop.joyRating}/5
                      </Badge>
                      {stop.shadeAvailable && (
                        <Badge variant="secondary" className={`text-xs ${raynesWayEnabled ? 'bg-primary text-primary-foreground' : 'bg-secondary-soft text-secondary'}`}>
                          {raynesWayEnabled ? '☀️ Sun-Safe' : '🌳 Shaded'}
                        </Badge>
                      )}
                      {stop.familyFriendly && (
                        <Badge variant="secondary" className="bg-accent-soft text-accent-foreground text-xs">
                          👨‍👩‍👧‍👦 Family Friendly
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Joy Suggestions */}
        <Card className="card-joy p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Joy's Smart Recommendations</h3>
            {raynesWayEnabled && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                ☀️ Sun-Safe Filtered
              </Badge>
            )}
          </div>
          
          <div className="space-y-3">
            {[
              { 
                name: raynesWayEnabled ? "Covered Adventure Playground" : "Sunshine Playground", 
                type: "🎪 Play Area", 
                distance: "5 min detour", 
                joyLevel: 5,
                features: raynesWayEnabled ? ["🌳 Full Shade", "❄️ AC Rest Area"] : ["☀️ Sunny", "🌳 Some Shade"]
              },
              { 
                name: "Shady Oaks Picnic Grove", 
                type: "🌳 Rest Stop", 
                distance: "2 min detour", 
                joyLevel: 4,
                features: ["🌳 Tree Cover", "🧺 Picnic Tables"]
              },
              { 
                name: raynesWayEnabled ? "Cool Treats Indoor Café" : "Ice Cream Dreams", 
                type: "🍦 Treat Stop", 
                distance: "3 min detour", 
                joyLevel: 5,
                features: raynesWayEnabled ? ["❄️ Air Conditioned", "🧒 Kids Menu"] : ["☀️ Outdoor Seating", "🎵 Play Area"]
              }
            ].map((suggestion, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{suggestion.name}</h4>
                  <p className="text-sm text-muted-foreground mb-1">{suggestion.type} • {suggestion.distance}</p>
                  <div className="flex gap-1 flex-wrap">
                    {suggestion.features.map((feature, idx) => (
                      <span key={idx} className="text-xs bg-accent-soft text-accent px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <Badge variant="secondary" className="bg-accent-soft text-accent-foreground">
                    {"⭐".repeat(suggestion.joyLevel)}
                  </Badge>
                  <Button variant="joy-soft" size="sm">
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Joy's Commentary */}
          <div className="mt-4 p-3 bg-primary-soft rounded-lg">
            <p className="text-sm text-primary font-medium">
              💬 Joy says: {raynesWayEnabled 
                ? "I've filtered these suggestions to prioritize shade and indoor comfort - perfect for sun-sensitive travelers!"
                : stretchStopsEnabled 
                ? "These stops are perfectly spaced for little legs that need to wiggle and stretch!"
                : "These family-favorite spots will make your journey extra special!"
              }
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button variant="joy" className="w-full" size="lg">
            <Navigation className="w-5 h-5" />
            Start Your Adventure
          </Button>
          <Button variant="adventure-soft" className="w-full">
            Save Trip for Later
          </Button>
        </div>
      </main>
    </div>
  );
}