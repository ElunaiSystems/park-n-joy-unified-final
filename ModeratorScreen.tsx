import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Eye, Check, X, Star, Users, MapPin, Filter, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type JoyStop } from '@/services/mappingService';
import { toast } from 'sonner';

interface ModerationStats {
  pendingCount: number;
  approvedToday: number;
  rejectedToday: number;
  totalStops: number;
}

export default function ModeratorScreen() {
  const navigate = useNavigate();
  const [pendingStops, setPendingStops] = useState<JoyStop[]>([]);
  const [selectedStop, setSelectedStop] = useState<JoyStop | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'high_confidence'>('pending');
  const [stats, setStats] = useState<ModerationStats>({
    pendingCount: 0,
    approvedToday: 0,
    rejectedToday: 0,
    totalStops: 0
  });

  // Mock data for demonstration
  const mockPendingStops: JoyStop[] = [
    {
      id: 'pending_1',
      name: 'Discovered Family Park',
      type: 'playground',
      coordinates: { lat: 40.7128, lng: -74.0060 },
      address: '456 Discovery Lane, Familyville, NY',
      joyRating: 4.2,
      shadeScore: 6,
      accessibilityScore: 7,
      familyFriendly: true,
      joyVerified: false,
      confidence: 'high',
      features: ['playground', 'restrooms', 'parking'],
      description: 'Recently discovered park with modern playground equipment and clean facilities',
      images: ['/placeholder.svg'],
      suggestedBy: 'joy_ai',
      moderationStatus: 'pending',
      submittedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 'pending_2',
      name: 'Burger Palace',
      type: 'restaurant',
      coordinates: { lat: 40.7589, lng: -73.9851 },
      address: '789 Eat Street, Food City, NY',
      joyRating: 3.8,
      shadeScore: 9, // Indoor
      accessibilityScore: 5,
      familyFriendly: true,
      joyVerified: false,
      confidence: 'medium',
      features: ['indoor', 'high_chairs', 'parking'],
      description: 'Family restaurant with kids menu, needs verification of play area claims',
      images: [],
      suggestedBy: 'community',
      moderationStatus: 'pending',
      submittedAt: '2024-01-15T08:15:00Z'
    },
    {
      id: 'pending_3',
      name: 'Highway Rest Area #42',
      type: 'rest_area',
      coordinates: { lat: 41.2524, lng: -95.9980 },
      address: 'I-80 Mile Marker 42, Nebraska',
      joyRating: 3.5,
      shadeScore: 4,
      accessibilityScore: 8,
      familyFriendly: true,
      joyVerified: false,
      confidence: 'low',
      features: ['restrooms', 'parking', 'vending'],
      description: 'Standard highway rest area, contributor claims excellent family facilities',
      images: [],
      suggestedBy: 'community',
      moderationStatus: 'pending',
      submittedAt: '2024-01-14T16:45:00Z'
    }
  ];

  useEffect(() => {
    // Load pending stops
    setPendingStops(mockPendingStops);
    setStats({
      pendingCount: mockPendingStops.length,
      approvedToday: 12,
      rejectedToday: 3,
      totalStops: 1247
    });
  }, []);

  const handleApprove = async (stop: JoyStop) => {
    try {
      // Update stop status
      const updatedStop = {
        ...stop,
        joyVerified: true,
        moderationStatus: 'approved' as const,
        approvedAt: new Date().toISOString()
      };

      // Remove from pending list
      setPendingStops(prev => prev.filter(s => s.id !== stop.id));
      setSelectedStop(null);
      setModerationNotes('');

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingCount: prev.pendingCount - 1,
        approvedToday: prev.approvedToday + 1,
        totalStops: prev.totalStops + 1
      }));

      toast.success(`Approved ${stop.name} as Joy Verified! ✅`);
      
      // Here you would save to Supabase
      console.log('Approved stop:', updatedStop);
    } catch (error) {
      toast.error('Failed to approve stop');
    }
  };

  const handleReject = async (stop: JoyStop) => {
    try {
      // Remove from pending list
      setPendingStops(prev => prev.filter(s => s.id !== stop.id));
      setSelectedStop(null);
      setModerationNotes('');

      // Update stats
      setStats(prev => ({
        ...prev,
        pendingCount: prev.pendingCount - 1,
        rejectedToday: prev.rejectedToday + 1
      }));

      toast.success(`Rejected ${stop.name} with notes saved`);
      
      // Here you would save rejection to Supabase with notes
      console.log('Rejected stop:', stop.id, 'Notes:', moderationNotes);
    } catch (error) {
      toast.error('Failed to reject stop');
    }
  };

  const handleUpdateTags = (stop: JoyStop, newFeatures: string[]) => {
    // Update stop features
    const updatedStop = { ...stop, features: newFeatures };
    setPendingStops(prev => prev.map(s => s.id === stop.id ? updatedStop : s));
    if (selectedStop?.id === stop.id) {
      setSelectedStop(updatedStop);
    }
  };

  const filteredStops = pendingStops.filter(stop => {
    if (filterStatus === 'pending') return stop.moderationStatus === 'pending';
    if (filterStatus === 'high_confidence') return stop.confidence === 'high';
    return true;
  });

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuggestedByIcon = (suggestedBy: string) => {
    switch (suggestedBy) {
      case 'joy_ai': return '🤖';
      case 'community': return '👥';
      case 'verified_data': return '📊';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Joy Stop Moderator</h1>
              <p className="text-xs text-muted-foreground">Review and approve community suggestions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Moderation Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.pendingCount}</div>
            <div className="text-xs text-muted-foreground">Pending Review</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approvedToday}</div>
            <div className="text-xs text-muted-foreground">Approved Today</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejectedToday}</div>
            <div className="text-xs text-muted-foreground">Rejected Today</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-accent">{stats.totalStops}</div>
            <div className="text-xs text-muted-foreground">Total Joy Stops</div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Review Queue
            </h3>
            <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Submissions</SelectItem>
                <SelectItem value="pending">Pending Only</SelectItem>
                <SelectItem value="high_confidence">High Confidence</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stop List */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Pending Stops ({filteredStops.length})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredStops.map(stop => (
                <div 
                  key={stop.id} 
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedStop?.id === stop.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedStop(stop)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{stop.name}</h4>
                    <Badge className={getConfidenceColor(stop.confidence)}>
                      {stop.confidence}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">{stop.address}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span>{getSuggestedByIcon(stop.suggestedBy)} {stop.suggestedBy}</span>
                      <span>⭐ {stop.joyRating}/5</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(stop.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Stop Details & Moderation */}
          <Card className="p-4">
            {selectedStop ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{selectedStop.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedStop.address}</p>
                  </div>
                  <Badge className={getConfidenceColor(selectedStop.confidence)}>
                    {selectedStop.confidence} confidence
                  </Badge>
                </div>

                {/* Stop Metrics */}
                <div className="grid grid-cols-3 gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="font-semibold">⭐ {selectedStop.joyRating}</div>
                    <div className="text-xs text-muted-foreground">Joy Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">🌳 {selectedStop.shadeScore}</div>
                    <div className="text-xs text-muted-foreground">Shade Score</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">♿ {selectedStop.accessibilityScore}</div>
                    <div className="text-xs text-muted-foreground">Accessibility</div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium block mb-2">Description</label>
                  <p className="text-sm p-3 bg-muted/50 rounded-lg">{selectedStop.description}</p>
                </div>

                {/* Features/Tags */}
                <div>
                  <label className="text-sm font-medium block mb-2">Features & Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedStop.features.map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                  <Input 
                    placeholder="Add tags: playground, restrooms, parking..."
                    className="text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const newFeature = (e.target as HTMLInputElement).value.trim();
                        if (newFeature && !selectedStop.features.includes(newFeature)) {
                          handleUpdateTags(selectedStop, [...selectedStop.features, newFeature]);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>

                {/* Moderation Notes */}
                <div>
                  <label className="text-sm font-medium block mb-2">Moderation Notes</label>
                  <Textarea
                    placeholder="Add notes about this stop (optional)..."
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Suggested By Info */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm">
                    <strong>Suggested by:</strong> {getSuggestedByIcon(selectedStop.suggestedBy)} {selectedStop.suggestedBy}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Submitted: {new Date(selectedStop.submittedAt).toLocaleString()}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    onClick={() => handleApprove(selectedStop)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve & Verify
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleReject(selectedStop)}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium text-muted-foreground mb-2">Select a stop to review</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a pending stop from the list to view details and moderate
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => setFilterStatus('high_confidence')}>
              <Star className="w-4 h-4 mr-1" />
              Auto-Approve High Confidence
            </Button>
            <Button variant="outline" onClick={() => {
              // Export pending stops
              const data = JSON.stringify(filteredStops, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'pending-stops.json';
              a.click();
            }}>
              Export Data
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-1" />
              View Contributors
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Admin Dashboard
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}