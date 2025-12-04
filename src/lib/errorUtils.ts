/**
 * Extract a clean, user-friendly error message from an Error object
 * Handles cases where the error message contains JSON strings
 */
export function getCleanErrorMessage(error: Error | unknown, fallback: string = "An error occurred"): string {
  if (!error) return fallback;
  
  const errorMsg = error instanceof Error ? error.message : String(error);
  
  // If message contains JSON, try to parse it and extract the message field
  if (errorMsg.includes('{') && errorMsg.includes('}')) {
    try {
      const jsonMatch = errorMsg.match(/\{.*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.message || parsed.error || errorMsg;
      }
    } catch {
      // If parsing fails, return the original message
    }
  }
  
  return errorMsg || fallback;
}
