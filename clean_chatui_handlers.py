import sys
import re

filepath = 'frontend/src/components/ChatUI.tsx'
with open(filepath, 'r') as f:
    content = f.read()

# 1. Remove the imports from workflowJSON
import_block = """import {
  exportWorkflowToFile,
  openFilePicker,
  importWorkflowFromFile,
  prepareWorkflowForExport,
  handleImportedWorkflow,
  generateTestWorkflow,
  testRoundTrip,
  getWorkflowSummary,
} from '../utils/workflowJSON';"""
content = content.replace(import_block, "")

# 2. Remove the import of chatToMarkdown
chat_import = """// @ts-ignore
import { chatToMarkdown } from '../../../lib/api/utils/chatMapper.js';"""
content = content.replace(chat_import, "")

# 3. Use regex to remove handlers safely
# handleExportChatMarkdown
content = re.sub(r'  const handleExportChatMarkdown = useCallback\(\(\) => \{.*?\n  \}, \[messages, notifyUser, activeChat\]\);\n', '', content, flags=re.DOTALL)

# handleExportChatJSON
content = re.sub(r'  const handleExportChatJSON = useCallback\(\(\) => \{.*?\n  \}, \[messages, notifyUser, activeChat\]\);\n', '', content, flags=re.DOTALL)

# handleExportWorkflow
content = re.sub(r'  const handleExportWorkflow = \(\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

# handleImportWorkflow
content = re.sub(r'  const handleImportWorkflow = async \(\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

# handleTestRoundTrip
content = re.sub(r'  const handleTestRoundTrip = \(\) => \{.*?\n  \};\n', '', content, flags=re.DOTALL)

with open(filepath, 'w') as f:
    f.write(content)

print("Handlers removed successfully")
