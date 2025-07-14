import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Phone, MapPin, Clock, Users, AlertTriangle, Heart } from "lucide-react";

export default function EmergencyScreen() {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (emergencyActive && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (emergencyActive && countdown === 0) {
      setLocationShared(true);
    }
  }, [emergencyActive, countdown]);

  const activateEmergency = () => {
    setEmergencyActive(true);
    setCountdown(10);
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setLocationShared(false);
    setCountdown(10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted relative">
      {/* Emergency Active Overlay */}
      {emergencyActive && (
        <div className="absolute inset-0 bg-emergency-red/20 z-10 pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            emergencyActive ? 'bg-emergency-red' : 'bg-primary'
          }`}>
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Family Safety</h1>
            <p className="text-xs text-muted-foreground">
              {emergencyActive ? 'Emergency Mode Active' : 'Safety controls and emergency features'}
            </p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {!emergencyActive ? (
          <>
            {/* Safety Overview */}
            <Card className="card-feature p-6">
              <div className="text-center">
                <Shield className="w-16 h-16 icon-joy mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Your Family's Safety First</h2>
                <p className="text-muted-foreground mb-4">
                  Park N Joy keeps your family safe with emergency features and location sharing
                </p>
                <Badge variant="secondary" className="bg-primary-soft text-primary">
                  ✅ All systems ready
                </Badge>
              </div>
            </Card>

            {/* Emergency Contacts */}
            <Card className="card-joy p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 icon-joy" />
                Emergency Contacts
              </h3>
              
              <div className="space-y-3">
                {[
                  { name: "911 Emergency", number: "911", type: "Emergency Services" },
                  { name: "Mom's Phone", number: "(555) 123-4567", type: "Primary Contact" },
                  { name: "Dad's Work", number: "(555) 987-6543", type: "Secondary Contact" },
                  { name: "Grandma", number: "(555) 456-7890", type: "Family Contact" }
                ].map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{contact.name}</h4>
                      <p className="text-sm text-muted-foreground">{contact.type}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Location Sharing */}
            <Card className="card-joy p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 icon-adventure" />
                Location Sharing
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-secondary-soft rounded-lg">
                  <div>
                    <h4 className="font-medium">Real-time Location</h4>
                    <p className="text-sm text-muted-foreground">Share with emergency contacts</p>
                  </div>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Trip Progress</h4>
                    <p className="text-sm text-muted-foreground">Auto-updates family on journey</p>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Enabled
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Emergency Activation */}
            <Card className="card-joy p-6 border-emergency-red/20">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-emergency-red mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">Emergency Mode</h3>
                <p className="text-muted-foreground mb-6">
                  Instantly share location and alert all emergency contacts
                </p>
                <Button 
                  variant="emergency" 
                  size="lg" 
                  onClick={activateEmergency}
                  className="w-full"
                >
                  <Shield className="w-5 h-5" />
                  Activate Emergency Mode
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Will send alerts after 10 second countdown
                </p>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Emergency Active */}
            <Card className="card-joy p-6 border-emergency-red bg-emergency-red/5">
              <div className="text-center">
                <div className="w-20 h-20 bg-emergency-red rounded-full flex items-center justify-center mx-auto mb-4 pulse-joy">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-emergency-red mb-2">Emergency Mode Active</h2>
                
                {!locationShared ? (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Alerting emergency contacts in...
                    </p>
                    <div className="text-6xl font-bold text-emergency-red mb-4">
                      {countdown}
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={cancelEmergency}
                      className="border-emergency-red text-emergency-red hover:bg-emergency-red hover:text-white"
                    >
                      Cancel Emergency
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="secondary" className="bg-emergency-red text-white mb-4">
                      ✅ Emergency contacts notified
                    </Badge>
                    <p className="text-muted-foreground mb-4">
                      Your location has been shared with all emergency contacts
                    </p>
                  </>
                )}
              </div>
            </Card>

            {locationShared && (
              <>
                {/* Status Updates */}
                <Card className="card-joy p-4">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 icon-joy" />
                    Emergency Status
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-emergency-red/10 rounded-lg">
                      <div className="w-2 h-2 bg-emergency-red rounded-full" />
                      <span className="text-sm">Location shared with emergency contacts</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emergency-red/10 rounded-lg">
                      <div className="w-2 h-2 bg-emergency-red rounded-full" />
                      <span className="text-sm">Emergency services contact ready</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emergency-red/10 rounded-lg">
                      <div className="w-2 h-2 bg-emergency-red rounded-full" />
                      <span className="text-sm">Joy Assistant standing by</span>
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="emergency" className="h-16 flex-col">
                    <Phone className="w-6 h-6 mb-1" />
                    Call 911
                  </Button>
                  <Button variant="outline" className="h-16 flex-col border-emergency-red text-emergency-red">
                    <Users className="w-6 h-6 mb-1" />
                    Contact Family
                  </Button>
                </div>

                {/* Deactivate */}
                <Button 
                  variant="outline" 
                  onClick={cancelEmergency}
                  className="w-full mt-4"
                >
                  Deactivate Emergency Mode
                </Button>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}