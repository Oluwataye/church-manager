
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

type Tithe = {
  id: string;
  date: string;
  service_type: string;
  amount: number;
};

type Member = {
  id: string;
  family_name: string;
  individual_names: string;
};

interface TithesListProps {
  isLoading: boolean;
  tithes: Tithe[];
  selectedMember: Member | undefined;
}

export function TithesList({ isLoading, tithes, selectedMember }: TithesListProps) {
  if (!selectedMember) return null;

  const memberFullName = `${selectedMember.family_name} ${selectedMember.individual_names}`;
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Tithe Records for {memberFullName}
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : tithes.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tithes.map((tithe) => (
                <TableRow key={tithe.id}>
                  <TableCell>{format(new Date(tithe.date), "PPP")}</TableCell>
                  <TableCell>{tithe.service_type}</TableCell>
                  <TableCell className="text-right font-medium">
                    ₦{tithe.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-medium">
                <TableCell colSpan={2} className="text-right">Total:</TableCell>
                <TableCell className="text-right">
                  ₦{tithes.reduce((sum, tithe) => sum + Number(tithe.amount), 0).toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No tithe records found for this member</p>
        </div>
      )}
    </div>
  );
}
