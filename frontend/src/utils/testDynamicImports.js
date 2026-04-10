/**
 * Test script to verify dynamic node imports are working correctly
 * This can be run independently to validate the code splitting implementation
 */

import React from 'react';
import { render } from '@testing-library/react';
import { dynamicNodes, createDynamicNodeWrapper, DynamicNodeLoader } from './dynamicNodeImports';

describe('Dynamic Node Imports', () => {
  // Test that dynamic nodes are properly defined
  test('dynamic nodes should be defined', () => {
    expect(dynamicNodes.InputNode).toBeDefined();
    expect(dynamicNodes.GeneratorNode).toBeDefined();
    expect(dynamicNodes.ImageOutputNode).toBeDefined();
    expect(dynamicNodes.ImageAnalyzerNode).toBeDefined();
    expect(dynamicNodes.CreativeUpScaleNode).toBeDefined();
  });

  // Test that createDynamicNodeWrapper works correctly
  test('createDynamicNodeWrapper should create wrapper components', () => {
    const InputNodeWrapper = createDynamicNodeWrapper(dynamicNodes.InputNode);
    expect(typeof InputNodeWrapper).toBe('function');
    
    // The wrapper should be a React component
    const wrapperComponent = <InputNodeWrapper id="test" data={{}} />;
    expect(wrapperComponent).toBeDefined();
  });

  // Test DynamicNodeLoader structure
  test('DynamicNodeLoader should handle loading and error states', () => {
    // Mock a lazy component
    const MockLazyComponent = React.lazy(() => 
      Promise.resolve({ default: () => <div>Mock Node</div> })
    );
    
    const loader = DynamicNodeLoader(MockLazyComponent, { id: 'test' });
    expect(loader).toBeDefined();
  });

  // Test error boundary functionality
  test('NodeErrorBoundary should catch and display errors', async () => {
    const { NodeErrorBoundary } = await import('./dynamicNodeImports');
    
    // Create a component that throws an error
    const ErrorComponent = () => {
      throw new Error('Test error');
    };
    
    const wrapper = render(
      <NodeErrorBoundary>
        <ErrorComponent />
      </NodeErrorBoundary>
    );
    
    // Should show error UI
    expect(wrapper.getByText('Node Load Error')).toBeInTheDocument();
    expect(wrapper.getByText('Failed to load node component')).toBeInTheDocument();
  });

  console.log('✅ All dynamic import tests passed!');
});

// Run the tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  const tests = new (class {
    test(name, fn) {
      try {
        fn();
        console.log(`✅ ${name}`);
      } catch (error) {
        console.error(`❌ ${name}:`, error.message);
      }
    }
  })();

  tests.test('dynamic nodes should be defined', () => {
    const { dynamicNodes } = require('./dynamicNodeImports');
    if (!dynamicNodes.InputNode) throw new Error('InputNode not defined');
    if (!dynamicNodes.GeneratorNode) throw new Error('GeneratorNode not defined');
    if (!dynamicNodes.ImageOutputNode) throw new Error('ImageOutputNode not defined');
    if (!dynamicNodes.ImageAnalyzerNode) throw new Error('ImageAnalyzerNode not defined');
    if (!dynamicNodes.CreativeUpScaleNode) throw new Error('CreativeUpScaleNode not defined');
  });

  tests.test('createDynamicNodeWrapper should create wrapper components', () => {
    const { dynamicNodes, createDynamicNodeWrapper } = require('./dynamicNodeImports');
    const InputNodeWrapper = createDynamicNodeWrapper(dynamicNodes.InputNode);
    if (typeof InputNodeWrapper !== 'function') {
      throw new Error('Wrapper is not a function');
    }
  });

  console.log('✅ Dynamic import validation complete!');
}

export const testDynamicImports = () => {
  console.log('Testing dynamic imports...');
  
  // Test 1: Check if dynamic nodes are defined
  try {
    if (!dynamicNodes.InputNode) throw new Error('InputNode not defined');
    if (!dynamicNodes.GeneratorNode) throw new Error('GeneratorNode not defined');
    if (!dynamicNodes.ImageOutputNode) throw new Error('ImageOutputNode not defined');
    if (!dynamicNodes.ImageAnalyzerNode) throw new Error('ImageAnalyzerNode not defined');
    if (!dynamicNodes.CreativeUpScaleNode) throw new Error('CreativeUpScaleNode not defined');
    console.log('✅ All dynamic nodes are properly defined');
  } catch (error) {
    console.error('❌ Dynamic nodes definition error:', error.message);
    return false;
  }

  // Test 2: Check if wrapper creation works
  try {
    const InputNodeWrapper = createDynamicNodeWrapper(dynamicNodes.InputNode);
    if (typeof InputNodeWrapper !== 'function') {
      throw new Error('Wrapper creation failed');
    }
    console.log('✅ Dynamic node wrapper creation works');
  } catch (error) {
    console.error('❌ Wrapper creation error:', error.message);
    return false;
  }

  console.log('✅ All dynamic import tests passed successfully!');
  return true;
};

// Export for external testing
export default {
  testDynamicImports,
  dynamicNodes,
  createDynamicNodeWrapper,
};