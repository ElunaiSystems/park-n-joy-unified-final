import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

// Supabase configuration - handled automatically by Lovable integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Database helper functions
export const db = {
  // Users and Profiles
  async createUserProfile(userId: string, profileData: any) {
    return await supabase
      .from('user_profiles')
      .insert({ user_id: userId, ...profileData })
      .select()
      .single();
  },

  async getUserProfile(userId: string) {
    return await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async updateUserProfile(userId: string, updates: any) {
    return await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
  },

  // Joy Stops
  async getJoyStops(filters?: any) {
    let query = supabase
      .from('joy_stops')
      .select('*')
      .eq('status', 'approved');

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.raynesWay && filters.raynesWay === true) {
      query = query.gte('shade_score', 7);
    }
    if (filters?.bounds) {
      query = query
        .gte('latitude', filters.bounds.south)
        .lte('latitude', filters.bounds.north)
        .gte('longitude', filters.bounds.west)
        .lte('longitude', filters.bounds.east);
    }

    return await query.order('joy_score', { ascending: false });
  },

  async createJoyStop(stopData: any) {
    return await supabase
      .from('joy_stops')
      .insert(stopData)
      .select()
      .single();
  },

  // Trip Planning
  async saveTrip(tripData: any) {
    return await supabase
      .from('trips')
      .insert(tripData)
      .select()
      .single();
  },

  async getUserTrips(userId: string) {
    return await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  },

  // Joy Points & Badges
  async awardJoyPoints(userId: string, points: number, reason: string) {
    return await supabase
      .from('joy_points_transactions')
      .insert({
        user_id: userId,
        points,
        reason,
        transaction_type: 'earned'
      });
  },

  async getUserJoyPoints(userId: string) {
    const { data } = await supabase
      .from('joy_points_transactions')
      .select('points')
      .eq('user_id', userId);
    
    return data?.reduce((total, tx) => total + tx.points, 0) || 0;
  },

  async awardBadge(userId: string, badgeType: string) {
    return await supabase
      .from('user_badges')
      .insert({
        user_id: userId,
        badge_type: badgeType,
        earned_at: new Date().toISOString()
      });
  },

  async getUserBadges(userId: string) {
    return await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
  },

  // Contributor System
  async submitStopContribution(contributionData: any) {
    return await supabase
      .from('stop_contributions')
      .insert({
        ...contributionData,
        status: 'pending',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();
  },

  async getPendingContributions() {
    return await supabase
      .from('stop_contributions')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: false });
  },

  // Joy Assistant Memory
  async saveAssistantInteraction(userId: string, interaction: any) {
    return await supabase
      .from('assistant_interactions')
      .insert({
        user_id: userId,
        ...interaction,
        timestamp: new Date().toISOString()
      });
  },

  async getAssistantMemory(userId: string, limit = 50) {
    return await supabase
      .from('assistant_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);
  },

  // Emergency Contacts
  async saveEmergencyContact(userId: string, contactData: any) {
    return await supabase
      .from('emergency_contacts')
      .insert({
        user_id: userId,
        ...contactData
      });
  },

  async getEmergencyContacts(userId: string) {
    return await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', userId);
  },

  // Offline Sync
  async syncOfflineData(userId: string, syncData: any) {
    return await supabase
      .from('offline_sync_queue')
      .insert({
        user_id: userId,
        data: syncData,
        sync_type: syncData.type,
        created_at: new Date().toISOString()
      });
  },

  async getOfflineSyncQueue(userId: string) {
    return await supabase
      .from('offline_sync_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('synced', false)
      .order('created_at', { ascending: true });
  },

  async updateContribution(contributionId: string, updates: any) {
    return await supabase
      .from('stop_contributions')
      .update(updates)
      .eq('id', contributionId)
      .select()
      .single();
  }
};