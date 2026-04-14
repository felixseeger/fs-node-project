import admin from 'firebase-admin';

/**
 * Logs an audit event for compliance requirements.
 * @param {Object} params
 * @param {string} params.action - The action being performed (e.g., 'API_CALL', 'CHECKOUT_START').
 * @param {string} [params.userId] - The UID of the user performing the action (overrides req.user.uid)
 * @param {string} [params.userEmail] - The email of the user
 * @param {string} [params.resourceId] - The ID of the resource affected (if any).
 * @param {string} [params.status='SUCCESS'] - Status of the action ('SUCCESS', 'FAILURE').
 * @param {Object} [params.details={}] - Additional metadata about the action.
 * @param {Object} [params.req] - The Express request object (optional, for IP/UserAgent).
 */
export async function logAuditEvent({ action, userId, userEmail, resourceId, status = 'SUCCESS', details = {}, req }) {
  if (!admin.apps.length) return; // Silent skip if no firebase admin

  try {
    const db = admin.firestore();
    const auditRef = db.collection('audit_logs');
    
    // Extract user info if available
    let finalUserId = userId || 'system';
    let finalUserEmail = userEmail || null;
    
    if (req && req.user) {
      if (!userId) finalUserId = req.user.uid || req.user.user_id || 'unknown';
      if (!userEmail) finalUserEmail = req.user.email || null;
    }
    
    // Extract IP and User Agent
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip) : null;
    const userAgent = req ? req.headers['user-agent'] : null;
    
    // Construct the audit log document
    const auditDoc = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action,
      userId: finalUserId,
      userEmail: finalUserEmail,
      resourceId: resourceId || null,
      status,
      details,
      ipAddress,
      userAgent,
      method: req ? req.method : null,
      path: req ? req.originalUrl || req.path : null,
    };
    
    // Clean up undefined values which Firestore rejects
    Object.keys(auditDoc).forEach(key => auditDoc[key] === undefined && delete auditDoc[key]);

    await auditRef.add(auditDoc);
  } catch (error) {
    console.error('[Audit Log Error] Failed to write audit log:', error.message);
  }
}
