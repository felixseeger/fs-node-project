# Findings

- **Frontend Linter Output**: 124 problems (94 errors, 30 warnings). Several critical React warnings (`react-hooks/set-state-in-effect`, `react-hooks/purity`).
- **Tests Output**: JS tests failing due to `ReferenceError: require is not defined in ES module scope` because the project uses `"type": "module"`.
- **Backend Size**: `api/server.js` is ~77KB and houses many endpoints, some of which are already imported from `../lib/api/routes/`.
