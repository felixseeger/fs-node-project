/**
 * Workflow Template Store
 *
 * LocalStorage-backed registry for reusable Workflow Templates.
 * A template packages a slice of canvas (nodes + edges) plus a curated set of
 * inputs and outputs (handle bindings) so it can be re-instantiated as a single
 * WorkflowNode on the canvas, or surfaced through the simplified app interface.
 */

const KEY = 'nodespace_workflow_templates_v1';
const EVENT = 'nodespace:templates-updated';

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(all) {
  localStorage.setItem(KEY, JSON.stringify(all));
  try {
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch {}
}

export function listTemplates() {
  return read();
}

export function getTemplate(id) {
  return read().find((t) => t.id === id) || null;
}

export function saveTemplate(tpl) {
  const all = read();
  const idx = all.findIndex((t) => t.id === tpl.id);
  const stamped = { ...tpl, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = stamped;
  else all.unshift({ ...stamped, createdAt: stamped.updatedAt });
  write(all);
  return stamped;
}

export function deleteTemplate(id) {
  write(read().filter((t) => t.id !== id));
}

export function subscribeTemplates(handler) {
  const fn = () => handler(read());
  window.addEventListener(EVENT, fn);
  return () => window.removeEventListener(EVENT, fn);
}
