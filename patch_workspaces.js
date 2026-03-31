const fs = require('fs');

let jsx = fs.readFileSync('frontend/src/WorkspacesPage.jsx', 'utf8');

// Replace Text
jsx = jsx.replace(/Workflows/g, 'Workspaces');
jsx = jsx.replace(/workflows/g, 'workspaces');
jsx = jsx.replace(/Workflow/g, 'Workspace');
jsx = jsx.replace(/workflow/g, 'workspace');

// Replace "Build AI Image Pipelines, Deploy as API" with "FS Workspace" related text.
jsx = jsx.replace(
  /Build AI Image Pipelines, Deploy as API/,
  'FS Workspace'
);
jsx = jsx.replace(
  /Connect vision models, prompt enhancers, and image generators into workspaces\n\s*— then deploy them as API endpoints and add AI image features to any app./,
  'Create your own isolated spaces to manage your templates, tools, and visual AI pipelines across your organization.'
);

// We replaced 'FLORA canvas' with 'FS workspace' so we should update references to 'FLORA' or similar things if there are any.
// FLORA doesn't exist in the file previously, it only existed in the user's prompt description of the screenshots. 
// "replace FLORA canvas with FS workspace" means anywhere the text would normally say "FLORA canvas", we should say "FS workspace".
// I used "FS workspace" in the TemplateBuilderModal.jsx.

fs.writeFileSync('frontend/src/WorkspacesPage.jsx', jsx);
console.log("Patched WorkspacesPage.jsx");
