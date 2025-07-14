import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Users, MapPin, Eye, CheckCircle, XCircle, 
  AlertTriangle, Settings, Database, Activity 
} from 'lucide-react';

export default function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  const handleLogin = () => {
    // Simple authentication check - in real app, use proper auth
    if (loginCredentials.username === 'admin' && loginCredentials.password === 'parknjoy2024') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Park N Joy Administration</p>
          </div>
          
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={loginCredentials.username}
              onChange={(e) => setLoginCredentials(prev => ({ ...prev, username: e.target.value }))}
            />
            <Input
              type="password"
              placeholder="Password"
              value={loginCredentials.password}
              onChange={(e) => setLoginCredentials(prev => ({ ...prev, password: e.target.value }))}
            />
            <Button onClick={handleLogin} className="w-full">
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Park N Joy Administration Panel</p>
          </div>
          <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pins">Joy Pins</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold">2,847</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Joy Pins</p>
                    <p className="text-3xl font-bold">1,234</p>
                  </div>
                  <MapPin className="w-8 h-8 text-accent" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                    <p className="text-3xl font-bold">42</p>
                  </div>
                  <Eye className="w-8 h-8 text-secondary" />
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">System Health</p>
                    <p className="text-3xl font-bold text-green-600">98%</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pins">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Joy Pin Management</h3>
              <div className="space-y-4">
                {[
                  { name: "Sunshine Park Playground", status: "active", reports: 0 },
                  { name: "Shady Oaks Rest Stop", status: "pending", reports: 2 },
                  { name: "Family Fun Zone", status: "active", reports: 0 },
                  { name: "Ice Cream Dreams", status: "flagged", reports: 5 }
                ].map((pin, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{pin.name}</h4>
                      <p className="text-sm text-muted-foreground">{pin.reports} reports</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={pin.status === 'active' ? 'default' : pin.status === 'pending' ? 'secondary' : 'destructive'}>
                        {pin.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <div className="space-y-4">
                {[
                  { name: "Johnson Family", email: "johnson@email.com", level: "Explorer", status: "active" },
                  { name: "Davis Family", email: "davis@email.com", level: "Pioneer", status: "active" },
                  { name: "Wilson Family", email: "wilson@email.com", level: "Contributor", status: "suspended" }
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{user.level}</Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="moderation">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Content Moderation Queue</h3>
              <div className="space-y-4">
                {[
                  { type: "Pin Submission", content: "New playground at Central Park", user: "Smith Family", priority: "low" },
                  { type: "Photo Upload", content: "Family photo at Joy Stop", user: "Brown Family", priority: "medium" },
                  { type: "Report", content: "Inappropriate comment on pin", user: "Jones Family", priority: "high" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'secondary' : 'default'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <h4 className="font-medium">{item.content}</h4>
                      <p className="text-sm text-muted-foreground">by {item.user}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">System Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Joy Assistant Settings</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure AI Responses
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Manage Knowledge Base
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Content Moderation</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Auto-Moderation Rules
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Report Thresholds
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}