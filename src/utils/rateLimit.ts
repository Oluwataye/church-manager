import { supabase } from "@/integrations/supabase/client";

export interface RateLimitResult {
  allowed: boolean;
  current_count?: number;
  max_requests?: number;
  retry_after?: number;
}

/**
 * Checks if the current request is within rate limits
 */
export async function checkRateLimit(
  endpoint: string,
  category: 'auth' | 'validation' | 'default' = 'default'
): Promise<RateLimitResult> {
  try {
    const { data, error } = await supabase.functions.invoke('rate-limit', {
      body: { endpoint, category },
    });

    if (error) {
      console.error('Rate limit check failed:', error);
      // Fail open - allow request if rate limit check fails
      return { allowed: true };
    }

    return data as RateLimitResult;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    // Fail open - allow request if rate limit check fails
    return { allowed: true };
  }
}

/**
 * Handles rate limit errors by showing user-friendly messages
 */
export function handleRateLimitError(result: RateLimitResult): string {
  if (result.retry_after) {
    const minutes = Math.ceil(result.retry_after / 60);
    return `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`;
  }
  return 'Too many requests. Please try again later.';
}