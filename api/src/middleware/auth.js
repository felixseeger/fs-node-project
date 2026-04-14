/**
 * Authentication Middleware
 * Verifies Firebase ID tokens and attaches user to request
 */
import { verifyIdToken, ensureUserInFirestore } from '../services/authService.js';

/**
 * Express middleware to authenticate requests with Firebase ID token
 * Expects Authorization header: "Bearer <firebase_id_token>"
 */
export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization header provided',
      });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization format. Use: Bearer <token>',
      });
    }

    const token = parts[1];
    const decodedToken = await verifyIdToken(token);

    // Ensure user exists in Firestore
    const user = await ensureUserInFirestore(decodedToken);

    // Attach user to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      displayName: decodedToken.name,
      photoURL: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
    };

    req.token = decodedToken;

    next();
  } catch (error) {
    console.error('[Auth] Authentication error:', error.message);

    if (error.message.startsWith('Invalid token')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to authenticate request',
    });
  }
}

/**
 * Optional authentication - doesn't fail if no token
 * Attaches user if token is valid, otherwise continues without
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const decodedToken = await verifyIdToken(token);
        await ensureUserInFirestore(decodedToken);

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          displayName: decodedToken.name,
          photoURL: decodedToken.picture,
        };
        req.token = decodedToken;
      }
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
    console.warn('[Auth] Optional auth failed:', error.message);
  }

  next();
}

/**
 * Check if user has admin role
 * Must be used after authenticate()
 */
export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check custom claims for admin role
  const isAdmin = req.token.admin === true ||
                  req.token.role === 'admin';

  if (!isAdmin) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }

  next();
}

/**
 * Check if user owns the resource
 * @param {Function} getResourceUid - Function to extract resource owner UID from request
 */
export function requireOwnership(getResourceUid) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const resourceUid = getResourceUid(req);

    if (req.user.uid !== resourceUid) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not own this resource',
      });
    }

    next();
  };
}

export default {
  authenticate,
  optionalAuth,
  requireAdmin,
  requireOwnership,
};
