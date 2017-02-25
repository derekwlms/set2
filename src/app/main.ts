import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';

import { AppModule } from './app.module';

// Production mode, turn off console logging:
enableProdMode();
console.log = function() {};

platformBrowserDynamic().bootstrapModule(AppModule);
