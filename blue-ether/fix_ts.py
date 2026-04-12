import re
import os
import sys

def fix_ts_errors(tsc_log_path):
    with open(tsc_log_path, 'r') as f:
        lines = f.readlines()

    file_edits = {}

    for line in lines:
        match_1484 = re.search(r"^(.+?)\((\d+),\d+\): error TS1484: '(.+?)' is a type", line)
        if match_1484:
            filepath, line_num, symbol = match_1484.groups()
            line_num = int(line_num) - 1
            if filepath not in file_edits:
                file_edits[filepath] = {}
            if line_num not in file_edits[filepath]:
                file_edits[filepath][line_num] = set()
            file_edits[filepath][line_num].add(('type_import', symbol))
            continue

        match_6133 = re.search(r"^(.+?)\((\d+),\d+\): error TS6133: '(.*?)' is declared but its value is never read", line)
        if match_6133:
            filepath, line_num, symbol = match_6133.groups()
            line_num = int(line_num) - 1
            if filepath not in file_edits:
                file_edits[filepath] = {}
            if line_num not in file_edits[filepath]:
                file_edits[filepath][line_num] = set()
            file_edits[filepath][line_num].add(('unused', symbol))
            continue

    # Apply edits
    for filepath, edits in file_edits.items():
        if not os.path.exists(filepath):
            continue
        
        with open(filepath, 'r') as f:
            content_lines = f.readlines()
        
        for line_num, actions in edits.items():
            if line_num >= len(content_lines):
                continue
            
            new_line = content_lines[line_num]
            
            for action, symbol in actions:
                if action == 'type_import':
                    # Need to replace symbol with `type symbol` inside import statement {}
                    # Simple hack: replace `{ symbol` with `{ type symbol`, `, symbol` with `, type symbol`
                    new_line = re.sub(r"(?<!type\s)\b" + re.escape(symbol) + r"\b", f"type {symbol}", new_line)
                elif action == 'unused':
                    if symbol == 'React':
                        # If the line is "import React from 'react';"
                        if "import React from 'react';" in new_line or 'import React from "react";' in new_line:
                            new_line = new_line.replace("import React from", "// import React from")
                        elif "import React," in new_line:
                            new_line = new_line.replace("import React,", "import")
            
            content_lines[line_num] = new_line
        
        with open(filepath, 'w') as f:
            f.writelines(content_lines)

    print(f"Processed {len(file_edits)} files.")

if __name__ == "__main__":
    fix_ts_errors('tsc_output.txt')
