import {Component, OnDestroy} from '@angular/core';
import {HeaderComponent} from '../../shared/header.component/header.component';
import {StoryCard} from '../../components/story-card/story-card';
import {AccountCard} from '../../components/account-card/account-card';
import {OperationsSummary} from '../../components/operations-summary/operations-summary';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AccountDto, Crystal, SummaryEntry} from '../../api/crystal';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [
    HeaderComponent,
    StoryCard,
    AccountCard,
    OperationsSummary,
    RouterLink,
    RouterLinkActive,
    NgForOf,
    NgIf
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnDestroy{
  nickname = '';
  avatarUrl = '';
  accounts: AccountDto[] = [];
  summaryTotal = 0;
  summaryMonth = '';
  summaryEntries: SummaryEntry[] = [];
  loading = true;

  private intervalId: any;

  constructor(private api: Crystal) {}

  ngOnInit(): void {
    this.fetchData(); // сразу первый вызов
    this.intervalId = setInterval(() => this.fetchData(), 1000); // потом каждую секунду
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private fetchData(): void {
    this.api.getHomeData().subscribe({
      next: ({ profile, accountsWrap, summary }) => {
        this.nickname = profile.nickname;
        this.avatarUrl = `https://mc-heads.net/avatar/${profile.nickname}`;
        this.accounts = accountsWrap.accounts.sort(a =>
          a.type === 'personal' ? -1 : 1
        );
        this.summaryTotal = summary.total;
        this.summaryMonth = summary.monthLabel;
        this.summaryEntries = summary.entries;
        this.loading = false;
      },
      error: (err) => {
        console.error('Ошибка при обновлении данных:', err);
        this.loading = false;
      },
    });
  }

}
