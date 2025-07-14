import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, Search, Filter, Heart, Star, Dog, Car, 
  Trees, Utensils, Coffee, Fuel, Tent, Home, Baby, ArrowLeft, Sun, Shield,
  Phone, Globe, Wifi, ShoppingCart, TreePine, Camera, Users, Clock, DollarSign, Sparkles
} from "lucide-react";
import { realDataService, affiliateService, joyPointsService } from '../services/realDataService';
import { joyPointsBackend } from '../services/joyPointsBackend';
import { useNavigate } from "react-router-dom";

interface JoyStop {
  id: string;
  name: string;
  type: 'playground' | 'restaurant' | 'restroom' | 'parking' | 'rv_park' | 'campground' | 'gas_station';
  distance: string;
  rating: number;
  joyVerified: boolean;
  shadeScore: number;
  wheelchairAccessible: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  description: string;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  photos: string[];
  price?: string;
}

const mockStops: JoyStop[] = [
  {
    id: '1',
    name: 'Sunshine Adventure Playground',
    type: 'playground',
    distance: '0.3 miles',
    rating: 5,
    joyVerified: true,
    shadeScore: 4,
    wheelchairAccessible: true,
    petFriendly: false,
    familyFriendly: true,
    description: 'A magical playground with covered play areas and accessible equipment for all abilities.',
    amenities: ['Covered Pavilion', 'Accessible Swings', 'Sensory Garden', 'Clean Restrooms'],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    photos: ['playground1.jpg', 'playground2.jpg']
  },
  {
    id: '2',
    name: 'Family Tree Café',
    type: 'restaurant',
    distance: '0.8 miles',
    rating: 4,
    joyVerified: true,
    shadeScore: 5,
    wheelchairAccessible: true,
    petFriendly: true,
    familyFriendly: true,
    description: 'Kid-friendly restaurant with shaded outdoor seating and allergy-conscious menu.',
    amenities: ['Kids Menu', 'High Chairs', 'Changing Table', 'Pet Patio'],
    coordinates: { lat: 40.7580, lng: -73.9855 },
    photos: ['restaurant1.jpg'],
    price: '$$'
  },
  {
    id: '3',
    name: 'Shady Oaks Rest Area',
    type: 'restroom',
    distance: '1.2 miles',
    rating: 4,
    joyVerified: false,
    shadeScore: 5,
    wheelchairAccessible: true,
    petFriendly: true,
    familyFriendly: true,
    description: 'Clean rest area with plenty of tree cover and picnic tables.',
    amenities: ['Clean Restrooms', 'Picnic Tables', 'Dog Area', 'Vending Machines'],
    coordinates: { lat: 40.7831, lng: -73.9712 },
    photos: []
  },
  {
    id: '4',
    name: 'EV Charging Station - WalMart',
    type: 'parking',
    distance: '2.1 miles',
    rating: 3,
    joyVerified: false,
    shadeScore: 2,
    wheelchairAccessible: true,
    petFriendly: false,
    familyFriendly: true,
    description: 'Fast EV charging with shopping and dining nearby.',
    amenities: ['Fast Charging', 'Shopping Center', 'Food Court', 'Restrooms'],
    coordinates: { lat: 40.7282, lng: -74.0776 },
    photos: []
  },
  {
    id: '5',
    name: 'Pine Ridge RV Resort',
    type: 'rv_park',
    distance: '5.4 miles',
    rating: 5,
    joyVerified: true,
    shadeScore: 4,
    wheelchairAccessible: true,
    petFriendly: true,
    familyFriendly: true,
    description: 'Family-friendly RV resort with full hookups and activities.',
    amenities: ['Full Hookups', 'Pool', 'Playground', 'Pet Park', 'WiFi'],
    coordinates: { lat: 40.6892, lng: -74.0445 },
    photos: ['rv1.jpg', 'rv2.jpg'],
    price: '$45/night'
  }
];

const typeIcons = {
  playground: Baby,
  restaurant: Utensils,
  restroom: Home,
  parking: Car,
  rv_park: Tent,
  campground: Trees,
  gas_station: Fuel
};

const typeLabels = {
  playground: 'Playground',
  restaurant: 'Restaurant',
  restroom: 'Rest Stop',
  parking: 'Parking/EV',
  rv_park: 'RV Park',
  campground: 'Campground',
  gas_station: 'Gas Station'
};

export default function FindStopsScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [raynesWayFilter, setRaynesWayFilter] = useState(false);
  const [wheelchairFilter, setWheelchairFilter] = useState(false);
  const [petFriendlyFilter, setPetFriendlyFilter] = useState(false);
  const [joyVerifiedFilter, setJoyVerifiedFilter] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedStop, setExpandedStop] = useState<string | null>(null);
  const [stops, setStops] = useState<JoyStop[]>([]);
  const [loading, setLoading] = useState(false);

  // Load real data on component mount
  useEffect(() => {
    const loadRealData = async () => {
      setLoading(true);
      try {
        const location = 'Orlando, FL'; // Default location, could be from GPS
        const filters = {
          category: selectedType || undefined,
          rvFriendly: wheelchairFilter,
          petFriendly: petFriendlyFilter,
          checkIn: new Date().toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        };
        
        const data = await realDataService.searchAllStops(location, filters);
        
        // Convert real data to JoyStop format
        const realStops: JoyStop[] = [
          ...data.hotels.map((hotel: any): JoyStop => ({
            id: hotel.id,
            name: hotel.name,
            type: 'restaurant', // Hotels can have restaurants
            distance: `${(Math.random() * 10).toFixed(1)} miles`,
            rating: hotel.rating,
            joyVerified: hotel.joyVerified,
            shadeScore: 4.2,
            wheelchairAccessible: hotel.amenities.includes('ada'),
            petFriendly: hotel.petFriendly,
            familyFriendly: hotel.familyFriendly || true,
            description: hotel.description,
            amenities: hotel.amenities,
            coordinates: hotel.coordinates || { lat: 28.5383, lng: -81.3792 },
            photos: hotel.images || ['/placeholder.svg'],
            price: `$${hotel.price}`
          })),
          ...data.campgrounds.map((camp: any): JoyStop => ({
            id: camp.id,
            name: camp.name,
            type: 'campground',
            distance: `${(Math.random() * 15).toFixed(1)} miles`,
            rating: camp.rating,
            joyVerified: camp.joyVerified,
            shadeScore: camp.features?.shadeScore || 4.0,
            wheelchairAccessible: camp.amenities.includes('ada'),
            petFriendly: camp.features?.petFriendly || false,
            familyFriendly: camp.features?.familyActivities || true,
            description: `${camp.rvSites} RV sites, ${camp.tentSites} tent sites. ${camp.description || ''}`,
            amenities: camp.amenities,
            coordinates: camp.coordinates || { lat: 28.2639, lng: -81.4073 },
            photos: camp.images || ['/placeholder.svg'],
            price: `$${camp.priceRange?.min}/night`
          })),
          ...data.sponsors.map((sponsor: any): JoyStop => ({
            id: sponsor.id,
            name: sponsor.name,
            type: 'restaurant',
            distance: `${(Math.random() * 5).toFixed(1)} miles`,
            rating: 4.5,
            joyVerified: sponsor.joyVerified,
            shadeScore: 4.0,
            wheelchairAccessible: true,
            petFriendly: sponsor.benefits?.petFriendly || false,
            familyFriendly: true,
            description: `Joy-Verified ${sponsor.category} with family benefits. Earn ${sponsor.benefits?.joyPoints || 25} Joy Points!`,
            amenities: ['Family Dining', 'Kids Menu', 'Joy Points', 'Clean Restrooms'],
            coordinates: { lat: 28.5383 + Math.random() * 0.1, lng: -81.3792 + Math.random() * 0.1 },
            photos: ['/placeholder.svg'],
            price: '$$'
          }))
        ];
        
        // Add some mock playground and rest stop data to fill out the experience
        const mockPlaygrounds: JoyStop[] = [
          {
            id: 'playground_1',
            name: 'Sunshine Adventure Playground',
            type: 'playground',
            distance: '0.3 miles',
            rating: 5,
            joyVerified: true,
            shadeScore: 4,
            wheelchairAccessible: true,
            petFriendly: false,
            familyFriendly: true,
            description: 'A magical playground with covered play areas and accessible equipment for all abilities.',
            amenities: ['Covered Pavilion', 'Accessible Swings', 'Sensory Garden', 'Clean Restrooms'],
            coordinates: { lat: 28.5383, lng: -81.3792 },
            photos: ['/placeholder.svg']
          }
        ];

        setStops([...realStops, ...mockPlaygrounds]);
      } catch (error) {
        console.error('Error loading real data:', error);
        // Fallback to mock data
        setStops(mockStops);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, [selectedType, wheelchairFilter, petFriendlyFilter, joyVerifiedFilter]);

  const filteredStops = stops.filter(stop => {
    const matchesSearch = stop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stop.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || stop.type === selectedType;
    const matchesShade = !raynesWayFilter || stop.shadeScore >= 4;
    const matchesWheelchair = !wheelchairFilter || stop.wheelchairAccessible;
    const matchesPet = !petFriendlyFilter || stop.petFriendly;
    const matchesJoyVerified = !joyVerifiedFilter || stop.joyVerified;

    return matchesSearch && matchesType && matchesShade && matchesWheelchair && matchesPet && matchesJoyVerified;
  });

  const handleAffiliateClick = async (stop: JoyStop) => {
    try {
      // Award points for visiting Joy-Verified locations
      if (stop.joyVerified) {
        await joyPointsBackend.awardPoints(
          'user_123', // Would get from auth context
          'sponsor_visit',
          { stopId: stop.id, stopName: stop.name }
        );
      }
    } catch (error) {
      console.error('Error awarding points:', error);
    }
  };

  const toggleFavorite = (stopId: string) => {
    setFavorites(prev => 
      prev.includes(stopId) 
        ? prev.filter(id => id !== stopId)
        : [...prev, stopId]
    );
  };

  const getShadeIcon = (score: number) => {
    if (score >= 4) return '🌳';
    if (score >= 2) return '⛅';
    return '☀️';
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
            <h1 className="text-lg font-bold text-foreground">Find Joy Stops</h1>
            <p className="text-xs text-muted-foreground">Discover family-friendly destinations</p>
          </div>
          <Button 
            variant={showFilters ? "joy" : "joy-soft"} 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search stops, amenities..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            variant={selectedType === null ? "joy" : "outline"} 
            size="sm"
            onClick={() => setSelectedType(null)}
          >
            All Types
          </Button>
          {Object.entries(typeLabels).map(([type, label]) => {
            const Icon = typeIcons[type as keyof typeof typeIcons];
            return (
              <Button 
                key={type}
                variant={selectedType === type ? "joy" : "outline"} 
                size="sm"
                onClick={() => setSelectedType(type)}
                className="whitespace-nowrap"
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Button>
            );
          })}
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* Advanced Filters */}
        {showFilters && (
          <Card className="card-joy p-4">
            <h3 className="font-semibold mb-3">Filter Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4 text-primary" />
                  <span className="text-sm">☀️ Rayne's Way (Shade Priority)</span>
                </div>
                <Switch checked={raynesWayFilter} onCheckedChange={setRaynesWayFilter} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 text-secondary">♿</span>
                  <span className="text-sm">♿ Wheelchair Accessible</span>
                </div>
                <Switch checked={wheelchairFilter} onCheckedChange={setWheelchairFilter} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-accent" />
                  <span className="text-sm">🐕 Pet Friendly</span>
                </div>
                <Switch checked={petFriendlyFilter} onCheckedChange={setPetFriendlyFilter} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-joy-orange" />
                  <span className="text-sm">✅ Joy Verified Only</span>
                </div>
                <Switch checked={joyVerifiedFilter} onCheckedChange={setJoyVerifiedFilter} />
              </div>
            </div>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {filteredStops.length} stops {selectedType && `• ${typeLabels[selectedType as keyof typeof typeLabels]}`}
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/map')}>
            <MapPin className="w-4 h-4 mr-1" />
            Map View
          </Button>
        </div>

        {/* Stop Cards */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-joy p-4">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredStops.map((stop) => {
            const Icon = typeIcons[stop.type];
            const isExpanded = expandedStop === stop.id;
            
            return (
              <Card key={stop.id} className="card-joy p-4">
                <div className="flex items-start gap-3">
                  {/* Icon & Type */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base leading-tight">{stop.name}</h3>
                        <p className="text-sm text-muted-foreground">{typeLabels[stop.type]} • {stop.distance}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleFavorite(stop.id)}
                        className="flex-shrink-0 ml-2"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(stop.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                    </div>

                    {/* Rating & Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {"⭐".repeat(stop.rating)}
                        <span className="text-sm text-muted-foreground">({stop.rating}/5)</span>
                      </div>
                      {stop.joyVerified && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                          ✅ Joy Verified
                        </Badge>
                      )}
                      <Badge variant="secondary" className="bg-secondary-soft text-secondary text-xs">
                        {getShadeIcon(stop.shadeScore)} Shade {stop.shadeScore}/5
                      </Badge>
                      {stop.price && (
                        <Badge variant="outline" className="text-xs">
                          {stop.price}
                        </Badge>
                      )}
                    </div>

                    {/* Accessibility Icons */}
                    <div className="flex items-center gap-3 mb-3">
                      {stop.wheelchairAccessible && <span className="text-secondary">♿</span>}
                      {stop.petFriendly && <Dog className="w-4 h-4 text-accent" />}
                      {stop.familyFriendly && <Baby className="w-4 h-4 text-joy-orange" />}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">{stop.description}</p>

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {stop.amenities.slice(0, isExpanded ? stop.amenities.length : 3).map((amenity, index) => (
                        <span key={index} className="text-xs bg-accent-soft text-accent px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {!isExpanded && stop.amenities.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{stop.amenities.length - 3} more</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="joy-soft" 
                        size="sm"
                        onClick={() => setExpandedStop(isExpanded ? null : stop.id)}
                      >
                        {isExpanded ? 'Less Info' : 'More Info'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="w-3 h-3 mr-1" />
                        Directions
                      </Button>
                      <Button 
                        variant="adventure-soft" 
                        size="sm"
                        onClick={() => handleAffiliateClick(stop)}
                      >
                        {stop.joyVerified ? `Earn ${25} Points` : 'Add to Trip'}
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">All Amenities</h4>
                          <div className="flex flex-wrap gap-1">
                            {stop.amenities.map((amenity, index) => (
                              <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-sm mb-2">Details</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Distance: <span className="font-medium">{stop.distance}</span></div>
                            <div>Shade Score: <span className="font-medium">{stop.shadeScore}/5</span></div>
                            <div>Wheelchair: <span className="font-medium">{stop.wheelchairAccessible ? 'Yes' : 'No'}</span></div>
                            <div>Pet Friendly: <span className="font-medium">{stop.petFriendly ? 'Yes' : 'No'}</span></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
            })}
          </div>
        )}

        {filteredStops.length === 0 && (
          <Card className="card-joy p-8 text-center">
            <MapPin className="w-12 h-12 icon-muted mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No stops found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters to find more options.
            </p>
            <Button variant="joy-soft" onClick={() => {
              setSearchQuery('');
              setSelectedType(null);
              setRaynesWayFilter(false);
              setWheelchairFilter(false);
              setPetFriendlyFilter(false);
              setJoyVerifiedFilter(false);
            }}>
              Clear All Filters
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}