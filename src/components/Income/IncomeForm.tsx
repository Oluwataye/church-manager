
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormDatePicker } from "./Form/FormDatePicker";
import { FormCategorySelect } from "./Form/FormCategorySelect";
import { FormTextInput } from "./Form/FormTextInput";
import { useIncomeForm } from "./Form/useIncomeForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

export function IncomeForm() {
  const { form, onSubmit, isPending } = useIncomeForm();
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const category = form.watch("category");
  const isTithe = category === "tithe";

  useEffect(() => {
    if (isTithe) {
      fetchMembers();
    }
  }, [isTithe]);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      // Check if we're in Electron mode
      const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
      
      if (isElectron) {
        // For Electron, fetch from local API
        const response = await fetch(`${window.electronAPI?.apiBaseUrl}/members`);
        if (!response.ok) throw new Error('Failed to fetch members');
        
        const data = await response.json();
        setMembers(data);
      } else {
        // For web, use Supabase
        const { data, error } = await supabase
          .from('members')
          .select('id, family_name, individual_names')
          .order('family_name', { ascending: true });
        
        if (error) throw error;
        setMembers(data || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record New Income</CardTitle>
        <CardDescription>Record a new income transaction for the church</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormDatePicker
              form={form}
              name="date"
              label="Date"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormCategorySelect
                form={form}
                name="serviceType"
                label="Service Type"
                selectType="service"
              />

              <FormCategorySelect
                form={form}
                name="category"
                label="Income Category"
                selectType="category"
              />
            </div>

            {isTithe && (
              <div className="space-y-2">
                <Label htmlFor="member_id">Member</Label>
                <Select
                  disabled={loadingMembers}
                  onValueChange={(value) => form.setValue("member_id", value)}
                >
                  <SelectTrigger id="member_id" className="w-full">
                    <SelectValue placeholder={loadingMembers ? "Loading members..." : "Select member"} />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.family_name} {member.individual_names}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.member_id && (
                  <p className="text-sm text-destructive">{form.formState.errors.member_id.message}</p>
                )}
              </div>
            )}

            <FormTextInput
              form={form}
              name="amount"
              label="Amount (₦)"
              type="number"
            />

            <FormTextInput
              form={form}
              name="description"
              label="Description (Optional)"
              type="text"
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Income Record"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
