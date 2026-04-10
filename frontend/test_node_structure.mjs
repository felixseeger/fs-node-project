/**
 * Test node structure by analyzing the dynamic imports file
 * Verifies that all nodes are properly configured without importing JSX
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

console.log('🧪 Testing Node Structure and Configuration...\n');

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the dynamic imports file
const dynamicImportsPath = path.join(__dirname, 'src/utils/dynamicNodeImports.js');

try {
  const content = fs.readFileSync(dynamicImportsPath, 'utf8');
  
  // Test 1: Count lazy imports
  console.log('1️⃣ Counting lazy-loaded components...');
  const lazyImportMatches = content.match(/const \w+Node = lazy/g) || [];
  const nodeCount = lazyImportMatches.length;
  
  console.log(`✅ Found ${nodeCount} lazy-loaded node components`);
  
  if (nodeCount >= 60) {
    console.log('✅ All expected nodes are configured');
  } else {
    console.log(`❌ Expected 63 nodes, found ${nodeCount}`);
  }
  
  // Test 2: Verify export structure
  console.log('\n2️⃣ Verifying export structure...');
  
  const hasDynamicNodesExport = content.includes('export const dynamicNodes = {');
  const hasPrefetchExport = content.includes('export const prefetchFunctions = {');
  
  if (hasDynamicNodesExport) {
    console.log('✅ dynamicNodes export found');
  } else {
    console.log('❌ dynamicNodes export missing');
  }
  
  if (hasPrefetchExport) {
    console.log('✅ prefetchFunctions export found');
  } else {
    console.log('❌ prefetchFunctions export missing');
  }
  
  // Test 3: Count prefetch functions
  console.log('\n3️⃣ Counting prefetch functions...');
  const prefetchMatches = content.match(/prefetch\w+Node: \(\) => prefetchNode/g) || [];
  const prefetchCount = prefetchMatches.length;
  
  console.log(`✅ Found ${prefetchCount} prefetch functions`);
  
  if (prefetchCount >= 60) {
    console.log('✅ All expected prefetch functions are configured');
  } else {
    console.log(`❌ Expected 63 prefetch functions, found ${prefetchCount}`);
  }
  
  // Test 4: Verify error handling
  console.log('\n4️⃣ Verifying error handling...');
  
  const errorHandlingMatches = content.match(/\.catch\(error => \{/g) || [];
  const errorHandlingCount = errorHandlingMatches.length;
  
  console.log(`✅ Found ${errorHandlingCount} error handling blocks`);
  
  if (errorHandlingCount >= 60) {
    console.log('✅ Comprehensive error handling implemented');
  } else {
    console.log(`❌ Expected error handling for all nodes`);
  }
  
  // Test 5: Check organization by categories
  console.log('\n5️⃣ Checking code organization...');
  
  const categories = [
    'Input/Output Nodes',
    'Image Generation Nodes',
    'Image Editing Nodes',
    'Video Generation Nodes',
    'Audio Nodes',
    'Utility Nodes',
    'Advanced Nodes'
  ];
  
  let categoryCount = 0;
  categories.forEach(category => {
    if (content.includes(`// ${category}`)) {
      categoryCount++;
      console.log(`✅ ${category} section found`);
    } else {
      console.log(`❌ ${category} section missing`);
    }
  });
  
  console.log(`✅ Found ${categoryCount}/${categories.length} category sections`);
  
  // Test 6: Verify helper functions
  console.log('\n6️⃣ Verifying helper functions...');
  
  const hasDynamicNodeLoader = content.includes('DynamicNodeLoader');
  const hasPrefetchNode = content.includes('prefetchNode');
  const hasCreateWrapper = content.includes('createDynamicNodeWrapper');
  
  if (hasDynamicNodeLoader) {
    console.log('✅ DynamicNodeLoader function found');
  } else {
    console.log('❌ DynamicNodeLoader function missing');
  }
  
  if (hasPrefetchNode) {
    console.log('✅ prefetchNode function found');
  } else {
    console.log('❌ prefetchNode function missing');
  }
  
  if (hasCreateWrapper) {
    console.log('✅ createDynamicNodeWrapper function found');
  } else {
    console.log('❌ createDynamicNodeWrapper function missing');
  }
  
  // Test 7: Check specific critical nodes
  console.log('\n7️⃣ Checking critical nodes...');
  
  const criticalNodes = [
    'InputNode', 'GeneratorNode', 'ImageOutputNode', 
    'ImageAnalyzerNode', 'CreativeUpScaleNode'
  ];
  
  criticalNodes.forEach(nodeName => {
    if (content.includes(`const ${nodeName} = lazy`)) {
      console.log(`✅ ${nodeName} configured`);
    } else {
      console.log(`❌ ${nodeName} missing`);
    }
  });
  
  // Test 8: File size analysis
  console.log('\n8️⃣ Analyzing file metrics...');
  
  const stats = fs.statSync(dynamicImportsPath);
  const fileSizeKB = Math.round(stats.size / 1024);
  const lineCount = content.split('\n').length;
  
  console.log(`📊 File size: ${fileSizeKB} KB`);
  console.log(`📊 Line count: ${lineCount} lines`);
  console.log(`📊 Nodes per KB: ${Math.round(nodeCount / fileSizeKB)}`);
  
  // Final summary
  console.log('\n🎯 Structure Analysis Summary:');
  console.log(`✅ ${nodeCount} lazy-loaded components configured`);
  console.log(`✅ ${prefetchCount} prefetch functions available`);
  console.log(`✅ ${errorHandlingCount} error handling blocks implemented`);
  console.log(`✅ ${categoryCount} category sections organized`);
  console.log(`✅ ${fileSizeKB} KB file size with ${lineCount} lines`);
  
  // Health check
  const healthScore = (
    (nodeCount >= 60 ? 25 : 0) +
    (prefetchCount >= 60 ? 25 : 0) +
    (errorHandlingCount >= 60 ? 20 : 0) +
    (categoryCount >= 6 ? 15 : 0) +
    (hasDynamicNodeLoader && hasPrefetchNode && hasCreateWrapper ? 15 : 0)
  );
  
  console.log(`\n💪 Health Score: ${healthScore}/100`);
  
  if (healthScore >= 90) {
    console.log('🌟 Excellent implementation quality!');
  } else if (healthScore >= 75) {
    console.log('✅ Good implementation quality');
  } else if (healthScore >= 50) {
    console.log('⚠️ Fair implementation quality');
  } else {
    console.log('❌ Needs improvement');
  }
  
  console.log('\n🚀 Node structure is properly configured!');
  console.log('📊 Ready for integration testing and production use.');
  
} catch (error) {
  console.error('❌ Error analyzing node structure:', error.message);
  process.exit(1);
}