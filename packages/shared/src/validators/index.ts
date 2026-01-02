export function validate(data: any, fields: string[]): void {
  const missing = fields.filter((f) => !data[f]);
  if (missing.length) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}

export function validateEmail(email: string): string {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    throw new Error('Invalid email format');
  }
  return email.toLowerCase().trim();
}

export function sanitize(str: string): string {
  return String(str).trim();
}

export function validateProduct(productId: string, validProducts: readonly string[]): void {
  if (!validProducts.includes(productId)) {
    throw new Error(`Invalid product: ${productId}`);
  }
}

export function validateDays(days: number): number {
  const num = parseInt(String(days));
  if (isNaN(num) || num < -3650 || num > 3650 || num === 0) {
    throw new Error('Days must be between -3650 and 3650 (not 0)');
  }
  return num;
}

export function sendError(res: any, statusCode: number, message: string) {
  res.status(statusCode).json({ success: false, error: message });
}

export function sendSuccess(res: any, data: any) {
  res.status(200).json({ success: true, ...data });
}
