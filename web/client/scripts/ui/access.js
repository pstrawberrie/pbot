/* Accessibility Scripting */

// Imports
import version from 'ally.js/esm/version';
import queryFocusable from 'ally.js/esm/query/focusable';

// Ally
console.log(`--> ally.js v${version}`);
console.log('focusable elements', queryFocusable());
