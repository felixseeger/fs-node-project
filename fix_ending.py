import os

with open('frontend/src/App.jsx', 'r') as f:
    content = f.read()

ending_to_fix = """            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#333" />
          </ReactFlow>
        </div>
          </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}"""

correct_ending = """            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#333" />
          </ReactFlow>
        </div>
      </div>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
}"""

if ending_to_fix in content:
    content = content.replace(ending_to_fix, correct_ending)
    with open('frontend/src/App.jsx', 'w') as f:
        f.write(content)
    print("Fixed ending")
else:
    print("Could not find ending")
