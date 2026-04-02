/**
 * Configuration
 */

export { NODE_MENU, DEFAULT_NODES, getNodeDefaults } from './nodeMenu';
export type { NodeMenuSection, NodeMenuItem } from '../types';

// Firebase configuration
export {
  initializeFirebase,
  getDb,
  getFirebaseAuth,
  getFirebaseStorage,
  isFirebaseConfigured,
  enableOfflinePersistence,
} from './firebase';

export default {};
