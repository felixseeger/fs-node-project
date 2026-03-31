with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    content = f.read()

# I want the end to be exactly:
#           <div className="ms-help-date" style={{ marginTop: 4 }}>Last updated Mar 31, 2026</div>
#         </div>
#       </div>
#     </div>
#   );
# }

import re
content = re.sub(r'        </div>\s+</div>\s+</div>\s+</div>\s+\);\n}', r'        </div>\n      </div>\n    </div>\n  );\n}', content)

with open("frontend/src/GooeyNodesMenu.jsx", "w") as f:
    f.write(content)
