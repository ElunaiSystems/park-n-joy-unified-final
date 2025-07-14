import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Play, Pause, SkipForward, Volume2, VolumeX, Heart, Star } from "lucide-react";

interface Story {
  id: string;
  title: string;
  duration: string;
  category: 'adventure' | 'educational' | 'mindfulness' | 'safety';
  ageGroup: string;
  description: string;
  script: string[];
}

interface StoryModeProps {
  isOpen: boolean;
  onClose: () => void;
  kidsInCarMode?: boolean;
}

export default function StoryMode({ isOpen, onClose, kidsInCarMode = false }: StoryModeProps) {
  const [currentStory, setCurrentStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLine, setCurrentLine] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stories: Story[] = [
    {
      id: '1',
      title: 'The Magical Road Trip Adventure',
      duration: '5 min',
      category: 'adventure',
      ageGroup: '3-8 years',
      description: 'Join Ruby the Road Trip Rabbit as she discovers joy stops along the way!',
      script: [
        "Once upon a time, there was a little rabbit named Ruby who loved going on car rides...",
        "Ruby always looked for the most magical stops along the way - playgrounds with rainbow slides...",
        "She learned that the best adventures happen when families stick together and help each other...",
        "And they all lived joyfully ever after, creating memories that would last forever!"
      ]
    },
    {
      id: '2',
      title: 'Traffic Light Wisdom',
      duration: '3 min',
      category: 'educational',
      ageGroup: '4-10 years',
      description: 'Learn about traffic safety while having fun!',
      script: [
        "Did you know that traffic lights are like magical helpers on the road?",
        "Red means stop and take a deep breath, yellow means slow down and be careful...",
        "Green means go forward safely, always looking out for others...",
        "Just like Joy helps families travel safely, traffic lights help everyone share the road!"
      ]
    },
    {
      id: '3',
      title: 'Sunshine and Shade',
      duration: '4 min',
      category: 'mindfulness',
      ageGroup: '2-12 years',
      description: 'A gentle story about finding comfort and joy in different places.',
      script: [
        "Sometimes we need sunshine to feel warm and happy...",
        "And sometimes we need shade to feel cool and peaceful...",
        "Just like Rayne's Way helps us find shady spots, we can always find what we need...",
        "The most important thing is being together as a family, wherever we are!"
      ]
    },
    {
      id: '4',
      title: 'The Emergency Helper Heroes',
      duration: '4 min',
      category: 'safety',
      ageGroup: '5-12 years',
      description: 'Meet the brave helpers who keep families safe on their journeys.',
      script: [
        "In every town and on every road, there are special heroes waiting to help...",
        "Police officers, firefighters, and doctors are always ready to lend a hand...",
        "And with Joy's emergency button, help is never far away...",
        "Remember, asking for help when you need it makes you brave, not scared!"
      ]
    }
  ];

  const filteredStories = selectedCategory 
    ? stories.filter(story => story.category === selectedCategory)
    : stories;

  useEffect(() => {
    if (isPlaying && currentStory && currentLine < currentStory.script.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 3000); // 3 seconds per line
      
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStory && currentLine >= currentStory.script.length) {
      setIsPlaying(false);
      setCurrentLine(0);
    }
  }, [isPlaying, currentLine, currentStory]);

  const startStory = (story: Story) => {
    setCurrentStory(story);
    setCurrentLine(0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    if (currentStory && currentLine < currentStory.script.length - 1) {
      setCurrentLine(prev => prev + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <Card className="w-full max-w-md mx-auto mb-0 rounded-t-3xl rounded-b-none card-joy border-0 min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-secondary to-accent text-white rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">🧩 Story Mode</h3>
                <p className="text-white/80 text-sm">
                  {kidsInCarMode ? "Special stories for little adventurers!" : "Magical tales & wisdom"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Story Player */}
        {currentStory && (
          <div className="p-6 border-b border-border/50">
            <div className="text-center mb-4">
              <h4 className="font-bold text-lg mb-2">{currentStory.title}</h4>
              <Badge variant="secondary" className="bg-secondary-soft text-secondary">
                {currentStory.ageGroup}
              </Badge>
            </div>
            
            {/* Story Content */}
            <div className="bg-muted/50 p-4 rounded-lg mb-4 min-h-[100px] flex items-center justify-center">
              <p className="text-center text-foreground leading-relaxed">
                {currentStory.script[currentLine] || "Story completed! ✨"}
              </p>
            </div>
            
            {/* Progress */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentLine + 1) / currentStory.script.length) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {currentLine + 1}/{currentStory.script.length}
              </span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <Button variant="joy" size="icon" onClick={togglePlayPause} className="w-12 h-12">
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={skipToNext}>
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Story Library */}
        <div className="flex-1 p-4 overflow-y-auto">
          {!currentStory && (
            <>
              <h4 className="font-semibold mb-4">Choose Your Adventure</h4>
              
              {/* Categories */}
              <div className="flex gap-2 mb-4 overflow-x-auto">
                <Button
                  variant={selectedCategory === null ? "joy" : "joy-soft"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Stories
                </Button>
                <Button
                  variant={selectedCategory === 'adventure' ? "joy" : "joy-soft"}
                  size="sm"
                  onClick={() => setSelectedCategory('adventure')}
                >
                  🚀 Adventure
                </Button>
                <Button
                  variant={selectedCategory === 'educational' ? "joy" : "joy-soft"}
                  size="sm"
                  onClick={() => setSelectedCategory('educational')}
                >
                  🧠 Learn
                </Button>
                <Button
                  variant={selectedCategory === 'mindfulness' ? "joy" : "joy-soft"}
                  size="sm"
                  onClick={() => setSelectedCategory('mindfulness')}
                >
                  🧘 Calm
                </Button>
                <Button
                  variant={selectedCategory === 'safety' ? "joy" : "joy-soft"}
                  size="sm"
                  onClick={() => setSelectedCategory('safety')}
                >
                  🛡️ Safety
                </Button>
              </div>
            </>
          )}

          {/* Stories List */}
          <div className="space-y-3">
            {!currentStory ? (
              filteredStories.map((story) => (
                <Card key={story.id} className="p-4 cursor-pointer hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm mb-1">{story.title}</h5>
                      <p className="text-xs text-muted-foreground mb-2">{story.description}</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="text-xs">{story.duration}</Badge>
                        <Badge variant="secondary" className="text-xs">{story.ageGroup}</Badge>
                      </div>
                    </div>
                    <Button variant="joy-soft" size="sm" onClick={() => startStory(story)}>
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center">
                <Button variant="outline" onClick={() => setCurrentStory(null)}>
                  ← Back to Story Library
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}