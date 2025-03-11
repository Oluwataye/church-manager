import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeList } from "@/components/Income/IncomeList";
import { TitheTracker } from "@/components/Income/TitheTracker";
import { IncomeChart } from "@/components/Income/IncomeChart";

const Income = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-3xl font-bold">Income Management</h1>
        <p className="text-muted-foreground">Track and manage church income and tithes</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="record">Record Income</TabsTrigger>
          <TabsTrigger value="tithe">Tithe Tracker</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4">
              <h3 className="font-semibold">Total Income (This Month)</h3>
              <p className="text-2xl font-bold text-green-600">₦1,234,567</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Total Tithes (This Month)</h3>
              <p className="text-2xl font-bold text-green-600">₦234,567</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Special Offerings</h3>
              <p className="text-2xl font-bold text-green-600">₦123,456</p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Project Offerings</h3>
              <p className="text-2xl font-bold text-green-600">₦345,678</p>
            </Card>
          </div>

          <div className="grid gap-6 grid-cols-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Income Analysis</h3>
              <div className="h-[400px]">
                <IncomeChart />
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Recent Income Records</h3>
              <IncomeList />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="record">
          <Card className="p-6">
            <IncomeForm />
          </Card>
        </TabsContent>

        <TabsContent value="tithe">
          <TitheTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Income;
