import re
import os
import glob

def fix_frontend_stories():
    for filepath in glob.glob("src/frontend-stories/**/*.tsx", recursive=True):
        with open(filepath, 'r') as f:
            content = f.read()

        content = content.replace('@storybook/react-vite', '@storybook/react')
        
        content = content.replace("import { ReactNode }", "import type { ReactNode }")
        content = content.replace("import { ReactNode,", "import type { ReactNode,")
        content = content.replace(", ReactNode }", ", type ReactNode }")
        content = content.replace("import { FC }", "import type { FC }")
        content = content.replace("import { FC,", "import type { FC,")
        content = content.replace(", FC }", ", type FC }")

        # Comment out the unused control variable in DesignTokens
        if "DesignTokens.stories.tsx" in filepath:
            content = content.replace("const control = ", "// const control = ")

        with open(filepath, 'w') as f:
            f.write(content)

    print("Fixed frontend-stories")

if __name__ == "__main__":
    fix_frontend_stories()
