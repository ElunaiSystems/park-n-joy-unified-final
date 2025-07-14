import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Search, Clock, Sun, Shield, Baby, 
  ArrowLeft, Star, Calendar, Users, Coffee
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StadiumSection {
  id: string;
  section: string;
  shadeScore: number;
  sunSmartVerified: boolean;
  wheelchairAccessible: boolean;
  familyZone: boolean;
  nearConcessions: boolean;
  strollerFriendly: boolean;
  timeBasedShade: {
    morning: number;
    afternoon: number;
    evening: number;
  };
  price: string;
  description: string;
  bestFor: string[];
}

interface Stadium {
  id: string;
  name: string;
  city: string;
  sport: string;
  nextEvent: {
    name: string;
    date: string;
    time: string;
  };
  sections: StadiumSection[];
  uvIndex: number;
  weather: {
    temp: number;
    condition: string;
    description: string;
  };
}

const mockStadiums: Stadium[] = [
  {
    id: '1',
    name: 'Sunshine Stadium',
    city: 'Orlando, FL',
    sport: 'Baseball',
    nextEvent: {
      name: 'Rays vs Yankees',
      date: 'Today',
      time: '1:30 PM'
    },
    uvIndex: 9,
    weather: {
      temp: 87,
      condition: 'sunny',
      description: 'Sunny and hot'
    },
    sections: [
      {
        id: '1',
        section: 'Club Level 200',
        shadeScore: 5,
        sunSmartVerified: true,
        wheelchairAccessible: true,
        familyZone: true,
        nearConcessions: true,
        strollerFriendly: true,
        timeBasedShade: { morning: 3, afternoon: 5, evening: 4 },
        price: '$85',
        description: 'Fully covered club level with premium amenities and family-friendly atmosphere.',
        bestFor: ['Families with young kids', 'Sun-sensitive guests', 'Premium experience']
      },
      {
        id: '2',
        section: 'First Base Pavilion',
        shadeScore: 4,
        sunSmartVerified: true,
        wheelchairAccessible: true,
        familyZone: false,
        nearConcessions: true,
        strollerFriendly: true,
        timeBasedShade: { morning: 2, afternoon: 4, evening: 5 },
        price: '$45',
        description: 'Covered seating along first base with great views and afternoon shade.',
        bestFor: ['Afternoon games', 'Budget-conscious families', 'Great baseball views']
      },
      {
        id: '3',
        section: 'Outfield Terrace',
        shadeScore: 2,
        sunSmartVerified: false,
        wheelchairAccessible: true,
        familyZone: true,
        nearConcessions: false,
        strollerFriendly: true,
        timeBasedShade: { morning: 1, afternoon: 2, evening: 3 },
        price: '$25',
        description: 'Open-air seating with partial shade structures and kid-friendly activities.',
        bestFor: ['Evening games', 'Budget tickets', 'Kids activities nearby']
      }
    ]
  },
  {
    id: '2',
    name: 'MetLife Stadium',
    city: 'East Rutherford, NJ',
    sport: 'Football',
    nextEvent: {
      name: 'Giants vs Cowboys',
      date: 'Sunday',
      time: '4:25 PM'
    },
    uvIndex: 6,
    weather: {
      temp: 72,
      condition: 'partly_cloudy',
      description: 'Partly cloudy'
    },
    sections: [
      {
        id: '4',
        section: 'Club Level West',
        shadeScore: 5,
        sunSmartVerified: true,
        wheelchairAccessible: true,
        familyZone: false,
        nearConcessions: true,
        strollerFriendly: false,
        timeBasedShade: { morning: 5, afternoon: 5, evening: 4 },
        price: '$195',
        description: 'Climate-controlled club seating with indoor/outdoor options.',
        bestFor: ['All weather', 'Premium comfort', 'Business entertaining']
      }
    ]
  }
];

export default function StadiumFinderScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [selectedTime, setSelectedTime] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');
  const [wheelchairFilter, setWheelchairFilter] = useState(false);
  const [familyZoneFilter, setFamilyZoneFilter] = useState(false);
  const [sunSmartFilter, setSunSmartFilter] = useState(false);
  const [strollerFilter, setStrollerFilter] = useState(false);

  const filteredStadiums = mockStadiums.filter(stadium =>
    stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stadium.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stadium.sport.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getShadeForTime = (section: StadiumSection, time: 'morning' | 'afternoon' | 'evening') => {
    return section.timeBasedShade[time];
  };

  const getTimeIcon = (time: 'morning' | 'afternoon' | 'evening') => {
    switch (time) {
      case 'morning': return '🌅';
      case 'afternoon': return '☀️';
      case 'evening': return '🌆';
    }
  };

  const getShadeIcon = (score: number) => {
    if (score >= 4) return '🌳';
    if (score >= 2) return '⛅';
    return '☀️';
  };

  const getUVWarning = (uvIndex: number) => {
    if (uvIndex >= 8) return { level: 'Very High', color: 'text-emergency-red', advice: 'Seek shade, use sunscreen' };
    if (uvIndex >= 6) return { level: 'High', color: 'text-joy-orange', advice: 'Shade recommended' };
    if (uvIndex >= 3) return { level: 'Moderate', color: 'text-accent', advice: 'Some protection needed' };
    return { level: 'Low', color: 'text-secondary', advice: 'Minimal protection needed' };
  };

  const filterSections = (sections: StadiumSection[]) => {
    return sections.filter(section => {
      const matchesWheelchair = !wheelchairFilter || section.wheelchairAccessible;
      const matchesFamily = !familyZoneFilter || section.familyZone;
      const matchesSunSmart = !sunSmartFilter || section.sunSmartVerified;
      const matchesStroller = !strollerFilter || section.strollerFriendly;
      
      return matchesWheelchair && matchesFamily && matchesSunSmart && matchesStroller;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center gap-3 mb-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">Stadium Shade Finder</h1>
            <p className="text-xs text-muted-foreground">Find the best shaded seats</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search stadiums, teams, cities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </header>

      <main className="p-4 space-y-4">
        {!selectedStadium ? (
          <>
            {/* Stadium List */}
            <div className="space-y-3">
              {filteredStadiums.map((stadium) => {
                const uvWarning = getUVWarning(stadium.uvIndex);
                
                return (
                  <Card key={stadium.id} className="card-joy p-4 cursor-pointer hover:scale-[1.02] transition-transform" 
                        onClick={() => setSelectedStadium(stadium)}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-base">{stadium.name}</h3>
                            <p className="text-sm text-muted-foreground">{stadium.city} • {stadium.sport}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {stadium.weather.temp}°F
                          </Badge>
                        </div>

                        {/* Next Event */}
                        <div className="flex items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">{stadium.nextEvent.name}</span>
                          <span className="text-xs text-muted-foreground">{stadium.nextEvent.date} at {stadium.nextEvent.time}</span>
                        </div>

                        {/* UV Warning */}
                        <div className="flex items-center gap-2 mb-3">
                          <Sun className={`w-4 h-4 ${uvWarning.color}`} />
                          <span className={`text-xs font-medium ${uvWarning.color}`}>
                            UV Index: {stadium.uvIndex} ({uvWarning.level})
                          </span>
                          <span className="text-xs text-muted-foreground">• {uvWarning.advice}</span>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{stadium.sections.length} seating areas</span>
                          <span>{stadium.sections.filter(s => s.sunSmartVerified).length} Sun Smart verified</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {filteredStadiums.length === 0 && (
              <Card className="card-joy p-8 text-center">
                <MapPin className="w-12 h-12 icon-muted mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No stadiums found</h3>
                <p className="text-sm text-muted-foreground">
                  Try searching for a different stadium, team, or city.
                </p>
              </Card>
            )}
          </>
        ) : (
          <>
            {/* Stadium Detail View */}
            <Card className="card-feature p-6">
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" size="icon" onClick={() => setSelectedStadium(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{selectedStadium.name}</h2>
                  <p className="text-muted-foreground">{selectedStadium.city} • {selectedStadium.sport}</p>
                </div>
              </div>

              {/* Event & Weather Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-primary-soft rounded-lg">
                  <Calendar className="w-5 h-5 icon-primary mx-auto mb-1" />
                  <p className="text-sm font-medium">{selectedStadium.nextEvent.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedStadium.nextEvent.date} • {selectedStadium.nextEvent.time}</p>
                </div>
                <div className="text-center p-3 bg-secondary-soft rounded-lg">
                  <Sun className="w-5 h-5 icon-secondary mx-auto mb-1" />
                  <p className="text-sm font-medium">{selectedStadium.weather.temp}°F</p>
                  <p className="text-xs text-muted-foreground">UV Index: {selectedStadium.uvIndex}</p>
                </div>
              </div>

              {/* UV Warning */}
              {(() => {
                const warning = getUVWarning(selectedStadium.uvIndex);
                return (
                  <div className={`p-3 rounded-lg mb-4 ${selectedStadium.uvIndex >= 8 ? 'bg-emergency-red/10' : selectedStadium.uvIndex >= 6 ? 'bg-joy-orange/10' : 'bg-secondary-soft'}`}>
                    <p className={`text-sm font-medium ${warning.color}`}>
                      ☀️ UV Alert: {warning.level} - {warning.advice}
                    </p>
                  </div>
                );
              })()}
            </Card>

            {/* Time-based Filtering */}
            <Card className="card-joy p-4">
              <h3 className="font-semibold mb-3">Game Time Shade Analysis</h3>
              <div className="grid grid-cols-3 gap-2">
                {(['morning', 'afternoon', 'evening'] as const).map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "joy" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="flex-col h-16"
                  >
                    <span className="text-lg mb-1">{getTimeIcon(time)}</span>
                    <span className="text-xs capitalize">{time}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Seating Filters */}
            <Card className="card-joy p-4">
              <h3 className="font-semibold mb-3">Seating Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm">☀️ Sun Smart Verified Only</span>
                  </div>
                  <Switch checked={sunSmartFilter} onCheckedChange={setSunSmartFilter} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">♿</span>
                    <span className="text-sm">♿ Wheelchair Accessible</span>
                  </div>
                  <Switch checked={wheelchairFilter} onCheckedChange={setWheelchairFilter} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-accent" />
                    <span className="text-sm">👨‍👩‍👧‍👦 Family Zone</span>
                  </div>
                  <Switch checked={familyZoneFilter} onCheckedChange={setFamilyZoneFilter} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Baby className="w-4 h-4 text-joy-orange" />
                    <span className="text-sm">🍼 Stroller Friendly</span>
                  </div>
                  <Switch checked={strollerFilter} onCheckedChange={setStrollerFilter} />
                </div>
              </div>
            </Card>

            {/* Seating Recommendations */}
            <div className="space-y-3">
              {filterSections(selectedStadium.sections)
                .sort((a, b) => getShadeForTime(b, selectedTime) - getShadeForTime(a, selectedTime))
                .map((section) => {
                  const timeShade = getShadeForTime(section, selectedTime);
                  
                  return (
                    <Card key={section.id} className="card-joy p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${section.sunSmartVerified ? 'bg-primary' : 'bg-secondary'}`}>
                          <span className="text-white text-lg">{getShadeIcon(timeShade)}</span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-base">{section.section}</h3>
                              <p className="text-sm text-muted-foreground">{section.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{section.price}</p>
                              {section.sunSmartVerified && (
                                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs mt-1">
                                  ☀️ Sun Smart
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Shade Score for Selected Time */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium">
                              {getTimeIcon(selectedTime)} {selectedTime.charAt(0).toUpperCase() + selectedTime.slice(1)} Shade:
                            </span>
                            <div className="flex items-center gap-1">
                              {getShadeIcon(timeShade)}
                              <span className="text-sm font-medium">{timeShade}/5</span>
                            </div>
                          </div>

                          {/* Features */}
                          <div className="flex items-center gap-3 mb-3">
                            {section.wheelchairAccessible && <span className="text-lg">♿</span>}
                            {section.familyZone && <Baby className="w-4 h-4 text-accent" />}
                            {section.nearConcessions && <Coffee className="w-4 h-4 text-joy-orange" />}
                            {section.strollerFriendly && <Baby className="w-4 h-4 text-primary" />}
                          </div>

                          {/* Best For */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {section.bestFor.map((item, index) => (
                              <span key={index} className="text-xs bg-accent-soft text-accent px-2 py-1 rounded">
                                {item}
                              </span>
                            ))}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            <Button variant="joy" size="sm">
                              Select Seats
                            </Button>
                            <Button variant="outline" size="sm">
                              View on Map
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>

            {filterSections(selectedStadium.sections).length === 0 && (
              <Card className="card-joy p-8 text-center">
                <Sun className="w-12 h-12 icon-muted mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No sections match your filters</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your preferences to see more seating options.
                </p>
                <Button variant="joy-soft" onClick={() => {
                  setWheelchairFilter(false);
                  setFamilyZoneFilter(false);
                  setSunSmartFilter(false);
                  setStrollerFilter(false);
                }}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}