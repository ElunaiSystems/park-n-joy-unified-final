// Joy Points Backend Logic & Rewards System
import { supabase, db } from '../lib/supabase';

export interface JoyPointsTransaction {
  id?: string;
  user_id: string;
  action_type: string;
  points_awarded: number;
  points_spent?: number;
  transaction_type: 'earn' | 'spend';
  reference_id?: string;
  reference_type?: string;
  metadata?: any;
  created_at?: string;
}

export interface JoyPointsBalance {
  user_id: string;
  total_points: number;
  lifetime_points: number;
  tier_level: string;
  tier_benefits: string[];
  last_updated: string;
}

export interface RedemptionOption {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
  value_usd: number;
  sponsor_id?: string;
  available: boolean;
  terms: string;
}

export interface AffiliateTracking {
  id?: string;
  user_id: string;
  provider: string;
  tracking_id: string;
  original_url: string;
  affiliate_url: string;
  click_timestamp: string;
  conversion_timestamp?: string;
  commission_amount?: number;
  commission_status: 'pending' | 'confirmed' | 'paid';
  joy_points_awarded?: number;
}

class JoyPointsBackend {
  // Award points for various user actions
  async awardPoints(
    userId: string, 
    actionType: string, 
    metadata: any = {}
  ): Promise<JoyPointsTransaction> {
    const pointValues = {
      // User contributions
      'stop_submission': 25,
      'photo_upload': 15,
      'review_submission': 20,
      'location_verification': 30,
      
      // Social engagement
      'referral_signup': 100,
      'referral_first_booking': 250,
      'social_share': 10,
      
      // Bookings & purchases
      'hotel_booking': (amount: number) => Math.floor(amount * 0.02),
      'campground_booking': (amount: number) => Math.floor(amount * 0.03),
      'ticket_purchase': (amount: number) => Math.floor(amount * 0.025),
      
      // Sponsor interactions
      'sponsor_visit': 10,
      'sponsor_checkin': 25,
      'sponsor_purchase': (amount: number) => Math.floor(amount * 0.01),
      
      // App engagement
      'daily_login': 5,
      'onboarding_complete': 50,
      'profile_complete': 30,
      'first_trip_plan': 40,
      
      // Rayne's Way specific
      'raynes_way_route': 20,
      'shade_report': 15,
      'sun_safety_checkin': 10
    };

    let pointsAwarded: number;
    
    if (typeof pointValues[actionType as keyof typeof pointValues] === 'function') {
      const calculator = pointValues[actionType as keyof typeof pointValues] as Function;
      pointsAwarded = calculator(metadata.amount || 0);
    } else {
      pointsAwarded = pointValues[actionType as keyof typeof pointValues] as number || 5;
    }

    // Bonus multipliers
    const user = await this.getUserTier(userId);
    const multiplier = this.getTierMultiplier(user.tier_level);
    pointsAwarded = Math.floor(pointsAwarded * multiplier);

    // Create transaction record
    const transaction: JoyPointsTransaction = {
      user_id: userId,
      action_type: actionType,
      points_awarded: pointsAwarded,
      transaction_type: 'earn',
      reference_id: metadata.referenceId,
      reference_type: metadata.referenceType,
      metadata,
      created_at: new Date().toISOString()
    };

    // Save to database
    const { data, error } = await supabase
      .from('joy_points_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) {
      console.error('Error awarding points:', error);
      throw error;
    }

    // Update user balance
    await this.updateUserBalance(userId);
    
    // Check for tier upgrades
    await this.checkTierUpgrade(userId);

    return data;
  }

  // Spend points for redemptions
  async spendPoints(
    userId: string, 
    redemptionId: string, 
    pointsToSpend: number
  ): Promise<JoyPointsTransaction> {
    // Verify user has enough points
    const balance = await this.getUserBalance(userId);
    if (balance.total_points < pointsToSpend) {
      throw new Error('Insufficient Joy Points');
    }

    // Verify redemption option is valid
    const redemption = await this.getRedemptionOption(redemptionId);
    if (!redemption.available || redemption.points_required !== pointsToSpend) {
      throw new Error('Invalid redemption option');
    }

    // Create spend transaction
    const transaction: JoyPointsTransaction = {
      user_id: userId,
      action_type: 'redemption',
      points_awarded: 0,
      points_spent: pointsToSpend,
      transaction_type: 'spend',
      reference_id: redemptionId,
      reference_type: 'redemption',
      metadata: { redemption },
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('joy_points_transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) {
      console.error('Error spending points:', error);
      throw error;
    }

    // Update user balance
    await this.updateUserBalance(userId);

    return data;
  }

  // Get user's current point balance and tier
  async getUserBalance(userId: string): Promise<JoyPointsBalance> {
    const { data, error } = await supabase
      .from('joy_points_balances')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Create initial balance
      return await this.createInitialBalance(userId);
    }

    return data;
  }

  private async createInitialBalance(userId: string): Promise<JoyPointsBalance> {
    const initialBalance: JoyPointsBalance = {
      user_id: userId,
      total_points: 0,
      lifetime_points: 0,
      tier_level: 'Explorer',
      tier_benefits: ['Basic Joy Assistant', 'Standard Support'],
      last_updated: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('joy_points_balances')
      .insert(initialBalance)
      .select()
      .single();

    if (error) {
      console.error('Error creating initial balance:', error);
      throw error;
    }

    return data;
  }

  // Update user balance after transactions
  private async updateUserBalance(userId: string): Promise<void> {
    // Calculate totals from transactions
    const { data: transactions, error } = await supabase
      .from('joy_points_transactions')
      .select('points_awarded, points_spent')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching transactions:', error);
      return;
    }

    const totalEarned = transactions.reduce((sum, t) => sum + (t.points_awarded || 0), 0);
    const totalSpent = transactions.reduce((sum, t) => sum + (t.points_spent || 0), 0);
    const currentBalance = totalEarned - totalSpent;

    // Update balance record
    await supabase
      .from('joy_points_balances')
      .update({
        total_points: currentBalance,
        lifetime_points: totalEarned,
        last_updated: new Date().toISOString()
      })
      .eq('user_id', userId);
  }

  // Check if user qualifies for tier upgrade
  private async checkTierUpgrade(userId: string): Promise<void> {
    const balance = await this.getUserBalance(userId);
    const newTier = this.calculateTier(balance.lifetime_points);
    
    if (newTier !== balance.tier_level) {
      const tierBenefits = this.getTierBenefits(newTier);
      
      await supabase
        .from('joy_points_balances')
        .update({
          tier_level: newTier,
          tier_benefits: tierBenefits
        })
        .eq('user_id', userId);

      // Award tier upgrade bonus
      await this.awardPoints(userId, 'tier_upgrade', { 
        oldTier: balance.tier_level, 
        newTier,
        bonus: true 
      });
    }
  }

  private calculateTier(lifetimePoints: number): string {
    if (lifetimePoints >= 10000) return 'Joy Ambassador';
    if (lifetimePoints >= 5000) return 'Joy Champion';
    if (lifetimePoints >= 2500) return 'Joy Adventurer';
    if (lifetimePoints >= 1000) return 'Joy Traveler';
    if (lifetimePoints >= 250) return 'Joy Seeker';
    return 'Explorer';
  }

  private getTierBenefits(tier: string): string[] {
    const benefits = {
      'Explorer': ['Basic Joy Assistant', 'Standard Support'],
      'Joy Seeker': ['Enhanced Joy Assistant', 'Priority Support', '5% Bonus Points'],
      'Joy Traveler': ['Advanced Joy Assistant', 'Premium Support', '10% Bonus Points', 'Early Feature Access'],
      'Joy Adventurer': ['Expert Joy Assistant', 'VIP Support', '15% Bonus Points', 'Exclusive Content', 'Partner Perks'],
      'Joy Champion': ['Master Joy Assistant', 'Concierge Support', '25% Bonus Points', 'Premium Features', 'VIP Partner Access'],
      'Joy Ambassador': ['Ultimate Joy Assistant', 'Personal Concierge', '50% Bonus Points', 'All Features', 'Ambassador Perks', 'Revenue Share']
    };
    
    return benefits[tier as keyof typeof benefits] || benefits['Explorer'];
  }

  private getTierMultiplier(tier: string): number {
    const multipliers = {
      'Explorer': 1.0,
      'Joy Seeker': 1.05,
      'Joy Traveler': 1.10,
      'Joy Adventurer': 1.15,
      'Joy Champion': 1.25,
      'Joy Ambassador': 1.50
    };
    
    return multipliers[tier as keyof typeof multipliers] || 1.0;
  }

  private async getUserTier(userId: string): Promise<JoyPointsBalance> {
    return await this.getUserBalance(userId);
  }

  // Get available redemption options for user
  async getRedemptionOptions(userId: string): Promise<RedemptionOption[]> {
    const balance = await this.getUserBalance(userId);
    
    // Base redemption options
    const options: RedemptionOption[] = [
      {
        id: 'gas_discount_5',
        name: '$5 Gas Card',
        description: 'Digital gas card for major stations',
        points_required: 500,
        category: 'travel',
        value_usd: 5,
        available: true,
        terms: 'Valid at participating stations. Expires in 90 days.'
      },
      {
        id: 'campground_night',
        name: 'Free Campground Night',
        description: 'One night at participating Joy-Verified campgrounds',
        points_required: 750,
        category: 'accommodation',
        value_usd: 35,
        available: true,
        terms: 'Subject to availability. Blackout dates may apply.'
      },
      {
        id: 'family_meal_voucher',
        name: 'Family Meal Voucher',
        description: 'Meal for family of 4 at Joy-Verified restaurants',
        points_required: 400,
        category: 'dining',
        value_usd: 25,
        available: true,
        terms: 'Valid at participating Joy-Verified locations only.'
      },
      {
        id: 'stadium_upgrade',
        name: 'Stadium Seat Upgrade',
        description: 'Upgrade to shaded premium seating',
        points_required: 600,
        category: 'entertainment',
        value_usd: 30,
        available: true,
        terms: 'Subject to availability and participating venues.'
      },
      {
        id: 'rv_supplies_discount',
        name: '20% RV Supplies Discount',
        description: 'Discount on RV supplies and accessories',
        points_required: 300,
        category: 'travel',
        value_usd: 20,
        available: true,
        terms: 'Valid at participating retailers. Maximum $100 discount.'
      }
    ];

    // Add tier-exclusive options
    if (balance.tier_level === 'Joy Champion' || balance.tier_level === 'Joy Ambassador') {
      options.push({
        id: 'vip_concierge',
        name: 'VIP Travel Concierge',
        description: 'Personal trip planning service',
        points_required: 2000,
        category: 'service',
        value_usd: 100,
        available: true,
        terms: 'Available to Joy Champions and Ambassadors only.'
      });
    }

    // Filter by user's available points
    return options.filter(option => balance.total_points >= option.points_required);
  }

  async getRedemptionOption(redemptionId: string): Promise<RedemptionOption> {
    // This would typically fetch from database
    const options = await this.getRedemptionOptions('temp');
    const option = options.find(o => o.id === redemptionId);
    
    if (!option) {
      throw new Error('Redemption option not found');
    }
    
    return option;
  }

  // Track affiliate link clicks and conversions
  async trackAffiliateClick(
    userId: string,
    provider: string,
    originalUrl: string,
    affiliateUrl: string
  ): Promise<AffiliateTracking> {
    const tracking: AffiliateTracking = {
      user_id: userId,
      provider,
      tracking_id: `pnj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      original_url: originalUrl,
      affiliate_url: affiliateUrl,
      click_timestamp: new Date().toISOString(),
      commission_status: 'pending'
    };

    const { data, error } = await supabase
      .from('affiliate_tracking')
      .insert(tracking)
      .select()
      .single();

    if (error) {
      console.error('Error tracking affiliate click:', error);
      throw error;
    }

    return data;
  }

  async recordAffiliateConversion(
    trackingId: string,
    commissionAmount: number,
    joyPointsAwarded: number
  ): Promise<void> {
    await supabase
      .from('affiliate_tracking')
      .update({
        conversion_timestamp: new Date().toISOString(),
        commission_amount: commissionAmount,
        commission_status: 'confirmed',
        joy_points_awarded: joyPointsAwarded
      })
      .eq('tracking_id', trackingId);
  }

  // Get user's transaction history
  async getTransactionHistory(userId: string, limit: number = 50): Promise<JoyPointsTransaction[]> {
    const { data, error } = await supabase
      .from('joy_points_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }

    return data || [];
  }

  // Analytics for admin dashboard
  async getPointsAnalytics(dateRange: { start: string; end: string }) {
    const { data, error } = await supabase
      .from('joy_points_transactions')
      .select('action_type, points_awarded, points_spent, created_at')
      .gte('created_at', dateRange.start)
      .lte('created_at', dateRange.end);

    if (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }

    // Process analytics data
    const totalPointsAwarded = data.reduce((sum, t) => sum + (t.points_awarded || 0), 0);
    const totalPointsSpent = data.reduce((sum, t) => sum + (t.points_spent || 0), 0);
    const topActions = this.groupByAction(data);

    return {
      totalPointsAwarded,
      totalPointsSpent,
      netPoints: totalPointsAwarded - totalPointsSpent,
      topActions,
      transactionCount: data.length
    };
  }

  private groupByAction(transactions: any[]) {
    const groups = transactions.reduce((acc, t) => {
      const action = t.action_type;
      if (!acc[action]) {
        acc[action] = { count: 0, totalPoints: 0 };
      }
      acc[action].count++;
      acc[action].totalPoints += (t.points_awarded || 0);
      return acc;
    }, {});

    return Object.entries(groups)
      .sort(([,a], [,b]) => (b as any).totalPoints - (a as any).totalPoints)
      .slice(0, 10);
  }
}

export const joyPointsBackend = new JoyPointsBackend();
export default joyPointsBackend;