/**
 * Hash
 * @param data String
 * @returns Hashed string
 */
export const hash = async (data: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
  const hex = Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return hex;
};

/**
 * Generate salt
 * @param length Length of the salt
 * @returns Salt
 */
export const generateSalt = async (length = 16): Promise<string> => {
  if (length < 8 || length > 64)
    throw new Error('The length of the salt must be between 8 and 64 bytes');

  const saltArray = crypto.getRandomValues(new Uint8Array(length));
  const saltHex = Array.from(saltArray)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
  return saltHex;
};
