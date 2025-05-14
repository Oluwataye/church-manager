
import { useChurchName } from "@/hooks/useChurchName";

export function ChurchHeader() {
  const { churchName } = useChurchName();
  
  return (
    <div className="text-center mb-2">
      <h1 className="text-2xl font-bold tracking-tight">{churchName}</h1>
    </div>
  );
}
