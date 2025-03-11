
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface MemberSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MemberSearch({ searchQuery, onSearchChange }: MemberSearchProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
