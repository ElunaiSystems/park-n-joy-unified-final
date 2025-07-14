import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Share2, QrCode, Copy, Gift, Users, Sparkles, Heart, Star } from "lucide-react";

export default function ReferralScreen() {
  const [referralCode] = useState("PARKNJOY2024");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`Join me on Park N Joy! Use code ${referralCode} for special Founding Family benefits: https://parknjoy.app/join/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareJoy = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Park N Joy!',
        text: `I'm loving Park N Joy for family road trips! Join me as a Founding Family with code ${referralCode}`,
        url: `https://parknjoy.app/join/${referralCode}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-joy-orange rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Share the Joy</h1>
            <p className="text-xs text-muted-foreground">Invite families to join your adventures</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-6">
        {/* Founding Family Status */}
        <Card className="card-feature p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-joy-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white bounce-joy" />
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground mb-3">
              🌟 Founding Family
            </Badge>
            <h2 className="text-xl font-bold mb-2">You're a Park N Joy Pioneer!</h2>
            <p className="text-muted-foreground">
              Share the joy with other families and earn special rewards together
            </p>
          </div>
        </Card>

        {/* Your Referral Code */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 icon-joy" />
            Your Special Code
          </h3>
          
          <div className="bg-primary-soft p-4 rounded-lg mb-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Founding Family Code</p>
              <div className="text-2xl font-bold text-primary tracking-wider mb-3">
                {referralCode}
              </div>
              <p className="text-xs text-muted-foreground">
                Families who join with your code get instant Founding Family status!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="joy-soft" onClick={copyReferralCode} disabled={copied}>
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Code"}
            </Button>
            <Button variant="adventure-soft" onClick={() => setShowQR(!showQR)}>
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
          </div>

          {showQR && (
            <div className="mt-4 p-4 bg-card border rounded-lg text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent mx-auto rounded-lg flex items-center justify-center mb-3">
                <QrCode className="w-16 h-16 text-white" />
              </div>
              <p className="text-sm text-muted-foreground">
                Scan this QR code to join Park N Joy with your code!
              </p>
            </div>
          )}
        </Card>

        {/* Share Options */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 icon-adventure" />
            Spread the Joy
          </h3>
          
          <div className="space-y-3">
            <Button variant="joy" className="w-full justify-start" onClick={shareJoy}>
              <Share2 className="w-5 h-5" />
              Share with Friends & Family
            </Button>
            
            <Button variant="adventure-soft" className="w-full justify-start">
              <Users className="w-5 h-5" />
              Invite School Parents
            </Button>
            
            <Button variant="joy-soft" className="w-full justify-start">
              <Heart className="w-5 h-5" />
              Share on Social Media
            </Button>
          </div>
        </Card>

        {/* Referral Benefits */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4">Founding Family Benefits</h3>
          
          <div className="space-y-3">
            {[
              { icon: "🌟", title: "Lifetime Access", desc: "Early access to all new features forever" },
              { icon: "🎪", title: "Premium Joy Pins", desc: "Exclusive access to curated family spots" },
              { icon: "🏆", title: "Joy Points Bonus", desc: "Earn 2x points on all activities" },
              { icon: "🎁", title: "Special Rewards", desc: "Quarterly family adventure prizes" },
              { icon: "👑", title: "VIP Support", desc: "Priority customer service & feedback line" }
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-accent-soft/50 rounded-lg">
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <h4 className="font-medium">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Your Referrals */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4">Your Joy Network</h3>
          
          <div className="text-center p-6">
            <div className="text-4xl font-bold text-primary mb-2">3</div>
            <p className="text-muted-foreground mb-4">Families joined through your code</p>
            
            <div className="flex justify-center gap-2 mb-4">
              {["👨‍👩‍👧‍👦", "👩‍👩‍👧‍👦", "👨‍👩‍👦‍👦"].map((family, index) => (
                <div key={index} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  {family}
                </div>
              ))}
            </div>
            
            <Badge variant="secondary" className="bg-secondary-soft text-secondary">
              🎉 Joy Network Growing!
            </Badge>
          </div>
        </Card>

        {/* Manual Invite */}
        <Card className="card-joy p-4">
          <h3 className="text-lg font-semibold mb-4">Invite by Email</h3>
          
          <div className="space-y-3">
            <Input 
              placeholder="friend@email.com" 
              className="touch-friendly"
            />
            <Button variant="adventure" className="w-full">
              Send Joy Invitation
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}