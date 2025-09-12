import crypto from "node:crypto"

function decodeKeyToBytes(keyString: string): Buffer {
  const trimmed = keyString.trim()
  // Try base64 first
  try {
    const b64 = Buffer.from(trimmed, "base64")
    if (b64.length === 32) return b64
  } catch {}
  // Fallback to hex
  const hex = Buffer.from(trimmed.replace(/^0x/, ""), "hex")
  if (hex.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (256-bit) in hex or base64")
  }
  return hex
}

export function encryptAesGcm(plaintext: string): string {
  const keyStr = process.env.ENCRYPTION_KEY
  if (!keyStr) throw new Error("Missing ENCRYPTION_KEY")
  const key = decodeKeyToBytes(keyStr)
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv)
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  // Store as base64: iv|tag|ciphertext
  return Buffer.concat([iv, tag, ciphertext]).toString("base64")
}

export function decryptAesGcm(blobB64: string): string {
  const keyStr = process.env.ENCRYPTION_KEY
  if (!keyStr) throw new Error("Missing ENCRYPTION_KEY")
  const key = decodeKeyToBytes(keyStr)
  const raw = Buffer.from(blobB64, "base64")
  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const ciphertext = raw.subarray(28)
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv)
  decipher.setAuthTag(tag)
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  return plain.toString("utf8")
}

