// Real-time Mapping and Intelligent Stop Discovery Service
import mapboxgl from 'mapbox-gl';

export interface JoyStop {
  id: string;
  name: string;
  type: 'playground' | 'restaurant' | 'rest_area' | 'hotel' | 'campground' | 'sponsor';
  coordinates: { lat: number; lng: number };
  address: string;
  joyRating: number;
  shadeScore: number;
  accessibilityScore: number;
  familyFriendly: boolean;
  joyVerified: boolean;
  confidence: 'high' | 'medium' | 'low';
  features: string[];
  description: string;
  images: string[];
  affiliateLink?: string;
  sponsorInfo?: {
    id: string;
    verificationLevel: 'gold' | 'silver' | 'bronze' | 'platinum';
    benefits: string[];
  };
  suggestedBy: 'joy_ai' | 'community' | 'verified_data';
  moderationStatus: 'approved' | 'pending' | 'rejected';
  submittedAt: string;
  approvedAt?: string;
}

export interface MapFilters {
  stopTypes: string[];
  accessibility: boolean;
  petFriendly: boolean;
  shadeRequired: boolean;
  joyVerifiedOnly: boolean;
  raynesWayMode: boolean;
  priceRange?: { min: number; max: number };
}

export class MappingService {
  private mapboxToken: string;
  private map: mapboxgl.Map | null = null;
  private markers: mapboxgl.Marker[] = [];

  constructor(mapboxToken?: string) {
    this.mapboxToken = mapboxToken || 'pk.your_mapbox_token_here';
    if (mapboxToken) {
      mapboxgl.accessToken = this.mapboxToken;
    }
  }

  initializeMap(container: string | HTMLElement, options?: Partial<mapboxgl.MapboxOptions>) {
    if (!this.mapboxToken.startsWith('pk.')) {
      console.warn('Mapbox token not configured - using mock map');
      return null;
    }

    this.map = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 4,
      ...options
    } as mapboxgl.MapboxOptions);

    // Add navigation controls
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    return this.map;
  }

  async addJoyPinsToMap(stops: JoyStop[], filters: MapFilters) {
    if (!this.map) return;

    // Clear existing markers
    this.clearMarkers();

    const filteredStops = this.filterStops(stops, filters);

    filteredStops.forEach(stop => {
      const marker = this.createJoyMarker(stop);
      marker.addTo(this.map!);
      this.markers.push(marker);
    });

    // Fit map to show all markers
    if (filteredStops.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredStops.forEach(stop => {
        bounds.extend([stop.coordinates.lng, stop.coordinates.lat]);
      });
      this.map.fitBounds(bounds, { padding: 50 });
    }
  }

  private createJoyMarker(stop: JoyStop): mapboxgl.Marker {
    const markerElement = document.createElement('div');
    markerElement.className = 'joy-map-marker';
    markerElement.innerHTML = this.getMarkerIcon(stop);
    
    // Add click handler for marker
    markerElement.addEventListener('click', () => {
      this.showStopPopup(stop);
    });

    return new mapboxgl.Marker(markerElement)
      .setLngLat([stop.coordinates.lng, stop.coordinates.lat]);
  }

  private getMarkerIcon(stop: JoyStop): string {
    const icons = {
      playground: '🎪',
      restaurant: '🍽️',
      rest_area: '🚻',
      hotel: '🏨',
      campground: '🏕️',
      sponsor: '⭐'
    };

    const bgColor = stop.joyVerified ? '#10B981' : '#F59E0B'; // green for verified, amber for pending
    const icon = icons[stop.type] || '📍';

    return `
      <div style="
        background: ${bgColor};
        border: 2px solid white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        transform: scale(1);
        transition: transform 0.2s;
      " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
        ${icon}
      </div>
    `;
  }

  private showStopPopup(stop: JoyStop) {
    if (!this.map) return;

    const popup = new mapboxgl.Popup({ offset: 25 })
      .setLngLat([stop.coordinates.lng, stop.coordinates.lat])
      .setHTML(this.createPopupContent(stop))
      .addTo(this.map);
  }

  private createPopupContent(stop: JoyStop): string {
    const verifiedBadge = stop.joyVerified 
      ? '<span style="background: #10B981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Joy Verified</span>'
      : '<span style="background: #F59E0B; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Suggested</span>';

    return `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${stop.name}</h3>
        <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">${stop.address}</p>
        <div style="margin-bottom: 8px;">
          ${verifiedBadge}
          <span style="margin-left: 8px;">⭐ ${stop.joyRating}/5</span>
        </div>
        <div style="margin-bottom: 8px; font-size: 12px;">
          <span style="margin-right: 12px;">🌳 Shade: ${stop.shadeScore}/10</span>
          <span>♿ Access: ${stop.accessibilityScore}/10</span>
        </div>
        <p style="margin: 8px 0; font-size: 12px; color: #666;">${stop.description}</p>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button onclick="window.favoriteStop('${stop.id}')" style="
            background: #3B82F6; color: white; border: none; padding: 4px 8px; 
            border-radius: 4px; font-size: 11px; cursor: pointer;
          ">💙 Favorite</button>
          <button onclick="window.navigateToStop('${stop.id}')" style="
            background: #10B981; color: white; border: none; padding: 4px 8px; 
            border-radius: 4px; font-size: 11px; cursor: pointer;
          ">🧭 Navigate</button>
        </div>
      </div>
    `;
  }

  private filterStops(stops: JoyStop[], filters: MapFilters): JoyStop[] {
    return stops.filter(stop => {
      // Stop type filter
      if (filters.stopTypes.length > 0 && !filters.stopTypes.includes(stop.type)) {
        return false;
      }

      // Joy Verified filter
      if (filters.joyVerifiedOnly && !stop.joyVerified) {
        return false;
      }

      // Accessibility filter
      if (filters.accessibility && stop.accessibilityScore < 7) {
        return false;
      }

      // Shade requirement (Rayne's Way)
      if (filters.shadeRequired && stop.shadeScore < 7) {
        return false;
      }

      // Pet friendly filter
      if (filters.petFriendly && !stop.features.includes('pet_friendly')) {
        return false;
      }

      return true;
    });
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.remove());
    this.markers = [];
  }

  destroy() {
    this.clearMarkers();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

// Joy AI Stop Discovery Service
export class JoyStopDiscoveryService {
  async discoverPotentialStops(location: { lat: number; lng: number }, radius: number = 5000): Promise<JoyStop[]> {
    // This would integrate with Google Places API, OpenStreetMap Overpass API, etc.
    const discoveredStops: JoyStop[] = [];

    try {
      // Mock implementation - replace with real API calls
      const mockDiscoveredStops = await this.mockPlacesSearch(location, radius);
      
      for (const place of mockDiscoveredStops) {
        const joyStop = await this.analyzeStopPotential(place);
        if (joyStop.confidence !== 'low') {
          discoveredStops.push(joyStop);
        }
      }

      return discoveredStops;
    } catch (error) {
      console.error('Stop discovery error:', error);
      return [];
    }
  }

  private async mockPlacesSearch(location: { lat: number; lng: number }, radius: number) {
    // Mock data - replace with real Google Places or OpenStreetMap API
    return [
      {
        name: 'Sunny Playground',
        types: ['playground', 'park'],
        coordinates: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
        rating: 4.2,
        reviews: [
          { text: 'Great for kids, lots of shade', rating: 5 },
          { text: 'Clean restrooms and parking', rating: 4 }
        ],
        photos: [],
        address: '123 Family Park Dr'
      },
      {
        name: 'McDonald\'s Family Restaurant',
        types: ['restaurant', 'fast_food'],
        coordinates: { lat: location.lat - 0.005, lng: location.lng + 0.008 },
        rating: 3.8,
        reviews: [
          { text: 'Has playground and clean bathrooms', rating: 4 },
          { text: 'Family-friendly with high chairs', rating: 4 }
        ],
        photos: [],
        address: '456 Main Street'
      }
    ];
  }

  private async analyzeStopPotential(place: any): Promise<JoyStop> {
    // Joy AI analysis logic
    const confidence = this.calculateConfidence(place);
    const joyRating = this.calculateJoyRating(place);
    const shadeScore = this.calculateShadeScore(place);
    const accessibilityScore = this.calculateAccessibilityScore(place);

    const stop: JoyStop = {
      id: `discovered_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: place.name,
      type: this.determineStopType(place.types),
      coordinates: place.coordinates,
      address: place.address,
      joyRating,
      shadeScore,
      accessibilityScore,
      familyFriendly: this.isFamilyFriendly(place),
      joyVerified: confidence === 'high',
      confidence,
      features: this.extractFeatures(place),
      description: this.generateDescription(place),
      images: place.photos || [],
      suggestedBy: 'joy_ai',
      moderationStatus: confidence === 'high' ? 'approved' : 'pending',
      submittedAt: new Date().toISOString()
    };

    return stop;
  }

  private calculateConfidence(place: any): 'high' | 'medium' | 'low' {
    let score = 0;

    // Rating-based confidence
    if (place.rating >= 4.5) score += 3;
    else if (place.rating >= 4.0) score += 2;
    else if (place.rating >= 3.5) score += 1;

    // Review analysis
    const familyKeywords = ['family', 'kids', 'children', 'playground', 'clean', 'bathroom', 'parking'];
    const positiveReviews = place.reviews?.filter((review: any) => 
      familyKeywords.some(keyword => review.text.toLowerCase().includes(keyword))
    ).length || 0;

    if (positiveReviews >= 2) score += 2;
    else if (positiveReviews >= 1) score += 1;

    // Type-based confidence
    if (['playground', 'park', 'family_restaurant'].some(type => place.types.includes(type))) {
      score += 2;
    }

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  private calculateJoyRating(place: any): number {
    let rating = place.rating || 3;
    
    // Boost for family-friendly indicators
    const familyIndicators = place.reviews?.filter((review: any) => 
      review.text.toLowerCase().includes('family') || 
      review.text.toLowerCase().includes('kids')
    ).length || 0;

    if (familyIndicators > 0) rating += 0.5;
    
    return Math.min(5, Math.round(rating * 10) / 10);
  }

  private calculateShadeScore(place: any): number {
    // Analyze for shade indicators in reviews and type
    let score = 5; // Default moderate shade

    const shadeKeywords = ['shade', 'shaded', 'covered', 'indoor', 'tree', 'trees'];
    const sunKeywords = ['sunny', 'hot', 'no shade', 'open'];

    place.reviews?.forEach((review: any) => {
      const text = review.text.toLowerCase();
      if (shadeKeywords.some(keyword => text.includes(keyword))) {
        score += 1;
      }
      if (sunKeywords.some(keyword => text.includes(keyword))) {
        score -= 1;
      }
    });

    // Indoor places get higher shade scores
    if (place.types.includes('restaurant') || place.types.includes('indoor')) {
      score += 3;
    }

    return Math.max(1, Math.min(10, score));
  }

  private calculateAccessibilityScore(place: any): number {
    let score = 5; // Default moderate accessibility

    const accessKeywords = ['wheelchair', 'accessible', 'ramp', 'elevator', 'ada'];
    const reviews = place.reviews || [];

    reviews.forEach((review: any) => {
      if (accessKeywords.some(keyword => review.text.toLowerCase().includes(keyword))) {
        score += 2;
      }
    });

    return Math.max(1, Math.min(10, score));
  }

  private determineStopType(types: string[]): JoyStop['type'] {
    if (types.includes('playground') || types.includes('park')) return 'playground';
    if (types.includes('restaurant') || types.includes('food')) return 'restaurant';
    if (types.includes('lodging') || types.includes('hotel')) return 'hotel';
    if (types.includes('campground') || types.includes('rv_park')) return 'campground';
    return 'rest_area';
  }

  private isFamilyFriendly(place: any): boolean {
    const familyKeywords = ['family', 'kids', 'children', 'playground'];
    return place.reviews?.some((review: any) => 
      familyKeywords.some(keyword => review.text.toLowerCase().includes(keyword))
    ) || false;
  }

  private extractFeatures(place: any): string[] {
    const features: string[] = [];
    const text = place.reviews?.map((r: any) => r.text).join(' ').toLowerCase() || '';

    if (text.includes('parking')) features.push('parking');
    if (text.includes('bathroom') || text.includes('restroom')) features.push('restrooms');
    if (text.includes('playground')) features.push('playground');
    if (text.includes('wifi')) features.push('wifi');
    if (text.includes('pet') || text.includes('dog')) features.push('pet_friendly');
    if (text.includes('wheelchair') || text.includes('accessible')) features.push('wheelchair_accessible');

    return features;
  }

  private generateDescription(place: any): string {
    const positiveReviews = place.reviews?.filter((r: any) => r.rating >= 4) || [];
    if (positiveReviews.length > 0) {
      return positiveReviews[0].text.substring(0, 100) + '...';
    }
    return `${place.types[0]} with ${place.rating} star rating`;
  }
}

// Auto-seeding service for pre-existing datasets
export class AutoSeedingService {
  async seedFromOpenStreetMap(bounds: { north: number; south: number; east: number; west: number }) {
    // OpenStreetMap Overpass API integration
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"~"^(playground|restaurant|fast_food|fuel|toilets)$"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        way["amenity"~"^(playground|restaurant|fast_food|fuel|toilets)$"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        relation["amenity"~"^(playground|restaurant|fast_food|fuel|toilets)$"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      );
      out center;
    `;

    try {
      // Mock response - replace with actual Overpass API call
      return this.mockOSMResponse();
    } catch (error) {
      console.error('OSM seeding error:', error);
      return [];
    }
  }

  private mockOSMResponse(): JoyStop[] {
    return [
      {
        id: 'osm_playground_1',
        name: 'Sunset Park Playground',
        type: 'playground',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        address: '789 Park Avenue',
        joyRating: 4.0,
        shadeScore: 7,
        accessibilityScore: 6,
        familyFriendly: true,
        joyVerified: false,
        confidence: 'medium',
        features: ['playground', 'restrooms', 'parking'],
        description: 'Community playground with modern equipment',
        images: [],
        suggestedBy: 'verified_data',
        moderationStatus: 'pending',
        submittedAt: new Date().toISOString()
      }
    ];
  }

  async seedFromCityDatasets(city: string) {
    // Integration with city open data APIs
    // Examples: NYC Open Data, Chicago Data Portal, etc.
    return this.mockCityDataResponse(city);
  }

  private mockCityDataResponse(city: string): JoyStop[] {
    return [
      {
        id: `city_${city}_park_1`,
        name: `${city} Central Park`,
        type: 'playground',
        coordinates: { lat: 40.7829, lng: -73.9654 },
        address: `Central Park, ${city}`,
        joyRating: 4.5,
        shadeScore: 8,
        accessibilityScore: 9,
        familyFriendly: true,
        joyVerified: true,
        confidence: 'high',
        features: ['playground', 'restrooms', 'wheelchair_accessible', 'parking'],
        description: 'Official city park with certified accessibility features',
        images: [],
        suggestedBy: 'verified_data',
        moderationStatus: 'approved',
        submittedAt: new Date().toISOString(),
        approvedAt: new Date().toISOString()
      }
    ];
  }
}

// Export service instances
export const mappingService = new MappingService();
export const joyStopDiscovery = new JoyStopDiscoveryService();
export const autoSeedingService = new AutoSeedingService();