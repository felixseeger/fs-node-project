import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace onAuthStateChanged logic
content = content.replace(
  /const unsubscribeAuth = onAuthStateChanged\(auth, \(user\) => \{[\s\S]*?\}\);/m,
  `const unsubscribeAuth = () => {};
      setIsAuthenticated(true);
      setCurrentUserId("testuser@nodeproject.dev");
      setCurrentUserEmail("testuser@nodeproject.dev");
      initializeProfile("testuser@nodeproject.dev", "testuser@nodeproject.dev", "Test User");
      if (!sessionStorage.getItem(SLP_KEY)) {
        setShowSystemLoading(true);
      }`
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to totally bypass auth");
