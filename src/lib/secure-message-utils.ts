
'use server';

/**
 * @fileOverview Utility functions for mock encryption and decryption for the Secure Message Demo.
 * NOTE: This is NOT real cryptography and should NOT be used for actual secure communication.
 * It's for demonstration purposes only.
 */

/**
 * Mock encrypts a message using a key.
 * Each character in the message is shifted by the corresponding character in the key (repeated if necessary).
 * @param message The plain text message.
 * @param key The secret key.
 * @returns The mock encrypted message.
 */
export function encryptMessage(message: string, key: string): string {
  if (!key) return message; // No encryption if key is empty
  let encryptedText = '';
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    const keyCode = key.charCodeAt(i % key.length);
    // Simple shift, ensuring it stays within displayable ASCII range for demo purposes if desired
    // or just do a direct char code manipulation.
    // For this demo, we'll do a simple XOR which is easily reversible.
    encryptedText += String.fromCharCode(charCode ^ keyCode);
  }
  // To make it look more "encrypted" for display, convert to hex
  return Buffer.from(encryptedText, 'utf-8').toString('hex');
}

/**
 * Mock decrypts a message using a key.
 * Reverses the mock encryption process.
 * @param encryptedHex The mock encrypted message in hex format.
 * @param key The secret key.
 * @returns The decrypted (original) message.
 */
export function decryptMessage(encryptedHex: string, key: string): string {
  if (!key) return encryptedHex; // No decryption if key is empty

  try {
    const encryptedText = Buffer.from(encryptedHex, 'hex').toString('utf-8');
    let decryptedText = '';
    for (let i = 0; i < encryptedText.length; i++) {
      const charCode = encryptedText.charCodeAt(i);
      const keyCode = key.charCodeAt(i % key.length);
      decryptedText += String.fromCharCode(charCode ^ keyCode);
    }
    return decryptedText;
  } catch (error) {
    console.error("Decryption error:", error);
    return "Error: Could not decrypt message. Key might be incorrect or message corrupted.";
  }
}
