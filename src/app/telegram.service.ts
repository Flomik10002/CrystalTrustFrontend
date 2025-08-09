import { Injectable } from '@angular/core';

declare global {
  interface Window {
    Telegram: any;
  }
}

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private _initData = '';
  private _initDataObj: Record<string, string> = {};

  constructor() {
    const tg = window.Telegram?.WebApp;

    if (tg && tg.initData) {
      this._initData = tg.initData;
    } else {

      const hash = decodeURIComponent(window.location.hash);
      const match = hash.match(/tgWebAppData=(.+?)(?:&|$)/);
      if (match) {
        this._initData = match[1];
      }
    }

    if (this._initData) {
      try {
        this._initDataObj = Object.fromEntries(new URLSearchParams(this._initData));
      } catch (e) {
        console.error('Unable to parse initData', e);
      }
    }
  }

  get initData(): string {
    return this._initData;
  }

  get initDataRaw() {
    return this._initData;
  }

  get initDataObj() {
    return this._initDataObj;
  }

  get userId(): string | undefined {
    const user = this._initDataObj['user'];
    if (!user) return undefined;
    try {
      return JSON.parse(user)?.id?.toString();
    } catch {
      return undefined;
    }
  }
}
