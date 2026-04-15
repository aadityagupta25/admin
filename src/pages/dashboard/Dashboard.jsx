import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Video, Music, PartyPopper, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "10,482",
      icon: Users,
      trend: "+20.1%",
      trendUp: true,
      description: "from last month",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Active Live Streams",
      value: "235",
      icon: Video,
      trend: "+180.1%",
      trendUp: true,
      description: "from last month",
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    {
      title: "Sound Effects",
      value: "1,203",
      icon: Music,
      trend: "+19%",
      trendUp: false,
      description: "from last month",
      color: "text-violet-500",
      bg: "bg-violet-500/10"
    },
    {
      title: "Active Parties",
      value: "573",
      icon: PartyPopper,
      trend: "+201",
      trendUp: true,
      description: "since last hour",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">Dashboard</h2>
        <p className="text-muted-foreground mt-1">Overview of your platform's performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={cn("p-2 rounded-full", stat.bg)}>
                <stat.icon className={cn("h-4 w-4", stat.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className={cn("flex items-center font-medium", stat.trendUp ? "text-green-500" : "text-red-500")}>
                  {stat.trendUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                  {stat.trend}
                </span>
                <span className="ml-1">{stat.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for Recent Activity or Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Monthly active user growth.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2 h-[300px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-md mx-6 mb-6">
            Chart Placeholder
          </CardContent>
        </Card>
        <Card className="col-span-3 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest token purchases or subscriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">U{i}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">User {i}</p>
                    <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;