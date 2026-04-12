with open('src/App.tsx', 'r') as f:
    content = f.read()

# I need to swap the order of handleConnectEnd and onConnect.
# Actually, I can just change const onConnect to use a ref, or just move onConnect up.
# Let's find the blocks.

# This is safer to do via replace if we can uniquely identify them, but they are quite large.
# Let's use a regex to find both and swap them.

import re
match_onConnect = re.search(r'(const onConnect: OnConnect = useCallback\([\s\S]*?\n  \);)', content)
if match_onConnect:
    onConnect_str = match_onConnect.group(1)
    content = content.replace(onConnect_str, '')
    
    match_handleConnectEnd = re.search(r'(const handleConnectEnd = useCallback\([\s\S]*?\n  \);)', content)
    if match_handleConnectEnd:
        handleConnectEnd_str = match_handleConnectEnd.group(1)
        content = content.replace(handleConnectEnd_str, onConnect_str + '\n\n' + handleConnectEnd_str)
        with open('src/App.tsx', 'w') as f:
            f.write(content)
        print("Swapped onConnect and handleConnectEnd.")
    else:
        print("Could not find handleConnectEnd.")
else:
    print("Could not find onConnect.")
