const fs = require('fs');

let gooey = fs.readFileSync('frontend/src/GooeyNodesMenu.jsx', 'utf8');

const dragProps = `
                    draggable={!!item.type}
                    onDragStart={(e) => {
                      if (item.type) {
                        e.dataTransfer.setData('application/reactflow', item.type);
                        e.dataTransfer.effectAllowed = 'move';
                      }
                    }}
`;

// Patch filteredNodes buttons
const oldFilteredNode = `onClick={() => {
                      onAddNode(item.type, item.defaults);
                      setSearchQuery('');
                      setIsOpen(false);
                    }}`;
gooey = gooey.replace(oldFilteredNode, `${dragProps}                    ${oldFilteredNode}`);

// Patch QUICK_ADD_SECTIONS buttons
const oldQuickAddNode = `onClick={() => {
                          if (item.type) {
                            onAddNode(item.type, {});
                            setIsOpen(false);
                            setActiveSubMenu(null);
                          }
                        }}`;
gooey = gooey.replace(oldQuickAddNode, `${dragProps}                        ${oldQuickAddNode}`);

// Patch subMenuNodes buttons
const oldSubMenuNode = `onClick={() => {
                    onAddNode(item.type, item.defaults);
                    setIsOpen(false);
                    setActiveSubMenu(null);
                  }}`;
gooey = gooey.replace(oldSubMenuNode, `${dragProps}                  ${oldSubMenuNode}`);

fs.writeFileSync('frontend/src/GooeyNodesMenu.jsx', gooey);
console.log("Patched GooeyNodesMenu with D&D");
