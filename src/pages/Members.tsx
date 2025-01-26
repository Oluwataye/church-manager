import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { MemberRegistrationForm } from "@/components/Members/MemberRegistrationForm";

interface Member {
  id: string;
  familyName: string;
  individualNames: string;
  maritalStatus: string;
  numberOfChildren: number;
  foundationClassDate: string;
  baptism: string;
  baptismYear: string;
  wofbiClass: string;
  joiningLocation: string;
  profilePhoto?: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const { toast } = useToast();

  const filteredMembers = members.filter(
    (member) =>
      member.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.individualNames.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = (newMember: Omit<Member, "id">) => {
    const member = {
      ...newMember,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMembers([...members, member]);
    setShowRegistrationForm(false);
    toast({
      title: "Success!",
      description: "Member has been registered successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-church-600">Church Members</h1>
        <Button onClick={() => setShowRegistrationForm(true)}>
          Add New Member
        </Button>
      </div>

      {showRegistrationForm ? (
        <Card className="p-6">
          <MemberRegistrationForm
            onSubmit={handleAddMember}
            onCancel={() => setShowRegistrationForm(false)}
          />
        </Card>
      ) : (
        <>
          <div className="max-w-md">
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <Card key={member.id} className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-church-100 rounded-full flex items-center justify-center">
                      {member.profilePhoto ? (
                        <img
                          src={member.profilePhoto}
                          alt={member.familyName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-church-600">
                          {member.familyName[0]}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{member.familyName}</h3>
                      <p className="text-sm text-gray-500">
                        {member.individualNames}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">
                No members found
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}