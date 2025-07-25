// telegram.service.ts
import { Injectable } from '@angular/core';

declare global { interface Window { Telegram: any } }

@Injectable({ providedIn: 'root' })
export class TelegramService {
  private _initData = '';
  private _initDataObj: Record<string, string> = {};

  constructor() {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      this._initData = tg.initData ?? '';          // Сырая строка
      this._initDataObj = Object.fromEntries(
        new URLSearchParams(this._initData)
      );
    } else {
      console.warn('⚠️ Telegram WebApp object not found.');
    }
  }

  /** Точно та строка, что уйдёт в заголовок */
  get initDataRaw() { return this._initData; }

  /** Уже распарсенный JS‑объект (удобно для логов) */
  get initDataObj() { return this._initDataObj; }
}

