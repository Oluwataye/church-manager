
import { useState, useEffect } from "react";
import { useMemberTithes } from "@/hooks/useMemberTithes";
import { MemberSearch } from "./MemberSearch";
import { MembersList } from "./MembersList";
import { TithesList } from "./TithesList";
import { ReportActions } from "./ReportActions";

export function TitheTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const { 
    members, 
    tithes, 
    isLoading, 
    searchMembers, 
    fetchMemberTithes 
  } = useMemberTithes();

  useEffect(() => {
    // Initial search with empty term loads all members
    searchMembers("");
  }, [searchMembers]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchMembers(term);
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    fetchMemberTithes(memberId);
  };

  // Find the selected member from the members array
  const selectedMember = members.find(m => m.id === selectedMemberId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-y-0 md:space-x-4">
        <MemberSearch 
          isLoading={isLoading} 
          onSearch={handleSearch} 
        />
        
        <ReportActions 
          selectedMemberId={selectedMemberId}
          tithes={tithes}
          members={members}
        />
      </div>

      <div className="space-y-6">
        <MembersList 
          members={members}
          selectedMemberId={selectedMemberId}
          onSelectMember={handleSelectMember}
        />

        {selectedMemberId && (
          <TithesList 
            isLoading={isLoading}
            tithes={tithes}
            selectedMember={selectedMember}
          />
        )}
      </div>
    </div>
  );
}
