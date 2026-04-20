import sys

filepath = 'frontend/src/EditorTopBar.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# Fix the broken useEffect block
broken_code = """  useEffect(() => {
    const handleOpenSettings = () => setShowProjectSettings(true);
    window.addEventListener('open-project-settings', handleOpenSettings);
    return (
    <>"""

fixed_code = """  useEffect(() => {
    const handleOpenSettings = () => setShowProjectSettings(true);
    window.addEventListener('open-project-settings', handleOpenSettings);
    return () => window.removeEventListener('open-project-settings', handleOpenSettings);
  }, []);

  return (
    <>"""

if broken_code in content:
    content = content.replace(broken_code, fixed_code)
    with open(filepath, 'w') as f:
        f.write(content)
    print("Fixed syntax error")
else:
    print("Could not find the exact broken block")
    
    # Try alternate find just in case
    broken_code_2 = """  useEffect(() => {
    const handleOpenSettings = () => setShowProjectSettings(true);
    window.addEventListener('open-project-settings', handleOpenSettings);
    return () => window.removeEventListener('open-project-settings', handleOpenSettings);
  }, []);"""
    
    if broken_code_2 not in content:
        print("Wait, let me inspect the file closer...")
        sys.exit(1)
