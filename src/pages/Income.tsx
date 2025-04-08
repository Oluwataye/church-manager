
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeList } from "@/components/Income/IncomeList";
import { TitheTracker } from "@/components/Income/TitheTracker";
import { IncomeChart } from "@/components/Income/IncomeChart";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const Income = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [monthlyStats, setMonthlyStats] = useState({
    totalIncome: 0,
    totalTithes: 0,
    specialOfferings: 0,
    projectOfferings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;
      
      if (isElectron) {
        // For Electron, fetch from local API
        const response = await fetch(`${window.electronAPI?.apiBaseUrl}/income`);
        if (!response.ok) throw new Error('Failed to fetch income stats');
        
        const allIncome = await response.json();
        
        // Filter for current month
        const currentMonthIncome = allIncome.filter((income: any) => {
          const incomeDate = new Date(income.date);
          return incomeDate >= startOfMonth;
        });
        
        // Calculate statistics
        const totalIncome = currentMonthIncome.reduce((sum: number, income: any) => 
          sum + parseFloat(income.amount), 0);
          
        const totalTithes = currentMonthIncome
          .filter((income: any) => income.category === 'tithe')
          .reduce((sum: number, income: any) => sum + parseFloat(income.amount), 0);
          
        const specialOfferings = currentMonthIncome
          .filter((income: any) => income.category === 'thanksgiving' || income.category === 'prophet')
          .reduce((sum: number, income: any) => sum + parseFloat(income.amount), 0);
          
        const projectOfferings = currentMonthIncome
          .filter((income: any) => income.category === 'project')
          .reduce((sum: number, income: any) => sum + parseFloat(income.amount), 0);
        
        setMonthlyStats({
          totalIncome,
          totalTithes,
          specialOfferings,
          projectOfferings
        });
      } else {
        // For web, use Supabase
        const formattedStartOfMonth = format(startOfMonth, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from('incomes')
          .select('*')
          .gte('date', formattedStartOfMonth);
        
        if (error) throw error;
        
        if (data) {
          const totalIncome = data.reduce((sum, income) => 
            sum + parseFloat(income.amount.toString()), 0);
            
          const totalTithes = data
            .filter(income => income.category === 'tithe')
            .reduce((sum, income) => sum + parseFloat(income.amount.toString()), 0);
            
          const specialOfferings = data
            .filter(income => income.category === 'thanksgiving' || income.category === 'prophet')
            .reduce((sum, income) => sum + parseFloat(income.amount.toString()), 0);
            
          const projectOfferings = data
            .filter(income => income.category === 'project')
            .reduce((sum, income) => sum + parseFloat(income.amount.toString()), 0);
          
          setMonthlyStats({
            totalIncome,
            totalTithes,
            specialOfferings,
            projectOfferings
          });
        }
      }
    } catch (error) {
      console.error('Error fetching income stats:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
              <p className="text-2xl font-bold text-green-600">
                ₦{isLoading ? "..." : monthlyStats.totalIncome.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Total Tithes (This Month)</h3>
              <p className="text-2xl font-bold text-green-600">
                ₦{isLoading ? "..." : monthlyStats.totalTithes.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Special Offerings</h3>
              <p className="text-2xl font-bold text-green-600">
                ₦{isLoading ? "..." : monthlyStats.specialOfferings.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold">Project Offerings</h3>
              <p className="text-2xl font-bold text-green-600">
                ₦{isLoading ? "..." : monthlyStats.projectOfferings.toLocaleString()}
              </p>
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
