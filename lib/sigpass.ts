/**
 * SIGPASS
 * 
 */

// evm
import { mnemonicToAccount } from 'viem/accounts'
// bip39
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

/**
 * Use WebAuthn to store authentication-protected arbitrary bytes
 *
 * @param name user-friendly name for the data
 * @param data arbitrary data of 64 bytes or less
 * @returns handle to the data
 */
async function createOrThrow(name: string, data: Uint8Array) {
  try {
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
        rp: {
          id: location.hostname,
          name: location.hostname,
        },
        user: {
          id: data,
          name: name,
          displayName: name,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -8 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          residentKey: "required",
          requireResidentKey: true,
        },
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Uint8Array((credential as any).rawId);
  } catch (error) {
    console.error(error);
    return null;
  }
}


/**
 * Use WebAuthn to retrieve authentication-protected arbitrary bytes
 *
 * @param id handle to the data
 * @returns data
 */
async function getOrThrow(id: Uint8Array) {
  try {
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
        allowCredentials: [{ type: "public-key", id }],
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Uint8Array((credential as any).response.userHandle);
  } catch (error) {
    console.error(error);
    return null;
  }
}


/**
 * Check if WebAuthn is supported
 * 
 * @returns boolean
 */
function checkBrowserWebAuthnSupport(): boolean {

  if (!navigator.credentials) {
    return false;
  }

  return true;
}

async function createSigpassWallet(name: string) {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  /**
   * Store the private key into authenticated storage
   */
  const handle = await createOrThrow(name, bytes);
  /**
   * Store the handle to the private key into some unauthenticated storage
   */
  if (!handle) {
    return null;
  }
  const cache = await caches.open("sigpass-storage");
  const request = new Request("sigpass");
  const response = new Response(handle);
  await cache.put(request, response);
  localStorage.setItem("SIGPASS_STATUS", "TRUE");

  // Return the handle
  if (handle) {
    return handle;
  } else {
    return null;
  }
}

async function checkSigpassWallet() {
  /**
   * Retrieve the handle to the private key from some unauthenticated storage
   */
  const status: string | null = localStorage.getItem("SIGPASS_STATUS");

  if (status) {
    return true;
  } else {
    return false;
  }
}

async function getSigpassWallet() {
  /**
   * Retrieve the handle to the private key from some unauthenticated storage
   */
  const cache = await caches.open("sigpass-storage");
  const request = new Request("sigpass");
  const response = await cache.match(request);
  const handle = response
    ? new Uint8Array(await response.arrayBuffer())
    : new Uint8Array();
  /**
   * Retrieve the private key from authenticated storage
   */
  const bytes = await getOrThrow(handle);
  if (!bytes) {
    return null;
  }
  const mnemonicPhrase = bip39.entropyToMnemonic(bytes, wordlist);
  // const privateKey = fromBytes(bytes, "hex");
  if (mnemonicPhrase) {
    // const account = privateKeyToAccount(privateKey as Address);
    // derive the evm account from mnemonic
    const evmAccount = mnemonicToAccount(mnemonicPhrase,
      {
        accountIndex: 0,
        addressIndex: 0,
      }
    );
    return evmAccount;
  } else {
    return null;
  }
}

async function encrypt(data: Uint8Array, password: string): Promise<ArrayBuffer | null> {
  try {
    // Convert password to key using PBKDF2
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    
    // Derive an AES-GCM key using PBKDF2
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 310000, // High iteration count for security
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // Encrypt the data
    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      data
    );

    // Combine salt + iv + encrypted data into single buffer
    const result = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    return result.buffer;
  } catch (err) {
    console.error('Encryption failed:', err);
    return null;
  }
}

async function decrypt(encryptedData: ArrayBuffer, password: string): Promise<Uint8Array | null> {
  try {
    // Extract salt, iv and encrypted data
    const salt = new Uint8Array(encryptedData.slice(0, 16));
    const iv = new Uint8Array(encryptedData.slice(16, 28));
    const data = new Uint8Array(encryptedData.slice(28));

    // Recreate key using same process
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      "PBKDF2",
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 310000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    // Decrypt
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      data
    );

    return new Uint8Array(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    return null;
  }
}


export { createOrThrow, getOrThrow, checkBrowserWebAuthnSupport, createSigpassWallet, getSigpassWallet, checkSigpassWallet, encrypt, decrypt };

