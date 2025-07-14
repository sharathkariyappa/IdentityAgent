import { createVerifiableCredentialJwt} from 'did-jwt-vc';
import type { Issuer } from 'did-jwt-vc';
import { EthrDID } from 'ethr-did';
import { ethers } from "ethers";
// import { Resolver } from "did-resolver";
// import { getResolver as ethrDidResolver } from "ethr-did-resolver";

// Configuration
// const INFURA_API_KEY = import.meta.env.VITE_NFURA_API_KEY;
const PINATA_JWT = import.meta.env.VITE_PUBLIC_PINATA_JWT;

// Types for profile data
export interface ProfileData {
  profile: {
    did: string;
    github: string;
    role: string;
    address: string;
    network: string;
    timestamp: number;
  };
  verifiableCredential: string;
  metadata: {
    created: string;
    version: string;
    type: string;
    network: string;
  };
}

export interface LoadedProfile {
  profileData: ProfileData;
  ipfsHash: string;
  gatewayUrl: string;
  verification: {
    verified: boolean;
    header?: any;
    payload?: any;
    error?: string;
  };
}

// Simplified approach: Create EthrDID with minimal configuration
export const createSimpleDID = async (network: 'sepolia' | 'mainnet') => {
  if (!window.ethereum) throw new Error("No wallet found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  // Create DID
  const did = network === 'mainnet' 
    ? `did:ethr:${address.toLowerCase()}`
    : `did:ethr:${network}:${address.toLowerCase()}`;
  
  // console.log(`Created DID: ${did}`);
  
  // Create EthrDID with the most basic configuration that should work
  const ethrDid = new EthrDID({
    identifier: address.toLowerCase(),
    provider: provider,
    txSigner: signer,
    chainNameOrId: network === 'mainnet' ? 1 : 11155111,
  });
  
  return { did, address: address.toLowerCase(), ethrDid };
};

// Alternative approach: Use ethers signer directly
export const createVCWithEthersSigner = async (
  github: string,
  role: string,
  network: 'sepolia' | 'mainnet'
) => {
  if (!window.ethereum) throw new Error("No wallet found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  const did = network === 'mainnet' 
    ? `did:ethr:${address.toLowerCase()}`
    : `did:ethr:${network}:${address.toLowerCase()}`;
  
  // console.log(`✅ Created DID: ${did}`);
  
  // Create custom signer that wraps ethers signer
  const customSigner = {
    did,
    alg: 'ES256K-R',
    signer: async (data: string | Uint8Array) => {
      try {
        // console.log(' Signing with custom signer...');
        
        // Convert to string if needed
        const message = typeof data === 'string' ? data : new TextDecoder().decode(data);
        
        // Sign with ethers
        const signature = await signer.signMessage(message);
        
        // Parse signature
        const sig = ethers.Signature.from(signature);
        
        // Create compact signature for JWT
        const r = sig.r.slice(2).padStart(64, '0');
        const s = sig.s.slice(2).padStart(64, '0');
        const v = sig.v === 27 ? 0 : 1;
        
        // Combine r, s, v
        const combined = r + s + v.toString(16).padStart(2, '0');
        
        // Convert to base64url
        const bytes = new Uint8Array(combined.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
        return btoa(String.fromCharCode(...bytes))
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '');
          
      } catch (error) {
        console.error('Signing error:', error);
        throw error;
      }
    }
  };
  
  // Create VC payload
  const vcPayload = {
    sub: did,
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1"
      ],
      type: ["VerifiableCredential", "GitHubProfileCredential"],
      credentialSubject: {
        id: did,
        github,
        role,
        address: address.toLowerCase(),
        network,
        timestamp: Math.floor(Date.now() / 1000)
      }
    }
  };
  
  // console.log('Creating VC with custom signer...');
  
  try {
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, customSigner);
    // console.log(` VC created successfully!`);
    return { vcJwt, did, address: address.toLowerCase() };
  } catch (error) {
    console.error(' VC creation failed:', error);
    throw error;
  }
};

// Method 3: Use EthrDID but with a simpler signer
export const createVCSimpleEthrDID = async (
  github: string,
  role: string,
  network: 'sepolia' | 'mainnet'
) => {
  if (!window.ethereum) throw new Error("No wallet found");
  
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  
  const did = network === 'mainnet' 
    ? `did:ethr:${address.toLowerCase()}`
    : `did:ethr:${network}:${address.toLowerCase()}`;
  
  // console.log(`Created DID: ${did}`);
  
  // Try the simplest possible EthrDID configuration
  const ethrDid = new EthrDID({
      identifier: address.toLowerCase(),
      provider: provider,
      txSigner: signer,
      chainNameOrId: network === 'mainnet' ? 1 : 11155111,
      alg: 'ES256K-R',
      signer: async (data: string | Uint8Array) => {
          const message = typeof data === 'string' ? data : new TextDecoder().decode(data);
          return signer.signMessage(message);
      }
  }) as Issuer;
  
  // Create VC payload
  const vcPayload = {
    sub: did,
    nbf: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1"
      ],
      type: ["VerifiableCredential", "GitHubProfileCredential"],
      credentialSubject: {
        id: did,
        github,
        role,
        address: address.toLowerCase(),
        network
      }
    }
  };
  
  // console.log('Creating VC with simple EthrDID...');
  
  try {
    const vcJwt = await createVerifiableCredentialJwt(vcPayload, ethrDid);
    // console.log(`VC created successfully!`);
    return { vcJwt, did, address: address.toLowerCase() };
  } catch (error) {
    console.error(' VC creation failed:', error);
    throw error;
  }
};

// Test all methods
export const testAllMethods = async (
  github: string,
  role: string,
  network: 'sepolia' | 'mainnet' 
) => {
  // console.log('Testing all VC creation methods...');
  
  const results = {
    method1: null as any,
    method2: null as any,
    method3: null as any,
    errors: [] as string[]
  };
  
  // Method 1: Custom signer
  try {
    // console.log('Testing Method 1: Custom Signer...');
    results.method1 = await createVCWithEthersSigner(github, role, network);
    console.log(' Method 1 succeeded');
  } catch (error) {
    const msg = `Method 1 failed: ${error}`;
    console.error(msg);
    results.errors.push(msg);
  }
  
  // Method 2: Simple EthrDID
  try {
    // console.log(' Testing Method 2: Simple EthrDID...');
    results.method2 = await createVCSimpleEthrDID(github, role, network);
    // console.log(' Method 2 succeeded');
  } catch (error) {
    const msg = `Method 2 failed: ${error}`;
    console.error(msg);
    results.errors.push(msg);
  }
  
  return results;
};

// Upload to IPFS (simplified)
export const uploadToIPFS = async (
  github: string,
  role: string,
  vcJwt: string,
  did: string,
  address: string,
  network: string
) => {
  if (!PINATA_JWT) {
    throw new Error('PINATA_JWT not found in environment variables');
  }
  
  const profileData = {
    profile: {
      did,
      github,
      role,
      address,
      network,
      timestamp: Date.now()
    },
    verifiableCredential: vcJwt,
    metadata: {
      created: new Date().toISOString(),
      version: '1.0.0',
      type: 'GitHubProfile',
      network
    }
  };
  
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(profileData, null, 2)], { 
    type: 'application/json' 
  });
  formData.append('file', jsonBlob, `profile-${github}-${address.slice(0, 8)}.json`);
  
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed: ${response.status} - ${errorText}`);
  }
  
  const result = await response.json();
  const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
  
  // console.log(`Profile uploaded to IPFS: ${result.IpfsHash}`);
  
  return {
    ipfsHash: result.IpfsHash,
    gatewayUrl
  };
};

export const loadProfileFromIPFS = async (ipfsHash: string): Promise<LoadedProfile> => {
  try {
    // console.log(`🔄 Loading profile from IPFS: ${ipfsHash}`);
    
    // Try multiple IPFS gateways for better reliability
    const gateways = [
      `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
      `https://ipfs.io/ipfs/${ipfsHash}`,
      `https://cloudflare-ipfs.com/ipfs/${ipfsHash}`,
      `https://dweb.link/ipfs/${ipfsHash}`
    ];
    
    let profileData: ProfileData | null = null;
    let usedGateway = '';
    
    // Try each gateway until one works
    for (const gateway of gateways) {
      try {
        // console.log(`Trying gateway: ${gateway}`);
        const response = await fetch(gateway);
        
        if (response.ok) {
          profileData = await response.json();
          usedGateway = gateway;
          // console.log(`Successfully loaded from: ${gateway}`);
          break;
        }
      } catch (error) {
        console.log(`Failed to load from: ${gateway}`);
        continue;
      }
    }
    
    if (!profileData) {
      throw new Error('Failed to load profile from all IPFS gateways');
    }
    
    // Verify the JWT
    const verification = await verifyJWTLocally(profileData.verifiableCredential);
    
    // console.log(` Profile loaded successfully for ${profileData.profile.github}`);
    
    return {
      profileData,
      ipfsHash,
      gatewayUrl: usedGateway,
      verification
    };
    
  } catch (error) {
    console.error(' Failed to load profile from IPFS:', error);
    throw error;
  }
};

// Simple verification (just parse the JWT)
export const verifyJWTLocally = async (vcJwt: string) => {
  try {
    const parts = vcJwt.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }
    
    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    
    // console.log('JWT Header:', header);
    // console.log('JWT Payload:', payload);
    
    return {
      verified: true,
      header,
      payload
    };
  } catch (error) {
    return {
      verified: false,
      error: error instanceof Error ? error.message : 'Failed to parse JWT'
    };
  }
};

// Complete workflow using the best working method
export const createProfileWorkflowSimple = async (
  github: string,
  role: string,
  network: 'sepolia' | 'mainnet'
) => {
  try {
    // console.log(' Starting simple profile workflow...');
    
    // Test methods to find working one
    const testResults = await testAllMethods(github, role, network);
    
    let vcResult;
    if (testResults.method1) {
      // console.log(' Using Method 1 (Custom Signer)');
      vcResult = testResults.method1;
    } else if (testResults.method2) {
      // console.log(' Using Method 2 (Simple EthrDID)');
      vcResult = testResults.method2;
    } else {
      throw new Error('All VC creation methods failed: ' + testResults.errors.join(', '));
    }
    
    // Upload to IPFS
    // console.log(' Uploading to IPFS...');
    const ipfsResult = await uploadToIPFS(
      github, 
      role, 
      vcResult.vcJwt, 
      vcResult.did, 
      vcResult.address, 
      network
    );
    
    // Verify locally
    // console.log(' Verifying JWT locally...');
    const verifyResult = await verifyJWTLocally(vcResult.vcJwt);
    
    // console.log(' Simple workflow completed!');
    
    return {
      ...vcResult,
      ...ipfsResult,
      verification: verifyResult
    };
    
  } catch (error) {
    console.error(' Simple workflow failed:', error);
    throw error;
  }
};
