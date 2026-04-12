const fs = require('fs');

const path = 'src/hooks/useBilling.ts';
let content = fs.readFileSync(path, 'utf-8');

content = content.replace(
  "import { useAuth } from '../context/AuthContext';",
  ""
);

content = content.replace(
  "export function useBilling() {",
  "export function useBilling(uid: string | null | undefined) {"
);

content = content.replace(
  "const { user } = useAuth();",
  ""
);

content = content.replaceAll(
  "user.uid",
  "uid!"
);

content = content.replaceAll(
  "user",
  "uid"
);

fs.writeFileSync(path, content, 'utf-8');
console.log('Patched useBilling.ts');
