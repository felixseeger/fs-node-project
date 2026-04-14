import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  'const [currentPage, setCurrentPage] = useState<PageType>(\'landing\');',
  'const [currentPage, setCurrentPage] = useState<PageType>(\'editor\');'
);

fs.writeFileSync('src/App.tsx', content);
console.log("Patched App.tsx to start at editor");
