import { Input } from "@/components/ui/input";

interface MemberSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MemberSearch({ searchQuery, onSearchChange }: MemberSearchProps) {
  return (
    <div className="max-w-md">
      <Input
        placeholder="Search members..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
}