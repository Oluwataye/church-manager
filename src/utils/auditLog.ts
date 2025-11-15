import { supabase } from "@/integrations/supabase/client";

export interface AuditLogData {
  action: string;
  table_name?: string;
  record_id?: string;
  old_data?: any;
  new_data?: any;
}

/**
 * Creates an audit log entry for sensitive operations
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke('audit-log', {
      body: data,
    });

    if (error) {
      console.error('Failed to create audit log:', error);
    }
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

/**
 * Helper function to create audit logs for member operations
 */
export async function auditMemberOperation(
  action: 'create' | 'update' | 'delete',
  memberId: string,
  oldData?: any,
  newData?: any
): Promise<void> {
  await createAuditLog({
    action: `member_${action}`,
    table_name: 'members',
    record_id: memberId,
    old_data: oldData,
    new_data: newData,
  });
}

/**
 * Helper function to create audit logs for income operations
 */
export async function auditIncomeOperation(
  action: 'create' | 'update' | 'delete',
  incomeId: string,
  oldData?: any,
  newData?: any
): Promise<void> {
  await createAuditLog({
    action: `income_${action}`,
    table_name: 'incomes',
    record_id: incomeId,
    old_data: oldData,
    new_data: newData,
  });
}

/**
 * Helper function to create audit logs for tithe operations
 */
export async function auditTitheOperation(
  action: 'create' | 'update' | 'delete',
  titheId: string,
  oldData?: any,
  newData?: any
): Promise<void> {
  await createAuditLog({
    action: `tithe_${action}`,
    table_name: 'tithes',
    record_id: titheId,
    old_data: oldData,
    new_data: newData,
  });
}

/**
 * Helper function to create audit logs for authentication events
 */
export async function auditAuthEvent(
  action: 'login' | 'logout' | 'signup' | 'password_reset',
  userId?: string,
  details?: any
): Promise<void> {
  await createAuditLog({
    action: `auth_${action}`,
    record_id: userId,
    new_data: details,
  });
}