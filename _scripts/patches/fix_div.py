with open("frontend/src/GooeyNodesMenu.jsx", "r") as f:
    lines = f.readlines()

while lines[-1].strip() != "}" and lines[-1].strip() != "</div>":
    lines.pop()

# we expect exactly:
#       </div>
#     </div>
#   );
# }
# So we need 2 closing divs, not 3.

closing_divs = 0
for line in reversed(lines):
    if "</div>" in line:
        closing_divs += 1
        
print(f"Total closing divs at end: {closing_divs}")
