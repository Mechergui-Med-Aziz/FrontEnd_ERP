/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
import 'zone.js/testing';

/***************************************************************************************************
 * Import Angular testing utilities
 */
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

/***************************************************************************************************
 * Initialize the Angular testing environment.
 */
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

/***************************************************************************************************
 * Load all the .spec.ts files in the project.
 */
const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
