export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          family_name: string | null;
          family_members: FamilyMember[] | null;
          vehicle_type: string | null;
          accessibility_needs: string[] | null;
          preferred_stop_types: string[] | null;
          joy_voice_preference: string | null;
          joy_tone: string | null;
          joy_animation_style: string | null;
          kids_in_car_default: boolean;
          rayne_way_default: boolean;
          emergency_contacts: EmergencyContact[] | null;
          sun_sensitivity_level: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          family_name?: string | null;
          family_members?: FamilyMember[] | null;
          vehicle_type?: string | null;
          accessibility_needs?: string[] | null;
          preferred_stop_types?: string[] | null;
          joy_voice_preference?: string | null;
          joy_tone?: string | null;
          joy_animation_style?: string | null;
          kids_in_car_default?: boolean;
          rayne_way_default?: boolean;
          emergency_contacts?: EmergencyContact[] | null;
          sun_sensitivity_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          family_name?: string | null;
          family_members?: FamilyMember[] | null;
          vehicle_type?: string | null;
          accessibility_needs?: string[] | null;
          preferred_stop_types?: string[] | null;
          joy_voice_preference?: string | null;
          joy_tone?: string | null;
          joy_animation_style?: string | null;
          kids_in_car_default?: boolean;
          rayne_way_default?: boolean;
          emergency_contacts?: EmergencyContact[] | null;
          sun_sensitivity_level?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      joy_stops: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          latitude: number;
          longitude: number;
          address: string;
          category: string;
          tags: string[] | null;
          joy_score: number;
          shade_score: number;
          safety_score: number;
          family_friendly_score: number;
          accessibility_features: string[] | null;
          amenities: string[] | null;
          photos: string[] | null;
          verified_by_joy: boolean;
          rayne_way_approved: boolean;
          status: 'pending' | 'approved' | 'rejected';
          contributed_by: string | null;
          admin_notes: string | null;
          operating_hours: OperatingHours | null;
          contact_info: ContactInfo | null;
          pricing_info: PricingInfo | null;
          weather_dependent: boolean;
          indoor_outdoor: 'indoor' | 'outdoor' | 'both';
          age_recommendations: AgeRange[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          latitude: number;
          longitude: number;
          address: string;
          category: string;
          tags?: string[] | null;
          joy_score?: number;
          shade_score?: number;
          safety_score?: number;
          family_friendly_score?: number;
          accessibility_features?: string[] | null;
          amenities?: string[] | null;
          photos?: string[] | null;
          verified_by_joy?: boolean;
          rayne_way_approved?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          contributed_by?: string | null;
          admin_notes?: string | null;
          operating_hours?: OperatingHours | null;
          contact_info?: ContactInfo | null;
          pricing_info?: PricingInfo | null;
          weather_dependent?: boolean;
          indoor_outdoor?: 'indoor' | 'outdoor' | 'both';
          age_recommendations?: AgeRange[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          latitude?: number;
          longitude?: number;
          address?: string;
          category?: string;
          tags?: string[] | null;
          joy_score?: number;
          shade_score?: number;
          safety_score?: number;
          family_friendly_score?: number;
          accessibility_features?: string[] | null;
          amenities?: string[] | null;
          photos?: string[] | null;
          verified_by_joy?: boolean;
          rayne_way_approved?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          contributed_by?: string | null;
          admin_notes?: string | null;
          operating_hours?: OperatingHours | null;
          contact_info?: ContactInfo | null;
          pricing_info?: PricingInfo | null;
          weather_dependent?: boolean;
          indoor_outdoor?: 'indoor' | 'outdoor' | 'both';
          age_recommendations?: AgeRange[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          trip_name: string;
          origin: LocationPoint;
          destination: LocationPoint;
          waypoints: LocationPoint[] | null;
          planned_stops: string[] | null;
          rayne_way_enabled: boolean;
          kids_in_car_mode: boolean;
          filters_applied: TripFilters | null;
          route_data: RouteData | null;
          estimated_duration: number | null;
          estimated_distance: number | null;
          weather_forecast: WeatherData[] | null;
          joy_suggestions: JoySuggestion[] | null;
          trip_status: 'planning' | 'active' | 'completed' | 'cancelled';
          started_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          trip_name: string;
          origin: LocationPoint;
          destination: LocationPoint;
          waypoints?: LocationPoint[] | null;
          planned_stops?: string[] | null;
          rayne_way_enabled?: boolean;
          kids_in_car_mode?: boolean;
          filters_applied?: TripFilters | null;
          route_data?: RouteData | null;
          estimated_duration?: number | null;
          estimated_distance?: number | null;
          weather_forecast?: WeatherData[] | null;
          joy_suggestions?: JoySuggestion[] | null;
          trip_status?: 'planning' | 'active' | 'completed' | 'cancelled';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          trip_name?: string;
          origin?: LocationPoint;
          destination?: LocationPoint;
          waypoints?: LocationPoint[] | null;
          planned_stops?: string[] | null;
          rayne_way_enabled?: boolean;
          kids_in_car_mode?: boolean;
          filters_applied?: TripFilters | null;
          route_data?: RouteData | null;
          estimated_duration?: number | null;
          estimated_distance?: number | null;
          weather_forecast?: WeatherData[] | null;
          joy_suggestions?: JoySuggestion[] | null;
          trip_status?: 'planning' | 'active' | 'completed' | 'cancelled';
          started_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      joy_points_transactions: {
        Row: {
          id: string;
          user_id: string;
          points: number;
          reason: string;
          transaction_type: 'earned' | 'spent' | 'bonus';
          related_entity_type: string | null;
          related_entity_id: string | null;
          metadata: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          points: number;
          reason: string;
          transaction_type: 'earned' | 'spent' | 'bonus';
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          metadata?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          points?: number;
          reason?: string;
          transaction_type?: 'earned' | 'spent' | 'bonus';
          related_entity_type?: string | null;
          related_entity_id?: string | null;
          metadata?: any | null;
          created_at?: string;
        };
      };
      user_badges: {
        Row: {
          id: string;
          user_id: string;
          badge_type: string;
          badge_data: BadgeData;
          earned_at: string;
          progress_data: any | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          badge_type: string;
          badge_data: BadgeData;
          earned_at: string;
          progress_data?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          badge_type?: string;
          badge_data?: BadgeData;
          earned_at?: string;
          progress_data?: any | null;
        };
      };
      stop_contributions: {
        Row: {
          id: string;
          submitted_by: string;
          stop_name: string;
          stop_description: string | null;
          latitude: number;
          longitude: number;
          address: string;
          category: string;
          suggested_tags: string[] | null;
          photos: string[] | null;
          additional_notes: string | null;
          contact_info: ContactInfo | null;
          status: 'pending' | 'approved' | 'rejected';
          admin_review_notes: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          auto_joy_score: number | null;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          submitted_by: string;
          stop_name: string;
          stop_description?: string | null;
          latitude: number;
          longitude: number;
          address: string;
          category: string;
          suggested_tags?: string[] | null;
          photos?: string[] | null;
          additional_notes?: string | null;
          contact_info?: ContactInfo | null;
          status?: 'pending' | 'approved' | 'rejected';
          admin_review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          auto_joy_score?: number | null;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          submitted_by?: string;
          stop_name?: string;
          stop_description?: string | null;
          latitude?: number;
          longitude?: number;
          address?: string;
          category?: string;
          suggested_tags?: string[] | null;
          photos?: string[] | null;
          additional_notes?: string | null;
          contact_info?: ContactInfo | null;
          status?: 'pending' | 'approved' | 'rejected';
          admin_review_notes?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          auto_joy_score?: number | null;
          submitted_at?: string;
        };
      };
      assistant_interactions: {
        Row: {
          id: string;
          user_id: string;
          interaction_type: 'voice' | 'text' | 'suggestion' | 'trigger';
          user_input: string | null;
          joy_response: string;
          context: AssistantContext;
          sentiment: string | null;
          feedback_rating: number | null;
          timestamp: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          interaction_type: 'voice' | 'text' | 'suggestion' | 'trigger';
          user_input?: string | null;
          joy_response: string;
          context: AssistantContext;
          sentiment?: string | null;
          feedback_rating?: number | null;
          timestamp: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          interaction_type?: 'voice' | 'text' | 'suggestion' | 'trigger';
          user_input?: string | null;
          joy_response?: string;
          context?: AssistantContext;
          sentiment?: string | null;
          feedback_rating?: number | null;
          timestamp?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: string;
          phone_number: string;
          email: string | null;
          is_primary: boolean;
          emergency_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: string;
          phone_number: string;
          email?: string | null;
          is_primary?: boolean;
          emergency_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          relationship?: string;
          phone_number?: string;
          email?: string | null;
          is_primary?: boolean;
          emergency_code?: string | null;
          created_at?: string;
        };
      };
      offline_sync_queue: {
        Row: {
          id: string;
          user_id: string;
          sync_type: string;
          data: any;
          synced: boolean;
          sync_attempts: number;
          last_sync_attempt: string | null;
          error_message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sync_type: string;
          data: any;
          synced?: boolean;
          sync_attempts?: number;
          last_sync_attempt?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sync_type?: string;
          data?: any;
          synced?: boolean;
          sync_attempts?: number;
          last_sync_attempt?: string | null;
          error_message?: string | null;
          created_at?: string;
        };
      };
      stadiums: {
        Row: {
          id: string;
          name: string;
          city: string;
          state: string;
          latitude: number;
          longitude: number;
          seating_chart: SeatingSection[] | null;
          parking_options: ParkingOption[] | null;
          family_amenities: string[] | null;
          accessibility_features: string[] | null;
          nearby_hotels: NearbyAccommodation[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          state: string;
          latitude: number;
          longitude: number;
          seating_chart?: SeatingSection[] | null;
          parking_options?: ParkingOption[] | null;
          family_amenities?: string[] | null;
          accessibility_features?: string[] | null;
          nearby_hotels?: NearbyAccommodation[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string;
          state?: string;
          latitude?: number;
          longitude?: number;
          seating_chart?: SeatingSection[] | null;
          parking_options?: ParkingOption[] | null;
          family_amenities?: string[] | null;
          accessibility_features?: string[] | null;
          nearby_hotels?: NearbyAccommodation[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Type definitions for complex data structures
export interface FamilyMember {
  name: string;
  age?: number;
  relationship: string;
  special_needs?: string[];
  dietary_restrictions?: string[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  is_primary?: boolean;
}

export interface OperatingHours {
  monday?: TimeRange;
  tuesday?: TimeRange;
  wednesday?: TimeRange;
  thursday?: TimeRange;
  friday?: TimeRange;
  saturday?: TimeRange;
  sunday?: TimeRange;
  seasonal_variations?: SeasonalHours[];
  special_closures?: SpecialClosure[];
}

export interface TimeRange {
  open: string;
  close: string;
  closed?: boolean;
}

export interface SeasonalHours {
  season: string;
  start_date: string;
  end_date: string;
  hours: Partial<OperatingHours>;
}

export interface SpecialClosure {
  date: string;
  reason: string;
  all_day?: boolean;
  modified_hours?: TimeRange;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  social_media?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

export interface PricingInfo {
  free: boolean;
  cost_range?: '$' | '$$' | '$$$';
  admission_price?: number;
  parking_fee?: number;
  special_rates?: {
    children?: number;
    seniors?: number;
    family_package?: number;
  };
  payment_methods?: string[];
}

export interface AgeRange {
  min_age: number;
  max_age?: number;
  description?: string;
}

export interface LocationPoint {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface TripFilters {
  categories?: string[];
  amenities?: string[];
  accessibility_needs?: string[];
  max_detour_minutes?: number;
  indoor_only?: boolean;
  outdoor_only?: boolean;
  rayne_way_required?: boolean;
  min_joy_score?: number;
  budget_friendly?: boolean;
}

export interface RouteData {
  total_distance: number;
  total_duration: number;
  route_polyline: string;
  turn_by_turn_directions: RouteStep[];
  traffic_info?: TrafficInfo;
  alternative_routes?: AlternativeRoute[];
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  polyline: string;
  maneuver_type: string;
}

export interface TrafficInfo {
  current_conditions: string;
  delays: Delay[];
  alternate_suggestions: string[];
}

export interface Delay {
  location: string;
  severity: 'light' | 'moderate' | 'heavy';
  estimated_delay: number;
  cause: string;
}

export interface AlternativeRoute {
  name: string;
  distance: number;
  duration: number;
  toll_info?: TollInfo;
  scenic_rating?: number;
}

export interface TollInfo {
  has_tolls: boolean;
  estimated_cost?: number;
  toll_locations?: string[];
}

export interface WeatherData {
  location: LocationPoint;
  forecast_time: string;
  temperature: number;
  conditions: string;
  uv_index: number;
  precipitation_chance: number;
  wind_speed: number;
  visibility: number;
  air_quality_index?: number;
}

export interface JoySuggestion {
  type: 'stop' | 'route_modification' | 'weather_alert' | 'safety_tip';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  action_required?: boolean;
  suggested_action?: string;
  related_stop_id?: string;
  expires_at?: string;
}

export interface BadgeData {
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirements_met: string[];
  next_tier_requirements?: string[];
}

export interface AssistantContext {
  trip_stage: 'planning' | 'driving' | 'stopped' | 'idle';
  current_location?: LocationPoint;
  active_trip_id?: string;
  kids_in_car: boolean;
  rayne_way_enabled: boolean;
  time_of_day: string;
  weather_conditions?: string;
  last_interaction_type?: string;
  user_mood_indicators?: string[];
  recent_activities?: string[];
}

export interface SeatingSection {
  section_name: string;
  section_number?: string;
  level: string;
  shade_rating: number;
  sun_exposure_times: string[];
  price_range: string;
  family_friendly_score: number;
  accessibility: string[];
  view_quality: number;
  proximity_to_amenities: ProximityInfo;
}

export interface ProximityInfo {
  restrooms: number;
  concessions: number;
  family_areas: number;
  exits: number;
}

export interface ParkingOption {
  lot_name: string;
  distance_to_entrance: number;
  cost: number;
  accessibility_spaces: number;
  ev_charging: boolean;
  family_friendly_features: string[];
  security_level: number;
  covered: boolean;
  joy_score: number;
}

export interface NearbyAccommodation {
  name: string;
  type: 'hotel' | 'motel' | 'resort' | 'vacation_rental' | 'campground' | 'rv_park';
  distance_miles: number;
  price_range: string;
  family_amenities: string[];
  kid_specific_perks: string[];
  pool_info?: PoolInfo;
  dining_options: string[];
  pet_friendly: boolean;
  accessibility_features: string[];
  joy_score: number;
  booking_url?: string;
}

export interface PoolInfo {
  has_pool: boolean;
  pool_type?: 'indoor' | 'outdoor' | 'both';
  heated: boolean;
  kid_pool: boolean;
  shade_available: boolean;
  pool_hours?: string;
}