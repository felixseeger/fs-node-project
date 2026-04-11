import { Timestamp } from 'firebase/firestore';

/**
 * User roles for access control
 */
export type UserRole = 'user' | 'admin';

/**
 * User display preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  language: string;
}

/**
 * Core User interface - represents a user profile in Firestore
 */
export interface UserProfile {
  uid: string;           // Maps to Firebase Auth UID
  email: string;         // User email from Auth
  displayName: string;   // Full name or username
  photoURL?: string;     // URL to avatar image in Storage
  avatarPath?: string;   // Internal path in Storage (e.g., 'avatars/{userId}.jpg')
  bio?: string;          // Short user biography
  preferences: UserPreferences;
  role: UserRole;
  createdAt: string;     // ISO String for frontend
  updatedAt: string;     // ISO String for frontend
  lastLogin?: string;    // ISO String for frontend
  isDeleted: boolean;
}

/**
 * Firestore User document shape (before deserialization)
 */
export interface FirestoreUserDocument {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  avatarPath?: string;
  bio?: string;
  preferences: UserPreferences;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin?: Timestamp;
  isDeleted: boolean;
}

/**
 * Payload for updating user profile
 */
export interface UpdateProfilePayload {
  displayName?: string;
  photoURL?: string;
  avatarPath?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}
