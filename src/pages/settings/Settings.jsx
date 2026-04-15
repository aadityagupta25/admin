import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Lock, Globe, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
    const handleSave = () => {
        toast.success("Settings saved successfully.");
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground mt-1">Manage your platform preferences.</p>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="general">
                        <Globe className="w-4 h-4 mr-2" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-4 h-4 mr-2" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general">
                    <Card>
                        <CardHeader>
                            <CardTitle>Global Settings</CardTitle>
                            <CardDescription>Configure general platform information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="siteName">Site Name</Label>
                                <Input id="siteName" defaultValue="Polo Live" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="supportEmail">Support Email</Label>
                                <Input id="supportEmail" type="email" defaultValue="support@pololive.com" />
                            </div>
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Maintenance Mode</Label>
                                    <p className="text-sm text-muted-foreground">Disable access to the platform for all users.</p>
                                </div>
                                <Switch />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSave}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose what you want to be notified about.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="new-user" className="flex flex-col space-y-1">
                                    <span>New User Signups</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive an email when a new user registers.</span>
                                </Label>
                                <Switch id="new-user" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="reports" className="flex flex-col space-y-1">
                                    <span>Content Reports</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive usage reports and analytics.</span>
                                </Label>
                                <Switch id="reports" defaultChecked />
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label>Current Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label>New Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label>Confirm Password</Label>
                                <Input type="password" />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleSave}>Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
