export interface AuditEntry {
  id: string;
  action: string;
  details: string;
  userName: string;
  userId: string;
  timestamp: number;
}

function getCurrentUser(): { id: string; name: string } {
  try {
    const data = localStorage.getItem("auth_user");

    if (data) {
      const user = JSON.parse(data);
      return { id: user.id, name: user.name };
    }
  } catch {
    // ignore
  }

  return { id: "system", name: "Sistema" };
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

  if (log.length > 500) log.length = 500;

  localStorage.setItem("audit_log", JSON.stringify(log));
}

export function getAuditLog(): AuditEntry[] {
  try {
    const data = localStorage.getItem("audit_log");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
