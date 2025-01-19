import { Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertDemo() {
  return (
    <Alert className="max-w-[300px] my-6">
      <Terminal className="h-4 w-4" />
      <AlertTitle>Oooopsss!</AlertTitle>
      <AlertDescription>No collections yet here!!!</AlertDescription>
    </Alert>
  );
}
