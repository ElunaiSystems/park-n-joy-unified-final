import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Camera, MapPin, Heart, Gift, Sparkles, Upload, 
  CheckCircle, Baby, Trees, Utensils, Home, Car, Tent, Fuel
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import JoyAssistant from "@/components/JoyAssistant";

interface ContributionFormData {
  name: string;
  type: string;
  description: string;
  notes: string;
  contributorName: string;
  contributorEmail: string;
  shadeAvailable: boolean;
  wheelchairAccessible: boolean;
  petFriendly: boolean;
  familyFriendly: boolean;
  coordinates: { lat: number; lng: number } | null;
  photos: File[];
}

const stopTypes = [
  { value: 'playground', label: 'Playground', icon: Baby },
  { value: 'restaurant', label: 'Restaurant', icon: Utensils },
  { value: 'restroom', label: 'Rest Stop', icon: Home },
  { value: 'parking', label: 'Parking/EV', icon: Car },
  { value: 'rv_park', label: 'RV Park', icon: Tent },
  { value: 'campground', label: 'Campground', icon: Trees },
  { value: 'gas_station', label: 'Gas Station', icon: Fuel }
];

export default function ContributorScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showJoyThankYou, setShowJoyThankYou] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ContributionFormData>({
    name: '',
    type: '',
    description: '',
    notes: '',
    contributorName: '',
    contributorEmail: '',
    shadeAvailable: false,
    wheelchairAccessible: false,
    petFriendly: false,
    familyFriendly: true,
    coordinates: null,
    photos: []
  });

  const handleInputChange = (field: keyof ContributionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));
      toast({
        title: "Photos added!",
        description: `${files.length} photo(s) added to your submission.`,
      });
    }
  };

  const handleLocationCapture = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          toast({
            title: "Location captured!",
            description: "Your current location has been added to the submission.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to capture location. You can add it manually later.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type || !formData.contributorName || !formData.contributorEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Award Joy Points (simulated)
      const pointsAwarded = 50 + (formData.photos.length * 10);
      
      setSubmitted(true);
      setShowJoyThankYou(true);
      
      toast({
        title: "🎉 Submission successful!",
        description: `You've earned ${pointsAwarded} Joy Points! Your contribution is pending review.`,
      });

    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was an error submitting your contribution. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      description: '',
      notes: '',
      contributorName: '',
      contributorEmail: '',
      shadeAvailable: false,
      wheelchairAccessible: false,
      petFriendly: false,
      familyFriendly: true,
      coordinates: null,
      photos: []
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        {/* Success Screen */}
        <div className="p-4 space-y-6">
          <Card className="card-feature p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-3">🎉 Thank You!</h1>
            <p className="text-muted-foreground mb-6">
              Your Joy Stop contribution has been submitted for review. Our team will verify the details and add it to the map soon!
            </p>
            
            <div className="bg-primary-soft p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>✅ Our team reviews your submission (1-3 days)</p>
                <p>🗺️ Stop gets added to the Joy Map</p>
                <p>🏆 You earn badges and recognition</p>
                <p>💌 We'll email you when it's live!</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="joy" onClick={resetForm} className="flex-1">
                <Gift className="w-4 h-4 mr-2" />
                Submit Another
              </Button>
              <Button variant="outline" onClick={() => navigate('/map')} className="flex-1">
                <MapPin className="w-4 h-4 mr-2" />
                View Map
              </Button>
            </div>
          </Card>
        </div>

        {/* Joy Thank You Modal */}
        <JoyAssistant 
          isOpen={showJoyThankYou}
          onClose={() => setShowJoyThankYou(false)}
          kidsInCarMode={false}
          raynesWayEnabled={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Contribute a Joy Stop</h1>
            <p className="text-xs text-muted-foreground">Share a family-friendly place</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Hero */}
        <Card className="card-feature p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white bounce-joy" />
          </div>
          <h2 className="text-xl font-bold mb-2">Spread the Joy!</h2>
          <p className="text-muted-foreground mb-4">
            Help families discover amazing places by sharing your favorite family-friendly spots.
          </p>
          <Badge variant="secondary" className="bg-primary-soft text-primary">
            🏆 Earn Joy Points & Badges
          </Badge>
        </Card>

        {/* Location Info */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 icon-joy" />
            Stop Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Stop Name *
              </label>
              <Input 
                placeholder="e.g., Sunshine Adventure Playground"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Stop Type *
              </label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose stop type" />
                </SelectTrigger>
                <SelectContent>
                  {stopTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Description
              </label>
              <Textarea 
                placeholder="Tell families what makes this place special..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Additional Notes
              </label>
              <Textarea 
                placeholder="Parking info, best times to visit, insider tips..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </Card>

        {/* Features & Accessibility */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 icon-accent" />
            Features & Accessibility
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-primary" />
                <span className="text-sm">🌳 Shade Available</span>
              </div>
              <Switch 
                checked={formData.shadeAvailable} 
                onCheckedChange={(checked) => handleInputChange('shadeAvailable', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-secondary">♿</span>
                <span className="text-sm">Wheelchair Accessible</span>
              </div>
              <Switch 
                checked={formData.wheelchairAccessible} 
                onCheckedChange={(checked) => handleInputChange('wheelchairAccessible', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 text-accent">🐕</span>
                <span className="text-sm">Pet Friendly</span>
              </div>
              <Switch 
                checked={formData.petFriendly} 
                onCheckedChange={(checked) => handleInputChange('petFriendly', checked)} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Baby className="w-4 h-4 text-joy-orange" />
                <span className="text-sm">👨‍👩‍👧‍👦 Family Friendly</span>
              </div>
              <Switch 
                checked={formData.familyFriendly} 
                onCheckedChange={(checked) => handleInputChange('familyFriendly', checked)} 
              />
            </div>
          </div>
        </Card>

        {/* Location & Photos */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 icon-secondary" />
            Location & Photos
          </h3>
          
          <div className="space-y-4">
            <div>
              <Button 
                variant="outline" 
                onClick={handleLocationCapture}
                className="w-full"
                disabled={!!formData.coordinates}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {formData.coordinates ? '📍 Location Captured' : 'Capture Current Location'}
              </Button>
              {formData.coordinates && (
                <p className="text-xs text-muted-foreground mt-1">
                  Location: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Photos (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-sm">
                    {formData.photos.length > 0 
                      ? `${formData.photos.length} photo(s) selected` 
                      : 'Tap to add photos'
                    }
                  </span>
                </Button>
              </div>
              {formData.photos.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.photos.map((file, index) => (
                    <span key={index} className="text-xs bg-accent-soft text-accent px-2 py-1 rounded">
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Contributor Info */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 icon-accent" />
            Your Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Your Name *
              </label>
              <Input 
                placeholder="First name or nickname"
                value={formData.contributorName}
                onChange={(e) => handleInputChange('contributorName', e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Email Address *
              </label>
              <Input 
                type="email"
                placeholder="your.email@example.com"
                value={formData.contributorEmail}
                onChange={(e) => handleInputChange('contributorEmail', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                We'll email you when your stop is approved and goes live!
              </p>
            </div>
          </div>
        </Card>

        {/* Joy Points Preview */}
        <Card className="card-joy p-4 border-primary/20">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold mb-2">Joy Points Reward</h3>
            <p className="text-sm text-muted-foreground mb-3">
              You'll earn 50 Joy Points for this submission, plus 10 points for each photo!
            </p>
            <Badge variant="secondary" className="bg-primary-soft text-primary">
              🏆 Potential: {50 + (formData.photos.length * 10)} Points
            </Badge>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="pb-6">
          <Button 
            variant="joy" 
            size="lg" 
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.name || !formData.type || !formData.contributorName || !formData.contributorEmail}
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5 mr-2" />
                Submit Joy Stop
              </>
            )}
          </Button>
          <p className="text-xs text-center text-muted-foreground mt-2">
            By submitting, you agree to our community guidelines and terms of service.
          </p>
        </div>
      </main>
    </div>
  );
}