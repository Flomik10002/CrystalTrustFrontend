import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {config} from '../../config';
import {TelegramService} from '../telegram.service';

export interface ProfileDto {
  nickname: string;
  tg_id: number;
}

export interface SummaryDto {
  total: number;
  monthLabel: string;
  entries: SummaryEntry[];
}

export interface AccountDto {
  id: number;
  type: 'personal' | 'business';
  balance: number;
  business?: { name: string; tag: string; category: string } | null;
}

export interface SummaryEntry {
  name: string;
  amount: number;
  type: string;
  date: string;
}

export interface TransactionEntry {
  id: string;
  name: string;
  amount: number;
  type: string;
  category: string;
  from: string;
  from_account: string;
  to: string;
  to_account: string;
  avatar: string;
  timestamp: string;
}

export interface TransactionDay {
  date: string;
  dailyTotal: string;
  items: TransactionEntry[];
}

export interface RecipientDto {
  nickname: string;
  avatar: string
}

export interface Recipient {
  name: string;
  avatar: string
}

export interface TransferPayload {
  recipient_type: 'nickname' | 'account';
  recipient: string;
  amount: number;
  comment?: string;
  from_account_id?: number;
}

@Injectable({ providedIn: 'root' })
export class Crystal {
  private base = `${config.apiUrl}`;

  constructor(
    private http: HttpClient,
    private telegram: TelegramService
  ) {}

  private getHeaders() {
    return {
      headers: {
        'X-Telegram-InitData': this.telegram.initData,
      }
    };
  }

  createBusiness(body: { name: string; tag: string; category: string }): Observable<any> {
    return this.http.post(`${this.base}/business/create-business`, body, this.getHeaders());
  }

  getProfile(): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(`${this.base}/me/profile`, this.getHeaders());
  }

  getAccounts(): Observable<{ accounts: AccountDto[] }> {
    return this.http.get<{ accounts: AccountDto[] }>(`${this.base}/me/accounts`, this.getHeaders());
  }

  getSummary(): Observable<SummaryDto> {
    return this.http.get<SummaryDto>(`${this.base}/me/summary`, this.getHeaders());
  }

  getTransactions(): Observable<TransactionDay[]> {
    return this.http.get<TransactionDay[]>(`${this.base}/me/transactions`, this.getHeaders());
  }

  getRecipients(): Observable<RecipientDto[]> {
    return this.http.get<RecipientDto[]>(`${this.base}/me/recent-recipients`, this.getHeaders());
  }

  transfer(payload: TransferPayload) {
    return this.http.post(`${this.base}/me/transfer`, payload, this.getHeaders());
  }

  getHomeData() {
    return forkJoin({
      profile: this.getProfile(),
      accountsWrap: this.getAccounts(),
      summary: this.getSummary(),
    });
  }

}
