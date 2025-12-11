/**
 * Web5 Configuration
 * Handles Web5 initialization, DID management, and decentralized data storage
 */

import { Web5 } from '@web5/api';

let web5Instance: Web5 | null = null;
let userDid: string | null = null;

/**
 * Initialize Web5 connection
 * Creates or connects to existing DID
 */
export async function initializeWeb5() {
  if (web5Instance) {
    return { web5: web5Instance, did: userDid };
  }

  try {
    const { web5, did } = await Web5.connect({
      // Use local storage for development
      sync: '5s', // Sync interval
    });

    web5Instance = web5;
    userDid = did;

    // Store DID in local storage for future sessions
    if (typeof window !== 'undefined') {
      localStorage.setItem('web5_did', did);
    }

    return { web5, did };
  } catch (error) {
    console.error('Failed to initialize Web5:', error);
    throw error;
  }
}

/**
 * Get current Web5 instance
 */
export function getWeb5Instance() {
  return web5Instance;
}

/**
 * Get current user DID
 */
export function getUserDid() {
  return userDid;
}

/**
 * Reset Web5 connection
 */
export function resetWeb5() {
  web5Instance = null;
  userDid = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('web5_did');
  }
}

/**
 * Check if Web5 is initialized
 */
export function isWeb5Initialized() {
  return web5Instance !== null && userDid !== null;
}
