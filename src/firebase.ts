import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let app;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseSupported = false;

// Check if we have valid non-placeholder configurations
const isConfigValid = 
  firebaseConfig && 
  firebaseConfig.apiKey && 
  !firebaseConfig.apiKey.includes('Placeholder') && 
  !firebaseConfig.apiKey.includes('FakeKey');

try {
  if (isConfigValid) {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseSupported = true;
    console.log('🔥 Firebase successfully initialized and connected.');
  } else {
    console.warn('⚠️ Placeholder Firebase configuration detected. Running in high-fidelity offline mode.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase SDK:', error);
  isFirebaseSupported = false;
}

// Global Compliance Error Handler conforming to the Firebase Integration Skill instructions
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const currentAuth = auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid || null,
      email: currentAuth?.currentUser?.email || null,
      emailVerified: currentAuth?.currentUser?.emailVerified || null,
      isAnonymous: currentAuth?.currentUser?.isAnonymous || null,
      tenantId: currentAuth?.currentUser?.tenantId || null,
      providerInfo: currentAuth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  console.error('Firestore ABAC Violation Info: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on startup as required by the instruction
if (isFirebaseSupported && db) {
  const testConn = async () => {
    try {
      await getDocFromServer(doc(db!, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error("Please check your Firebase configuration or network status.");
      }
    }
  };
  testConn();
}

export { db, auth, isFirebaseSupported };
export { signInWithPopup, GoogleAuthProvider, signOut };
