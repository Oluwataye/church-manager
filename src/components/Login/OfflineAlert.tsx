
import { Alert, AlertDescription } from "@/components/ui/alert";

export function OfflineAlert() {
  return (
    <Alert className="mb-4" variant="destructive">
      <AlertDescription>
        You are currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  );
}
