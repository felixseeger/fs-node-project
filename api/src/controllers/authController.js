/**
 * Auth Controller
 * Handles authentication-related endpoints
 */
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { verifyIdToken, ensureUserInFirestore, getUserByUid, revokeAllSessions, deleteUserAccount } from '../services/authService.js';
import { getFullProfile } from '../services/profileService.js';

/**
 * POST /api/auth/verify
 * Verify Firebase token and return user info
 */
export const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new AppError('Token is required', 400, 'MISSING_TOKEN');
  }

  const decodedToken = await verifyIdToken(token);
  const user = await ensureUserInFirestore(decodedToken);

  res.json({
    success: true,
    user: {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    },
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user's profile
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // req.user is attached by auth middleware
  const profile = await getFullProfile(req.user.uid);

  res.json({
    success: true,
    user: profile,
  });
});

/**
 * GET /api/auth/user/:uid
 * Get user by UID (admin only)
 */
export const getUser = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  const user = await getUserByUid(uid);

  res.json({
    success: true,
    user,
  });
});

/**
 * POST /api/auth/logout
 * Revoke all sessions (logout everywhere)
 */
export const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllSessions(req.user.uid);

  res.json({
    success: true,
    message: 'All sessions revoked',
  });
});

/**
 * DELETE /api/auth/account
 * Delete user account
 */
export const deleteAccount = asyncHandler(async (req, res) => {
  await deleteUserAccount(req.user.uid);

  res.json({
    success: true,
    message: 'Account deleted successfully',
  });
});

export default {
  verifyToken,
  getCurrentUser,
  getUser,
  logoutAll,
  deleteAccount,
};
