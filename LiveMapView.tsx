import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Navigation, Heart, Sun, Users, Zap } from 'lucide-react';
import { mappingService, joyStopDiscovery, type JoyStop, type MapFilters } from '@/services/mappingService';
import { toast } from 'sonner';

interface LiveMapViewProps {
  initialLocation?: { lat: number; lng: number };
  onStopSelect?: (stop: JoyStop) => void;
  raynesWayMode?: boolean;
}

export default function LiveMapView({ initialLocation, onStopSelect, raynesWayMode = false }: LiveMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [stops, setStops] = useState<JoyStop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MapFilters>({
    stopTypes: [],
    accessibility: false,
    petFriendly: false,
    shadeRequired: raynesWayMode,
    joyVerifiedOnly: false,
    raynesWayMode
  });

  // Mock stops for demo when no Mapbox token
  const mockStops: JoyStop[] = [
    {
      id: 'mock_1',
      name: 'Sunshine Family Playground',
      type: 'playground',
      coordinates: { lat: 39.8283, lng: -98.5795 },
      address: '123 Joy Street, Family Town, KS',
      joyRating: 4.8,
      shadeScore: raynesWayMode ? 9 : 6,
      accessibilityScore: 8,
      familyFriendly: true,
      joyVerified: true,
      confidence: 'high',
      features: ['playground', 'restrooms', 'parking', 'shade_structures'],
      description: 'Award-winning playground with modern equipment and excellent shade coverage',
      images: ['/placeholder.svg'],
      suggestedBy: 'verified_data',
      moderationStatus: 'approved',
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    },
    {
      id: 'mock_2',
      name: 'Chick-fil-A Family Restaurant',
      type: 'restaurant',
      coordinates: { lat: 39.8383, lng: -98.5695 },
      address: '456 Family Drive, Joy City, KS',
      joyRating: 4.5,
      shadeScore: 10, // Indoor
      accessibilityScore: 9,
      familyFriendly: true,
      joyVerified: true,
      confidence: 'high',
      features: ['indoor_playground', 'restrooms', 'high_chairs', 'parking'],
      description: 'Joy-Verified sponsor location with indoor playground and family amenities',
      images: ['/placeholder.svg'],
      affiliateLink: 'https://chick-fil-a.com/locations?ref=park-n-joy',
      sponsorInfo: {
        id: 'chick_fil_a',
        verificationLevel: 'gold',
        benefits: ['Joy Points on purchase', 'Kids eat free weekends']
      },
      suggestedBy: 'verified_data',
      moderationStatus: 'approved',
      submittedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    },
    {
      id: 'mock_3',
      name: 'Rest Stop Paradise',
      type: 'rest_area',
      coordinates: { lat: 39.8183, lng: -98.5895 },
      address: 'Highway 50 Mile Marker 123',
      joyRating: 4.2,
      shadeScore: raynesWayMode ? 8 : 4,
      accessibilityScore: 7,
      familyFriendly: true,
      joyVerified: false,
      confidence: 'medium',
      features: ['restrooms', 'parking', 'picnic_tables', 'vending'],
      description: 'Clean highway rest stop with covered picnic areas',
      images: [],
      suggestedBy: 'joy_ai',
      moderationStatus: 'pending',
      submittedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Update filters when raynesWayMode changes
    setFilters(prev => ({
      ...prev,
      shadeRequired: raynesWayMode,
      raynesWayMode
    }));
  }, [raynesWayMode]);

  useEffect(() => {
    // Load mock stops initially
    setStops(mockStops);
  }, [raynesWayMode]);

  const initializeMap = async () => {
    if (!mapboxToken.startsWith('pk.')) {
      toast.error('Please enter a valid Mapbox public token (starts with pk.)');
      return;
    }

    setLoading(true);
    try {
      // Initialize Mapbox map
      mappingService.constructor(mapboxToken);
      const map = mappingService.initializeMap(mapContainer.current!, {
        center: initialLocation ? [initialLocation.lng, initialLocation.lat] : [-98.5795, 39.8283],
        zoom: initialLocation ? 12 : 4
      });

      if (map) {
        setShowTokenInput(false);
        await discoverNearbyStops();
        toast.success('Map loaded successfully!');
      }
    } catch (error) {
      console.error('Map initialization error:', error);
      toast.error('Failed to initialize map');
    } finally {
      setLoading(false);
    }
  };

  const discoverNearbyStops = async () => {
    setLoading(true);
    try {
      const location = initialLocation || { lat: 39.8283, lng: -98.5795 };
      const discoveredStops = await joyStopDiscovery.discoverPotentialStops(location);
      
      const allStops = [...mockStops, ...discoveredStops];
      setStops(allStops);
      
      // Add pins to map
      await mappingService.addJoyPinsToMap(allStops, filters);
      
      toast.success(`Discovered ${discoveredStops.length} new Joy stops!`);
    } catch (error) {
      console.error('Stop discovery error:', error);
      toast.error('Failed to discover stops');
    } finally {
      setLoading(false);
    }
  };

  const updateMapFilters = async () => {
    if (stops.length > 0) {
      await mappingService.addJoyPinsToMap(stops, filters);
    }
  };

  useEffect(() => {
    updateMapFilters();
  }, [filters, stops]);

  const handleStopTypeFilter = (type: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      stopTypes: checked 
        ? [...prev.stopTypes, type]
        : prev.stopTypes.filter(t => t !== type)
    }));
  };

  const filteredStops = stops.filter(stop => {
    if (filters.stopTypes.length > 0 && !filters.stopTypes.includes(stop.type)) return false;
    if (filters.joyVerifiedOnly && !stop.joyVerified) return false;
    if (filters.accessibility && stop.accessibilityScore < 7) return false;
    if (filters.shadeRequired && stop.shadeScore < 7) return false;
    if (filters.petFriendly && !stop.features.includes('pet_friendly')) return false;
    return true;
  });

  // Global functions for marker popups
  useEffect(() => {
    (window as any).favoriteStop = (stopId: string) => {
      const stop = stops.find(s => s.id === stopId);
      if (stop) {
        toast.success(`Added ${stop.name} to favorites! 💙`);
        // Here you would save to favorites in Supabase
      }
    };

    (window as any).navigateToStop = (stopId: string) => {
      const stop = stops.find(s => s.id === stopId);
      if (stop) {
        const url = `https://maps.google.com/maps?q=${stop.coordinates.lat},${stop.coordinates.lng}`;
        window.open(url, '_blank');
      }
    };

    return () => {
      delete (window as any).favoriteStop;
      delete (window as any).navigateToStop;
    };
  }, [stops]);

  return (
    <div className="space-y-4">
      {/* Mapbox Token Input */}
      {showTokenInput && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Real-time Mapping Setup</h3>
            </div>
            <p className="text-sm text-amber-700">
              Enter your Mapbox public token to enable real-time mapping and intelligent stop discovery.
              Get your token at <a href="https://mapbox.com" target="_blank" className="underline">mapbox.com</a>
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="pk.your_mapbox_token_here"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={initializeMap} disabled={loading}>
                {loading ? 'Loading...' : 'Connect Map'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Map Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Joy Stop Filters
            {raynesWayMode && (
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                ☀️ Rayne's Way
              </Badge>
            )}
          </h3>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Stop Types */}
            <div>
              <label className="text-sm font-medium mb-2 block">Stop Types</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { type: 'playground', label: '🎪 Playgrounds', icon: '🎪' },
                  { type: 'restaurant', label: '🍽️ Restaurants', icon: '🍽️' },
                  { type: 'rest_area', label: '🚻 Rest Areas', icon: '🚻' },
                  { type: 'hotel', label: '🏨 Hotels', icon: '🏨' },
                  { type: 'campground', label: '🏕️ Campgrounds', icon: '🏕️' },
                  { type: 'sponsor', label: '⭐ Sponsors', icon: '⭐' }
                ].map(({ type, label }) => (
                  <label key={type} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.stopTypes.includes(type)}
                      onChange={(e) => handleStopTypeFilter(type, e.target.checked)}
                      className="rounded"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Quality Filters */}
            <div className="grid grid-cols-1 gap-3">
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Joy Verified Only
                </span>
                <Switch
                  checked={filters.joyVerifiedOnly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, joyVerifiedOnly: checked }))}
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  ♿ Wheelchair Accessible
                </span>
                <Switch
                  checked={filters.accessibility}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, accessibility: checked }))}
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  🐕 Pet Friendly
                </span>
                <Switch
                  checked={filters.petFriendly}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, petFriendly: checked }))}
                />
              </label>

              <label className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  Shade Required (Rayne's Way)
                </span>
                <Switch
                  checked={filters.shadeRequired}
                  onCheckedChange={(checked) => setFilters(prev => ({ ...prev, shadeRequired: checked }))}
                />
              </label>
            </div>
          </div>
        )}
      </Card>

      {/* Map Container */}
      <Card className="relative overflow-hidden">
        <div 
          ref={mapContainer} 
          className="w-full h-[60vh] bg-gradient-to-br from-primary-soft via-accent-soft to-secondary-soft"
        >
          {/* Fallback content when map not loaded */}
          {showTokenInput && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Real-time Joy Map</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your Mapbox token to see live stops and intelligent suggestions
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {filteredStops.slice(0, 3).map((stop, index) => (
                    <div key={stop.id} className="text-center">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white">
                          {stop.type === 'playground' ? '🎪' : 
                           stop.type === 'restaurant' ? '🍽️' : '🚻'}
                        </span>
                      </div>
                      <p className="text-xs font-medium">{stop.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 space-y-2">
          <Button variant="secondary" size="sm" onClick={discoverNearbyStops} disabled={loading}>
            <Zap className="w-4 h-4 mr-1" />
            {loading ? 'Discovering...' : 'Discover Stops'}
          </Button>
        </div>

        {/* Stop Counter */}
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-card text-card-foreground">
            {filteredStops.length} Joy Stops Found
          </Badge>
        </div>
      </Card>

      {/* Stop List */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Navigation className="w-4 h-4" />
          Nearby Joy Stops
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {filteredStops.map(stop => (
            <div key={stop.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white">
                  {stop.type === 'playground' ? '🎪' : 
                   stop.type === 'restaurant' ? '🍽️' : 
                   stop.type === 'hotel' ? '🏨' :
                   stop.type === 'campground' ? '🏕️' : '🚻'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm">{stop.name}</h4>
                  <div className="flex gap-1 flex-shrink-0">
                    {stop.joyVerified && (
                      <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                        Joy ✓
                      </Badge>
                    )}
                    {stop.sponsorInfo && (
                      <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                        Sponsor
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{stop.address}</p>
                <div className="flex items-center gap-3 text-xs">
                  <span>⭐ {stop.joyRating}/5</span>
                  <span>🌳 Shade: {stop.shadeScore}/10</span>
                  <span>♿ Access: {stop.accessibilityScore}/10</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => onStopSelect?.(stop)}>
                    <Heart className="w-3 h-3 mr-1" />
                    Favorite
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const url = `https://maps.google.com/maps?q=${stop.coordinates.lat},${stop.coordinates.lng}`;
                    window.open(url, '_blank');
                  }}>
                    <Navigation className="w-3 h-3 mr-1" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}