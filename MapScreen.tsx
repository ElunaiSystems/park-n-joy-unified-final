import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Car, Sun, Zap, Users, Shield } from "lucide-react";
import LiveMapView from "@/components/LiveMapView";
import JoyVoiceAssistant from "@/components/JoyVoiceAssistant";

export default function MapScreen() {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [raynesWayMode, setRaynesWayMode] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      {/* Emergency Mode Overlay */}
      {emergencyMode && (
        <div className="absolute inset-0 bg-emergency-red/10 z-10 pointer-events-none" />
      )}

      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Park N Joy</h1>
              <p className="text-xs text-muted-foreground">Family Adventure Mode</p>
            </div>
          </div>
          
          {/* Emergency Toggle */}
          <Button
            variant={emergencyMode ? "emergency" : "outline"}
            size="sm"
            onClick={() => setEmergencyMode(!emergencyMode)}
            className="relative"
          >
            <Shield className="w-4 h-4" />
            Emergency
          </Button>
        </div>
      </header>

      {/* Real-time Map Integration */}
      <main className="flex-1 relative p-4">
        <LiveMapView 
          raynesWayMode={raynesWayMode}
          onStopSelect={(stop) => {
            console.log('Selected stop:', stop);
            // Handle stop selection
          }}
        />

        {/* Quick Actions */}
        <div className="mt-4 space-y-3">
          {/* Rayne's Way Toggle */}
          <Card className="card-joy p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className={`w-6 h-6 ${raynesWayMode ? 'icon-accent' : 'icon-adventure'}`} />
                <div>
                  <h4 className="font-semibold">Rayne's Way</h4>
                  <p className="text-sm text-muted-foreground">Shade-aware routing</p>
                </div>
              </div>
              <Button
                variant={raynesWayMode ? "adventure" : "adventure-soft"}
                size="sm"
                onClick={() => setRaynesWayMode(!raynesWayMode)}
              >
                {raynesWayMode ? "ON" : "OFF"}
              </Button>
            </div>
            {raynesWayMode && (
              <div className="mt-3 p-3 bg-accent-soft rounded-lg">
                <p className="text-xs text-accent-foreground">
                  ☀️ Prioritizing shaded outdoor stops and covered play areas
                </p>
              </div>
            )}
          </Card>

          {/* Joy Voice Assistant */}
          <JoyVoiceAssistant 
            raynesWayMode={raynesWayMode}
            kidsInCar={true}
            onStopSuggestion={(stop) => {
              console.log('Joy suggested stop:', stop);
              // Handle stop suggestion
            }}
          />

          {/* Joy Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="joy" className="h-16 flex-col" onClick={() => window.location.href = '/find-stops'}>
              <Navigation className="w-6 h-6 mb-1" />
              Find Stops
            </Button>
            <Button variant="adventure" className="h-16 flex-col" onClick={() => window.location.href = '/contribute'}>
              <Users className="w-6 h-6 mb-1" />
              Add Stop
            </Button>
          </div>
        </div>
      </main>

      {/* Joy Assistant FAB */}
      <div className="fixed bottom-6 right-6">
        <Button 
          variant="joy" 
          size="fab"
          className="pulse-joy"
        >
          <Zap className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
}