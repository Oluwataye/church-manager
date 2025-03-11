
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function IncomeList() {
  const { data: incomes = [], isLoading } = useQuery({
    queryKey: ['incomes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incomes')
        .select('*')
        .order('date', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Service Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{format(new Date(item.date), "PPP")}</TableCell>
              <TableCell>{item.service_type}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell className="text-right">₦{Number(item.amount).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
