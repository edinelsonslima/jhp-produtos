import { authStore } from "@/hooks/useAuth";
import { storage } from "./utils";

export interface AuditEntry {
  id: string;
  action: string;
  details: string;
  userName: string;
  userId: string;
  timestamp: number;
}

export const auditStorage = storage(["audit-log"]);

function getCurrentUser() {
  const user = authStore.action.getCurrentUser();

  if (!user) {
    return { id: "system", name: "Sistema" };
  }

  return { id: user.id, name: user.name };
}

export function logAudit(action: string, details: string) {
  const user = getCurrentUser();
  const entry: AuditEntry = {
    id: crypto.randomUUID(),
    action,
    details,
    userName: user.name,
    userId: user.id,
    timestamp: Date.now(),
  };

  const log = getAuditLog();
  log.unshift(entry);

  if (log.length > 500) {
    log.length = 500;
  }

  auditStorage.save("audit-log", log);
}

export function getAuditLog() {
  return auditStorage.load<AuditEntry[]>("audit-log", []);
}
