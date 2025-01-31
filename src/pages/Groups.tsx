import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupForm } from "@/components/Groups/GroupForm";
import { GroupList } from "@/components/Groups/GroupList";

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Church Groups</h1>
        <p className="text-muted-foreground">Manage and organize church groups</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Group List</TabsTrigger>
          <TabsTrigger value="create">Create Group</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button
              variant="outline"
              onClick={() => {
                toast.info("Download functionality will be available soon");
              }}
            >
              Download List
            </Button>
          </div>
          <GroupList searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <GroupForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}