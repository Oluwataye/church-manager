
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { TitheForm } from "./TitheForm";
import { MemberTitheHistory } from "./MemberTitheHistory";

export function TitheTracker() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="record">Record Tithe</TabsTrigger>
          <TabsTrigger value="history">Tithe History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="record" className="space-y-4">
          <Card className="p-6">
            <TitheForm />
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <MemberTitheHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
