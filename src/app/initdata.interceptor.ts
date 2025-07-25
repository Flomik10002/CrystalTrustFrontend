import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TelegramService } from './telegram.service';

@Injectable()
export class InitDataInterceptor implements HttpInterceptor {
  constructor(private tg: TelegramService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!req.url.startsWith('/api')) return next.handle(req);

    const raw = this.tg.initDataRaw;
    if (raw) {
      req = req.clone({
        setHeaders: {
          Authorization: `tma ${encodeURIComponent(raw)}`
        }
      });
    }
    return next.handle(req);
  }
}
