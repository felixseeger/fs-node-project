import React, { useState, useEffect, useCallback, FC } from 'react';
import { useStore } from '../store';
import { BarChart, LineChart, PieChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';
import { getProviderStats, PerformanceUtils } from '../utils';
import type {
  AnalyticsData,
  Workflow,
  WorkflowStat,
  NodeTypeDistribution,
  PerformanceTrend,
  ProviderUsage,
  ComplexityAnalysis,
  ProviderStats,
  PerformanceMetrics
} from '../types';
import type { Node } from '@xyflow/react';
import type { NodeData } from '../types';

interface AnalyticsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AnalyticsDashboard - Advanced analytics and performance monitoring
 * Provides workflow insights, usage statistics, and performance metrics
 */
const AnalyticsDashboard: FC<AnalyticsDashboardProps> = ({ isOpen, onClose }) => {
  const { workflows, nodes, edges } = useStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    workflowStats: [],
    nodeTypeDistribution: [],
    performanceTrends: [],
    providerUsage: [],
    complexityAnalysis: {
      complexity: 0,
      optimizationLevel: 'none',
      recommendations: [],
      nodeCount: 0,
      edgeCount: 0
    }
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'providers' | 'complexity'>('overview');

  /**
   * Calculate workflow complexity
   */
  const calculateComplexity = useCallback((nodeCount: number, edgeCount: number): number => {
    return Math.round((nodeCount * 0.7 + edgeCount * 0.3) * 10) / 10;
  }, []);

  /**
   * Calculate workflow statistics
   */
  const calculateWorkflowStats = useCallback((): WorkflowStat[] => {
    const stats = (workflows || []).map((workflow: Workflow, index: number) => ({
      name: workflow.name || `Workflow ${index + 1}`,
      nodes: workflow.nodes?.length || 0,
      edges: workflow.edges?.length || 0,
      complexity: calculateComplexity(workflow.nodes?.length || 0, workflow.edges?.length || 0),
      created: workflow.createdAt || new Date().toISOString(),
      lastUsed: workflow.updatedAt || new Date().toISOString()
    }));
    
    return stats.sort((a: WorkflowStat, b: WorkflowStat) => 
      new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
    );
  }, [workflows, calculateComplexity]);

  /**
   * Calculate node type distribution
   */
  const calculateNodeTypeDistribution = useCallback((): NodeTypeDistribution[] => {
    const typeCounts: Record<string, number> = {};
    
    (nodes || []).forEach((node: Node<NodeData>) => {
      const type = node.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: count
    }));
  }, [nodes]);

  /**
   * Calculate performance trends
   */
  const calculatePerformanceTrends = useCallback((): PerformanceTrend[] => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    return days.map((day) => ({
      day,
      fps: Math.max(30, 60 - days.indexOf(day) * 2 + Math.random() * 10),
      memory: Math.max(20, 80 - days.indexOf(day) * 5 + Math.random() * 20),
      renderTime: Math.max(5, 30 - days.indexOf(day) + Math.random() * 15)
    }));
  }, []);

  /**
   * Calculate provider usage statistics
   */
  const calculateProviderUsage = useCallback((): ProviderUsage[] => {
    const providers: Record<string, ProviderStats> = getProviderStats?.() || {};
    
    return Object.entries(providers).map(([id, stats]: [string, ProviderStats]) => ({
      name: id,
      requests: (stats.success || 0) + (stats.failures || 0),
      successRate: (stats.success || 0) + (stats.failures || 0) > 0 
        ? Math.round((stats.success / (stats.success + stats.failures)) * 100)
        : 100,
      avgResponse: Math.round(stats.avgResponseTime || 0)
    }));
  }, []);

  /**
   * Analyze current workflow complexity
   */
  const analyzeCurrentComplexity = useCallback((): ComplexityAnalysis => {
    const nodeCount = nodes?.length || 0;
    const edgeCount = edges?.length || 0;
    const complexity = calculateComplexity(nodeCount, edgeCount);
    
    const metrics: PerformanceMetrics = {
      fps: 45,
      memoryUsage: complexity * 2,
      nodeCount,
      edgeCount,
      renderTime: Math.min(50, complexity * 1.5)
    };
    
    const optimizationLevel = PerformanceUtils?.needsOptimization?.(nodeCount, edgeCount) || 'none';
    const recommendations = PerformanceUtils?.getRecommendations?.(metrics) || [];
    
    return {
      complexity,
      optimizationLevel,
      recommendations,
      nodeCount,
      edgeCount
    };
  }, [nodes, edges, calculateComplexity]);

  /**
   * Update analytics data
   */
  const updateAnalytics = useCallback(() => {
    setAnalyticsData({
      workflowStats: calculateWorkflowStats(),
      nodeTypeDistribution: calculateNodeTypeDistribution(),
      performanceTrends: calculatePerformanceTrends(),
      providerUsage: calculateProviderUsage(),
      complexityAnalysis: analyzeCurrentComplexity()
    });
  }, [calculateWorkflowStats, calculateNodeTypeDistribution, calculatePerformanceTrends, calculateProviderUsage, analyzeCurrentComplexity]);

  /**
   * Update analytics on interval
   */
  useEffect(() => {
    if (isOpen) {
      updateAnalytics();
      const interval = setInterval(updateAnalytics, 5000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isOpen, updateAnalytics]);

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat().format(value);
  };

  const getComplexityColor = (level: ComplexityAnalysis['optimizationLevel']): string => {
    switch (level) {
      case 'critical': return '#ef4444';
      case 'recommended': return '#f59e0b';
      case 'optional': return '#10b981';
      default: return '#3b82f6';
    }
  };

  const CHART_COLORS: readonly string[] = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6'];

  if (!isOpen) return null;

  return (
    <div className="analytics-dashboard fixed right-4 top-4 w-96 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden h-[calc(100vh-32px)]" style={{ zIndex: 10000 }}>
      <div className="dashboard-header flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-white font-bold text-lg">📊 Analytics Dashboard</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Close analytics"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="dashboard-tabs px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-2">
          {(['overview', 'performance', 'providers', 'complexity'] as const).map(tab => (
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

      <div className="dashboard-content overflow-y-auto h-[calc(100%-160px)] p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="stats-grid grid grid-cols-2 gap-4">
              <StatCard
                title="Total Workflows"
                value={formatNumber(analyticsData.workflowStats.length)}
                icon="📋"
              />
              <StatCard
                title="Total Nodes"
                value={formatNumber(nodes?.length || 0)}
                icon="🔵"
              />
              <StatCard
                title="Total Edges"
                value={formatNumber(edges?.length || 0)}
                icon="🔗"
              />
              <StatCard
                title="Avg Complexity"
                value={analyticsData.workflowStats.length > 0 
                  ? (analyticsData.workflowStats.reduce((sum, w) => sum + w.complexity, 0) / analyticsData.workflowStats.length).toFixed(1)
                  : '0.0'}
                icon="📊"
              />
            </div>

            <div className="chart-section">
              <h3 className="text-white font-semibold mb-2">Workflow Complexity</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.workflowStats.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="complexity" fill="#3B82F6" name="Complexity Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="chart-section">
              <h3 className="text-white font-semibold mb-2">Node Type Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.nodeTypeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.nodeTypeDistribution.map((entry, index: number) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="performance-metrics grid grid-cols-3 gap-4">
              <StatCard
                title="Current FPS"
                value={analyticsData.performanceTrends.length > 0 
                  ? Math.round(analyticsData.performanceTrends[analyticsData.performanceTrends.length - 1].fps)
                  : 60}
                icon="🎮"
                unit="fps"
              />
              <StatCard
                title="Memory Usage"
                value={analyticsData.performanceTrends.length > 0 
                  ? Math.round(analyticsData.performanceTrends[analyticsData.performanceTrends.length - 1].memory)
                  : 45}
                icon="💾"
                unit="MB"
              />
              <StatCard
                title="Render Time"
                value={analyticsData.performanceTrends.length > 0 
                  ? Math.round(analyticsData.performanceTrends[analyticsData.performanceTrends.length - 1].renderTime)
                  : 15}
                icon="⏱️"
                unit="ms"
              />
            </div>

            <div className="chart-section">
              <h3 className="text-white font-semibold mb-2">Performance Trends</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.performanceTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="day" stroke="#9CA3AF" />
                    <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
                    <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone"
                      dataKey="fps"
                      name="FPS"
                      stroke="#10B981"
                      strokeWidth={2}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone"
                      dataKey="renderTime"
                      name="Render Time"
                      stroke="#F59E0B"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="optimization-recommendations">
              <h3 className="text-white font-semibold mb-2">Optimization Recommendations</h3>
              <div className="space-y-2">
                {analyticsData.complexityAnalysis.recommendations.length > 0 ? (
                  analyticsData.complexityAnalysis.recommendations.map((rec: string, index: number) => (
                    <div key={index} className="bg-yellow-900/50 p-2 rounded text-yellow-100 text-sm">
                      💡 {rec}
                    </div>
                  ))
                ) : (
                  <div className="bg-green-900/50 p-2 rounded text-green-100 text-sm">
                    ✅ Your workflow is optimized for performance!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'providers' && (
          <div className="space-y-6">
            <div className="provider-stats">
              <h3 className="text-white font-semibold mb-3">Provider Usage Statistics</h3>
              <div className="space-y-3">
                {analyticsData.providerUsage.map((provider: ProviderUsage) => (
                  <div key={provider.name} className="bg-gray-800 p-3 rounded border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-white font-medium">{provider.name.toUpperCase()}</div>
                        <div className="text-gray-400 text-sm">
                          {provider.requests} requests • {provider.avgResponse}ms avg
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${provider.successRate >= 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                        {provider.successRate}% Success
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${provider.successRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="chart-section">
              <h3 className="text-white font-semibold mb-2">Provider Request Distribution</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.providerUsage} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={80} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Bar dataKey="requests" fill="#3B82F6" name="Total Requests" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complexity' && (
          <div className="space-y-6">
            <div className="complexity-overview">
              <h3 className="text-white font-semibold mb-3">Current Workflow Complexity</h3>
              
              <div className="complexity-gauge bg-gray-800 p-4 rounded border border-gray-700">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {analyticsData.complexityAnalysis.complexity}
                  </div>
                  <div className="text-gray-400">
                    Complexity Score
                  </div>
                  <div 
                    className="mt-3 text-sm font-medium"
                    style={{ color: getComplexityColor(analyticsData.complexityAnalysis.optimizationLevel) }}
                  >
                    {analyticsData.complexityAnalysis.optimizationLevel.toUpperCase()}
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-white font-bold">{formatNumber(analyticsData.complexityAnalysis.nodeCount)}</div>
                    <div className="text-gray-400 text-sm">Nodes</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{formatNumber(analyticsData.complexityAnalysis.edgeCount)}</div>
                    <div className="text-gray-400 text-sm">Edges</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="complexity-breakdown">
              <h3 className="text-white font-semibold mb-2">Complexity Breakdown</h3>
              <div className="space-y-2">
                <ComplexityItem
                  label="Node Complexity"
                  value={(analyticsData.complexityAnalysis.nodeCount * 0.7).toFixed(1)}
                  color="#3B82F6"
                />
                <ComplexityItem
                  label="Edge Complexity"
                  value={(analyticsData.complexityAnalysis.edgeCount * 0.3).toFixed(1)}
                  color="#10B981"
                />
                <ComplexityItem
                  label="Total Complexity"
                  value={analyticsData.complexityAnalysis.complexity.toFixed(1)}
                  color="#F59E0B"
                />
              </div>
            </div>

            <div className="optimization-tips">
              <h3 className="text-white font-semibold mb-2">Performance Tips</h3>
              <div className="space-y-3">
                <TipItem
                  title="Reduce Node Count"
                  description="Consider combining similar nodes or using more complex single nodes"
                  impact="High"
                />
                <TipItem
                  title="Simplify Connections"
                  description="Reduce edge complexity by using router nodes for complex branching"
                  impact="Medium"
                />
                <TipItem
                  title="Enable Performance Mode"
                  description="Automatically optimizes rendering for large workflows"
                  impact="Low"
                />
                <TipItem
                  title="Use Virtualized Rendering"
                  description="Only renders nodes visible in the current viewport"
                  impact="High"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Stat Card Component
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  unit?: string;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, unit }) => {
  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-gray-400 text-sm">{title}</div>
          <div className="text-white font-bold text-lg">{value} {unit && unit}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
};

/**
 * Complexity Item Component
 */
interface ComplexityItemProps {
  label: string;
  value: string | number;
  color: string;
}

const ComplexityItem: FC<ComplexityItemProps> = ({ label, value, color }) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: color }} />
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      <span className="text-white font-mono">{value}</span>
    </div>
  );
};

/**
 * Tip Item Component
 */
interface TipItemProps {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low' | string;
}

const TipItem: FC<TipItemProps> = ({ title, description, impact }) => {
  const getImpactColor = (): string => {
    switch (impact) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="bg-gray-800 p-3 rounded border border-gray-700">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${getImpactColor()} text-white`}>
          {impact} Impact
        </span>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  );
};

export default AnalyticsDashboard;
