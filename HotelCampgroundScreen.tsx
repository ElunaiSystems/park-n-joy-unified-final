import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, Search, Filter, Heart, Star, Tent, Home, Car, 
  Wifi, Dog, Users, DollarSign, MapPin, Phone, Shield, Trees
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'campground' | 'rv_park' | 'motel';
  distance: string;
  rating: number;
  familyRating: number;
  joyVerified: boolean;
  petFriendly: boolean;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  pricePerNight: string;
  description: string;
  amenities: string[];
  rvFeatures?: string[];
  photos: string[];
  address: string;
  phone: string;
  policies: {
    checkIn: string;
    checkOut: string;
    pets: string;
    children: string;
  };
  nearby: string[];
}

const mockAccommodations: Accommodation[] = [
  {
    id: '1',
    name: 'Family Tree Resort',
    type: 'hotel',
    distance: '2.3 miles',
    rating: 5,
    familyRating: 5,
    joyVerified: true,
    petFriendly: true,
    priceRange: '$$$',
    pricePerNight: '$149/night',
    description: 'A family-focused resort with kids club, pool complex, and spacious suites perfect for families.',
    amenities: ['Pool', 'Kids Club', 'Free Breakfast', 'Parking', 'WiFi', 'Playground', 'Family Suites'],
    photos: ['hotel1.jpg', 'hotel2.jpg'],
    address: '123 Family Way, Orlando, FL',
    phone: '(555) 123-4567',
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      pets: 'Welcome! $25/night pet fee',
      children: 'Kids under 12 stay free'
    },
    nearby: ['Disney World (5 min)', 'Restaurants', 'Shopping']
  },
  {
    id: '2',
    name: 'Pine Ridge RV Resort',
    type: 'rv_park',
    distance: '1.8 miles',
    rating: 4,
    familyRating: 5,
    joyVerified: true,
    petFriendly: true,
    priceRange: '$$',
    pricePerNight: '$55/night',
    description: 'Full-service RV resort with spacious sites, modern amenities, and family activities.',
    amenities: ['Full Hookups', 'Pool', 'Playground', 'Laundry', 'Camp Store', 'WiFi', 'Pet Park'],
    rvFeatures: ['50 Amp Service', 'Concrete Pads', 'Picnic Tables', 'Fire Rings', 'Big Rig Friendly'],
    photos: ['rv1.jpg'],
    address: '456 Pine Ridge Dr, Gatlinburg, TN',
    phone: '(555) 987-6543',
    policies: {
      checkIn: '2:00 PM',
      checkOut: '12:00 PM',
      pets: 'Welcome in designated areas',
      children: 'Playground & family activities'
    },
    nearby: ['Great Smoky Mountains', 'Dollywood (10 min)', 'Hiking Trails']
  },
  {
    id: '3',
    name: 'Mountain View Campground',
    type: 'campground',
    distance: '5.2 miles',
    rating: 4,
    familyRating: 4,
    joyVerified: false,
    petFriendly: true,
    priceRange: '$',
    pricePerNight: '$35/night',
    description: 'Rustic camping with mountain views, perfect for families who love the outdoors.',
    amenities: ['Restrooms', 'Showers', 'Fire Pits', 'Picnic Tables', 'Hiking Trails', 'Lake Access'],
    photos: [],
    address: '789 Mountain Trail, Asheville, NC',
    phone: '(555) 456-7890',
    policies: {
      checkIn: '1:00 PM',
      checkOut: '11:00 AM',
      pets: 'Leashed pets welcome',
      children: 'Supervised at all times'
    },
    nearby: ['Lake Activities', 'Hiking', 'Wildlife Viewing']
  },
  {
    id: '4',
    name: 'Budget Family Inn',
    type: 'motel',
    distance: '0.8 miles',
    rating: 3,
    familyRating: 3,
    joyVerified: false,
    petFriendly: false,
    priceRange: '$',
    pricePerNight: '$79/night',
    description: 'Clean and affordable lodging with basic amenities, perfect for budget-conscious families.',
    amenities: ['Free WiFi', 'Parking', 'Continental Breakfast', 'Connecting Rooms', 'Pool'],
    photos: [],
    address: '321 Highway 50, Anywhere, USA',
    phone: '(555) 234-5678',
    policies: {
      checkIn: '3:00 PM',
      checkOut: '11:00 AM',
      pets: 'Not allowed',
      children: 'Under 18 stay free'
    },
    nearby: ['Restaurants', 'Gas Station', 'Shopping']
  },
  {
    id: '5',
    name: 'Overnight RV Parking - Walmart',
    type: 'rv_park',
    distance: '3.1 miles',
    rating: 2,
    familyRating: 2,
    joyVerified: false,
    petFriendly: true,
    priceRange: '$',
    pricePerNight: 'Free',
    description: 'Free overnight parking for self-contained RVs. Basic amenities available in store.',
    amenities: ['Parking', 'Restrooms (in store)', 'Shopping', 'Deli/Restaurant'],
    rvFeatures: ['Level Parking', 'Security Lighting', 'No Hookups', 'Dump Station Nearby'],
    photos: [],
    address: '999 Commerce Dr, Hometown, USA',
    phone: '(555) 345-6789',
    policies: {
      checkIn: 'After 6:00 PM',
      checkOut: 'Before 9:00 AM',
      pets: 'Keep leashed',
      children: 'Supervised parking lot'
    },
    nearby: ['Shopping', 'Fast Food', 'Gas Station']
  }
];

const typeIcons = {
  hotel: Home,
  campground: Trees,
  rv_park: Tent,
  motel: Home
};

const typeLabels = {
  hotel: 'Hotel',
  campground: 'Campground',
  rv_park: 'RV Park',
  motel: 'Motel'
};

export default function HotelCampgroundScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [budgetFilter, setBudgetFilter] = useState<string>('');
  const [familyFriendlyFilter, setFamilyFriendlyFilter] = useState(false);
  const [petFriendlyFilter, setPetFriendlyFilter] = useState(false);
  const [joyVerifiedFilter, setJoyVerifiedFilter] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [expandedAccommodation, setExpandedAccommodation] = useState<string | null>(null);

  const budgetOptions = [
    { value: '', label: 'Any Budget' },
    { value: '$', label: 'Budget ($)' },
    { value: '$$', label: 'Moderate ($$)' },
    { value: '$$$', label: 'Upscale ($$$)' },
    { value: '$$$$', label: 'Luxury ($$$$)' }
  ];

  const filteredAccommodations = mockAccommodations.filter(accommodation => {
    const matchesSearch = accommodation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         accommodation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || accommodation.type === selectedType;
    const matchesBudget = !budgetFilter || accommodation.priceRange === budgetFilter;
    const matchesFamilyFriendly = !familyFriendlyFilter || accommodation.familyRating >= 4;
    const matchesPet = !petFriendlyFilter || accommodation.petFriendly;
    const matchesJoyVerified = !joyVerifiedFilter || accommodation.joyVerified;

    return matchesSearch && matchesType && matchesBudget && matchesFamilyFriendly && matchesPet && matchesJoyVerified;
  });

  const toggleFavorite = (accommodationId: string) => {
    setFavorites(prev => 
      prev.includes(accommodationId) 
        ? prev.filter(id => id !== accommodationId)
        : [...prev, accommodationId]
    );
  };

  const getPriceColor = (priceRange: string) => {
    switch (priceRange) {
      case '$': return 'text-secondary';
      case '$$': return 'text-accent';
      case '$$$': return 'text-primary';
      case '$$$$': return 'text-joy-orange';
      default: return 'text-muted-foreground';
    }
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
            <h1 className="text-lg font-bold text-foreground">Hotels & Camping</h1>
            <p className="text-xs text-muted-foreground">Find family-friendly accommodations</p>
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
            placeholder="Search hotels, campgrounds..." 
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
              <div>
                <label className="text-sm font-medium block mb-2">Budget Range</label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={budgetFilter === option.value ? "joy" : "outline"}
                      size="sm"
                      onClick={() => setBudgetFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  <span className="text-sm">👨‍👩‍👧‍👦 Family-Friendly (4+ stars)</span>
                </div>
                <Switch checked={familyFriendlyFilter} onCheckedChange={setFamilyFriendlyFilter} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Dog className="w-4 h-4 text-primary" />
                  <span className="text-sm">🐕 Pet Friendly</span>
                </div>
                <Switch checked={petFriendlyFilter} onCheckedChange={setPetFriendlyFilter} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
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
            Found {filteredAccommodations.length} accommodations
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/map')}>
            <MapPin className="w-4 h-4 mr-1" />
            Map View
          </Button>
        </div>

        {/* Accommodation Cards */}
        <div className="space-y-3">
          {filteredAccommodations.map((accommodation) => {
            const Icon = typeIcons[accommodation.type];
            const isExpanded = expandedAccommodation === accommodation.id;
            
            return (
              <Card key={accommodation.id} className="card-joy p-4">
                <div className="flex items-start gap-3">
                  {/* Icon & Type */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-base leading-tight">{accommodation.name}</h3>
                        <p className="text-sm text-muted-foreground">{typeLabels[accommodation.type]} • {accommodation.distance}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="text-right">
                          <p className={`font-bold ${getPriceColor(accommodation.priceRange)}`}>
                            {accommodation.pricePerNight}
                          </p>
                          <p className="text-xs text-muted-foreground">{accommodation.priceRange}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleFavorite(accommodation.id)}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(accommodation.id) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Ratings & Badges */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex items-center gap-1">
                        {"⭐".repeat(accommodation.rating)}
                        <span className="text-sm text-muted-foreground">({accommodation.rating}/5)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm">👨‍👩‍👧‍👦</span>
                        <span className="text-sm text-muted-foreground">({accommodation.familyRating}/5)</span>
                      </div>
                      {accommodation.joyVerified && (
                        <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                          ✅ Joy Verified
                        </Badge>
                      )}
                      {accommodation.petFriendly && (
                        <Badge variant="secondary" className="bg-accent-soft text-accent text-xs">
                          🐕 Pet Friendly
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3">{accommodation.description}</p>

                    {/* Amenities Preview */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {accommodation.amenities.slice(0, isExpanded ? accommodation.amenities.length : 4).map((amenity, index) => (
                        <span key={index} className="text-xs bg-secondary-soft text-secondary px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {!isExpanded && accommodation.amenities.length > 4 && (
                        <span className="text-xs text-muted-foreground">+{accommodation.amenities.length - 4} more</span>
                      )}
                    </div>

                    {/* RV Features Preview (if applicable) */}
                    {accommodation.rvFeatures && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {accommodation.rvFeatures.slice(0, isExpanded ? accommodation.rvFeatures.length : 3).map((feature, index) => (
                          <span key={index} className="text-xs bg-primary-soft text-primary px-2 py-1 rounded">
                            🚐 {feature}
                          </span>
                        ))}
                        {!isExpanded && accommodation.rvFeatures.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{accommodation.rvFeatures.length - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="joy-soft" 
                        size="sm"
                        onClick={() => setExpandedAccommodation(isExpanded ? null : accommodation.id)}
                      >
                        {isExpanded ? 'Less Info' : 'More Info'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="adventure-soft" size="sm">
                        Book Now
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        <div>
                          <h4 className="font-medium text-sm mb-2">Contact & Address</h4>
                          <div className="text-sm space-y-1">
                            <p className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              {accommodation.address}
                            </p>
                            <p className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              {accommodation.phone}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Policies</h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>Check-in: <span className="font-medium">{accommodation.policies.checkIn}</span></div>
                            <div>Check-out: <span className="font-medium">{accommodation.policies.checkOut}</span></div>
                            <div>Pets: <span className="font-medium">{accommodation.policies.pets}</span></div>
                            <div>Children: <span className="font-medium">{accommodation.policies.children}</span></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-2">Nearby Attractions</h4>
                          <div className="flex flex-wrap gap-1">
                            {accommodation.nearby.map((attraction, index) => (
                              <span key={index} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                                {attraction}
                              </span>
                            ))}
                          </div>
                        </div>

                        {accommodation.rvFeatures && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">RV Features</h4>
                            <div className="flex flex-wrap gap-1">
                              {accommodation.rvFeatures.map((feature, index) => (
                                <span key={index} className="text-xs bg-primary-soft text-primary px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredAccommodations.length === 0 && (
          <Card className="card-joy p-8 text-center">
            <Home className="w-12 h-12 icon-muted mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No accommodations found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search or filters to find more options.
            </p>
            <Button variant="joy-soft" onClick={() => {
              setSearchQuery('');
              setSelectedType(null);
              setBudgetFilter('');
              setFamilyFriendlyFilter(false);
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