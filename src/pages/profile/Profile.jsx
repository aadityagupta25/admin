import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/context/AuthContext';
import { Camera, MapPin, Link as LinkIcon, Twitter, Github } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
    const { user } = useAuth();

    const handleUpdate = () => {
        toast.success("Profile updated successfully.");
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground mt-1">Manage your public profile and details.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-12">
                {/* Sidebar / User Card */}
                <div className="md:col-span-4 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="h-32 bg-primary/10 relative">
                            <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-primary hover:bg-white/20">
                                <Camera className="w-4 h-4" />
                            </Button>
                        </div>
                        <CardContent className="relative pt-0 text-center pb-8">
                            <Avatar className="w-24 h-24 border-4 border-background mx-auto -mt-12 bg-background">
                                <AvatarImage src="/avatars/01.png" />
                                <AvatarFallback className="text-2xl">AD</AvatarFallback>
                            </Avatar>
                            <div className="mt-4">
                                <h3 className="text-xl font-bold">{user?.name || 'Admin User'}</h3>
                                <p className="text-sm text-muted-foreground">Product Designer & Developer</p>
                            </div>

                            <div className="mt-6 flex justify-center gap-4">
                                <div className="text-center">
                                    <div className="font-bold text-lg">254</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Posts</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">12K</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-bold text-lg">1.2K</div>
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">About</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-2" />
                                San Francisco, CA
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <LinkIcon className="w-4 h-4 mr-2" />
                                <a href="#" className="hover:underline hover:text-primary">pololive.com</a>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Twitter className="w-4 h-4 mr-2" />
                                <a href="#" className="hover:underline hover:text-primary">@pololive_admin</a>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content / Edit Form */}
                <div className="md:col-span-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Profile</CardTitle>
                            <CardDescription>Update your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstname">First name</Label>
                                        <Input id="firstname" defaultValue="Admin" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Last name</Label>
                                        <Input id="lastname" defaultValue="User" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue={user?.email || 'admin@example.com'} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Input id="bio" className="h-24" placeholder="Write a short bio about yourself..." />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleUpdate}>Save Changes</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;
