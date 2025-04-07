
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface MemberSearchProps {
  isLoading: boolean;
  onSearch: (searchTerm: string) => void;
}

export function MemberSearch({ isLoading, onSearch }: MemberSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex-1 space-y-2">
      <label htmlFor="member-search" className="text-sm font-medium">Search Member</label>
      <div className="flex items-center space-x-2">
        <Input
          id="member-search"
          placeholder="Enter member name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button 
          onClick={handleSearch} 
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          <span>Search</span>
        </Button>
      </div>
    </div>
  );
}
