import { bootstrap } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ScheduleAppComponent, environment } from './app/';

if (environment.production) {
  enableProdMode();
}

bootstrap(ScheduleAppComponent, [HTTP_PROVIDERS]);
