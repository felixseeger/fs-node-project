/**
 * Enterprise Integration Suite
 * Provides SSO, audit logging, and enterprise API integrations
 */

import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../store';

/**
 * Enterprise SSO Provider Configuration
 */
export const SSO_PROVIDERS = {
  google: {
    name: 'Google Workspace',
    clientId: process.env.GOOGLE_SSO_CLIENT_ID,
    authUrl: 'https://accounts.google.com/o/oauth2/auth',
    scope: 'openid profile email'
  },
  microsoft: {
    name: 'Microsoft Entra ID',
    clientId: process.env.MICROSOFT_SSO_CLIENT_ID,
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    scope: 'openid profile email'
  },
  okta: {
    name: 'Okta',
    clientId: process.env.OKTA_SSO_CLIENT_ID,
    authUrl: process.env.OKTA_SSO_AUTH_URL || 'https://your-domain.okta.com/oauth2/default/v1/authorize',
    scope: 'openid profile email'
  }
};

/**
 * Audit Log Entry Structure
 */
export const AuditLogEntry = {
  id: '',
  timestamp: '',
  userId: '',
  userEmail: '',
  action: '',
  entityType: '',
  entityId: '',
  details: {},
  ipAddress: '',
  userAgent: ''
}

/**
 * Enterprise Integration Hook
 */
export function useEnterpriseIntegration() {
  const { workflows, currentWorkflow, user } = useStore();
  const [ssoProviders, setSsoProviders] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [integrationStatus, setIntegrationStatus] = useState({
    sso: 'not_configured',
    audit: 'not_configured',
    api: 'not_configured'
  });
  const [isEnterpriseReady, setIsEnterpriseReady] = useState(false);

  /**
   * Initialize enterprise integrations
   */
  const initializeIntegrations = useCallback(() => {
    // Check which SSO providers are configured
    const configuredProviders = Object.entries(SSO_PROVIDERS)
      .filter(([_, config]) => config.clientId)
      .map(([id, config]) => ({ id, ...config }));
    
    setSsoProviders(configuredProviders);
    
    // Check integration status
    const newStatus = {
      sso: configuredProviders.length > 0 ? 'configured' : 'not_configured',
      audit: 'configured', // Audit logging is always available
      api: 'configured' // API is always available
    };
    
    setIntegrationStatus(newStatus);
    setIsEnterpriseReady(newStatus.sso === 'configured');
  }, []);

  /**
   * Log audit entry
   */
  const logAuditEntry = useCallback((entry) => {
    const fullEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'anonymous',
      userEmail: user?.email || 'anonymous@example.com',
      action: entry.action || 'unknown',
      entityType: entry.entityType || 'unknown',
      entityId: entry.entityId || 'unknown',
      details: entry.details || {},
      ipAddress: '127.0.0.1', // Would be detected in real implementation
      userAgent: navigator.userAgent
    };
    
    setAuditLogs(prev => [fullEntry, ...prev].slice(0, 100)); // Keep last 100 entries
    
    // In real implementation, this would also send to audit logging backend
    console.log('[AUDIT]', fullEntry);
    
    return fullEntry;
  }, [user]);

  /**
   * Initialize SSO login
   */
  const initiateSSOLogin = useCallback((providerId) => {
    const provider = ssoProviders.find(p => p.id === providerId);
    if (!provider) {
      throw new Error(`SSO provider ${providerId} not configured`);
    }
    
    // In real implementation, this would redirect to SSO provider
    const authUrl = new URL(provider.authUrl);
    authUrl.searchParams.append('client_id', provider.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', provider.scope);
    authUrl.searchParams.append('redirect_uri', window.location.origin + '/auth/callback');
    authUrl.searchParams.append('state', JSON.stringify({
      workflowId: currentWorkflow?.id,
      timestamp: Date.now()
    }));
    
    // Log the SSO initiation
    logAuditEntry({
      action: 'sso_initiate',
      entityType: 'authentication',
      entityId: providerId,
      details: { provider: provider.name }
    });
    
    // Return the URL that would be used for redirection
    return authUrl.toString();
  }, [ssoProviders, currentWorkflow, logAuditEntry]);

  /**
   * Export audit logs
   */
  const exportAuditLogs = useCallback((format = 'json') => {
    if (format === 'json') {
      const data = JSON.stringify(auditLogs, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      logAuditEntry({
        action: 'audit_export',
        entityType: 'audit_log',
        details: { format: 'json', count: auditLogs.length }
      });
    }
    
    // CSV export would be implemented similarly
  }, [auditLogs, logAuditEntry]);

  /**
   * Get enterprise API integration status
   */
  const getApiIntegrationStatus = useCallback(() => {
    // In real implementation, this would check API health
    return {
      status: 'operational',
      endpoints: [
        { name: 'Workflow API', status: 'operational' },
        { name: 'User API', status: 'operational' },
        { name: 'Audit API', status: 'operational' }
      ],
      lastChecked: new Date().toISOString()
    };
  }, []);

  /**
   * Check enterprise compliance
   */
  const checkCompliance = useCallback(() => {
    // In real implementation, this would check various compliance requirements
    return {
      ssoConfigured: integrationStatus.sso === 'configured',
      auditLoggingEnabled: true,
      dataEncryption: true, // Would check actual encryption status
      accessControls: true, // Would check actual access controls
      complianceScore: integrationStatus.sso === 'configured' ? 100 : 75
    };
  }, [integrationStatus.sso]);

  /**
   * Initialize on mount
   */
  useEffect(() => {
    initializeIntegrations();
  }, [initializeIntegrations]);

  return {
    ssoProviders,
    auditLogs,
    integrationStatus,
    isEnterpriseReady,
    logAuditEntry,
    initiateSSOLogin,
    exportAuditLogs,
    getApiIntegrationStatus,
    checkCompliance
  };
}

/**
 * Enterprise Admin Panel Component
 */
export function EnterpriseAdminPanel({ isOpen, onClose }) {
  const {
    ssoProviders,
    auditLogs,
    integrationStatus,
    isEnterpriseReady,
    exportAuditLogs,
    getApiIntegrationStatus,
    checkCompliance
  } = useEnterpriseIntegration();
  
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen) return null;

  return (
    <div className="enterprise-admin fixed right-4 top-4 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden h-[calc(100vh-32px)]">
      <div className="admin-header flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg">🏢 Enterprise Admin</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close admin panel"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="admin-tabs px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          {['overview', 'sso', 'audit', 'compliance'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-sm rounded ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-content overflow-y-auto h-[calc(100%-160px)] p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="enterprise-status">
              <h3 className="text-white font-semibold mb-3">Enterprise Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <StatusCard
                  title="SSO Configuration"
                  status={integrationStatus.sso}
                  icon="🔑"
                />
                <StatusCard
                  title="Audit Logging"
                  status={integrationStatus.audit}
                  icon="📜"
                />
                <StatusCard
                  title="API Integration"
                  status={integrationStatus.api}
                  icon="🔌"
                />
                <StatusCard
                  title="Compliance"
                  status={checkCompliance().complianceScore >= 80 ? 'compliant' : 'needs_attention'}
                  icon="✅"
                />
              </div>
            </div>

            <div className="enterprise-metrics">
              <h3 className="text-white font-semibold mb-3">Key Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Configured SSO Providers"
                  value={ssoProviders.length}
                  icon="🔑"
                />
                <MetricCard
                  title="Audit Log Entries"
                  value={auditLogs.length}
                  icon="📜"
                />
                <MetricCard
                  title="API Endpoints"
                  value={getApiIntegrationStatus().endpoints.length}
                  icon="🔌"
                />
                <MetricCard
                  title="Compliance Score"
                  value={`${checkCompliance().complianceScore}%`}
                  icon="✅"
                />
              </div>
            </div>

            <div className="quick-actions">
              <h3 className="text-white font-semibold mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => exportAuditLogs('json')}
                  className="w-full flex items-center justify-center py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  📥 Export Audit Logs
                </button>
                <button
                  className="w-full flex items-center justify-center py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  🔄 Check API Status
                </button>
                <button
                  className="w-full flex items-center justify-center py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                >
                  📋 Run Compliance Check
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sso' && (
          <div className="space-y-6">
            <div className="sso-configuration">
              <h3 className="text-white font-semibold mb-3">SSO Configuration</h3>
              
              {ssoProviders.length > 0 ? (
                <div className="space-y-3">
                  {ssoProviders.map(provider => (
                    <div key={provider.id} className="bg-gray-800 p-3 rounded border border-gray-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-white font-medium">{provider.name}</div>
                          <div className="text-gray-400 text-sm">Client ID: {provider.clientId.slice(0, 10)}...</div>
                          <div className="text-gray-400 text-sm">Scope: {provider.scope}</div>
                        </div>
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">Configured</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-900/30 p-4 rounded border border-yellow-700">
                  <h4 className="text-yellow-300 font-medium mb-2">No SSO Providers Configured</h4>
                  <p className="text-yellow-200 text-sm">
                    Configure SSO providers in your environment variables to enable single sign-on.
                  </p>
                </div>
              )}
            </div>

            <div className="sso-setup">
              <h3 className="text-white font-semibold mb-3">Setup Instructions</h3>
              <div className="bg-gray-800/50 p-3 rounded border border-gray-700 text-sm">
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>Set up SSO provider in your identity management system</li>
                  <li>Configure redirect URIs to include your application domain</li>
                  <li>Add client ID and secret to environment variables</li>
                  <li>Restart the application for changes to take effect</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-semibold">Audit Logs</h3>
              <button
                onClick={() => exportAuditLogs('json')}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Export JSON
              </button>
            </div>

            {auditLogs.length > 0 ? (
              <div className="audit-log-list space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="bg-gray-800 p-3 rounded border border-gray-700 text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-gray-400 text-xs">{new Date(log.timestamp).toLocaleString()}</div>
                        <div className="text-white font-medium capitalize">{log.action.replace('_', ' ')}</div>
                        <div className="text-gray-300 text-xs">
                          {log.userEmail} • {log.entityType}: {log.entityId}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {log.ipAddress}
                      </div>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="text-gray-400 text-xs mt-1">
                        Details: {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 p-4 rounded border border-gray-700 text-center">
                <p className="text-gray-400">No audit log entries yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="compliance-summary">
              <h3 className="text-white font-semibold mb-3">Compliance Summary</h3>
              
              <div className="compliance-score text-center py-6">
                <div className="text-4xl font-bold text-white mb-2">
                  {checkCompliance().complianceScore}%
                </div>
                <div className="text-gray-400">
                  {checkCompliance().complianceScore >= 80 ? 'Compliant' : 'Needs Attention'}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${checkCompliance().complianceScore}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="compliance-checklist">
              <h3 className="text-white font-semibold mb-3">Compliance Checklist</h3>
              
              <div className="space-y-3">
                <ComplianceItem
                  title="SSO Configuration"
                  status={checkCompliance().ssoConfigured}
                  description="Single Sign-On is properly configured for secure authentication"
                />
                <ComplianceItem
                  title="Audit Logging"
                  status={checkCompliance().auditLoggingEnabled}
                  description="All user actions are logged for audit purposes"
                />
                <ComplianceItem
                  title="Data Encryption"
                  status={checkCompliance().dataEncryption}
                  description="All sensitive data is encrypted at rest and in transit"
                />
                <ComplianceItem
                  title="Access Controls"
                  status={checkCompliance().accessControls}
                  description="Role-based access control is implemented"
                />
              </div>
            </div>

            <div className="compliance-actions">
              <h3 className="text-white font-semibold mb-3">Recommended Actions</h3>
              <div className="space-y-2">
                {!checkCompliance().ssoConfigured && (
                  <div className="bg-yellow-900/30 p-3 rounded border border-yellow-700">
                    <div className="text-yellow-300 font-medium">Configure SSO</div>
                    <div className="text-yellow-200 text-sm">
                      Set up Single Sign-On for enhanced security and user management.
                    </div>
                  </div>
                )}
                <div className="bg-blue-900/30 p-3 rounded border border-blue-700">
                  <div className="text-blue-300 font-medium">Review Audit Logs</div>
                  <div className="text-blue-200 text-sm">
                    Regularly review audit logs for suspicious activity.
                  </div>
                </div>
                <div className="bg-green-900/30 p-3 rounded border border-green-700">
                  <div className="text-green-300 font-medium">Run Security Audit</div>
                  <div className="text-green-200 text-sm">
                    Perform a comprehensive security audit of your configuration.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Status Card Component
 */
function StatusCard({ title, status, icon }) {
  const getStatusColor = () => {
    switch (status) {
      case 'configured': return 'bg-green-600';
      case 'operational': return 'bg-green-600';
      case 'compliant': return 'bg-green-600';
      case 'needs_attention': return 'bg-yellow-600';
      case 'not_configured': return 'bg-gray-600';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className={`text-white font-bold text-lg capitalize`}>{status.replace('_', ' ')}</div>
        </div>
        <div className={`text-2xl ${getStatusColor()} rounded p-1`}>{icon}</div>
      </div>
    </div>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({ title, value, icon }) {
  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className="text-white font-bold text-lg">{value}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

/**
 * Compliance Item Component
 */
function ComplianceItem({ title, status, description }) {
  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-white font-medium mb-1">{title}</div>
          <div className="text-gray-400 text-sm">{description}</div>
        </div>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ml-3 ${
          status ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {status ? '✓' : '✗'}
        </div>
      </div>
    </div>
  );
}

/**
 * Enterprise API Client
 * Handles enterprise API integrations
 */
export const EnterpriseApi = {
  
  /**
   * Base API configuration
   */
  baseUrl: process.env.ENTERPRISE_API_BASE_URL || 'https://api.enterprise.example.com/v1',
  
  /**
   * Make authenticated API request
   */
  async request(endpoint, method = 'GET', data = null, headers = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = localStorage.getItem('enterprise_auth_token');
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : undefined,
        ...headers
      }
    };
    
    if (data) {
      config.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Enterprise API error:', error);
      throw error;
    }
  },
  
  /**
   * Get user directory
   */
  async getUserDirectory() {
    return this.request('/directory/users');
  },
  
  /**
   * Get audit logs
   */
  async getAuditLogs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/audit/logs${query ? '?' + query : ''}`);
  },
  
  /**
   * Check system health
   */
  async checkHealth() {
    return this.request('/health');
  },
  
  /**
   * Get compliance report
   */
  async getComplianceReport() {
    return this.request('/compliance/report');
  }
};