import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// 1. เพิ่มบรรทัดนี้เข้ามา
import { provideHttpClient } from '@angular/common/http'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. เพิ่มคำสั่งนี้ลงไป
    provideHttpClient() 
  ]
};