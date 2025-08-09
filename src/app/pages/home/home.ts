// import {Component, OnDestroy, OnInit} from '@angular/core';
// import {HeaderComponent} from '../../shared/header.component/header.component';
// import {StoryCard} from '../../components/story-card/story-card';
// import {AccountCard} from '../../components/account-card/account-card';
// import {OperationsSummary} from '../../components/operations-summary/operations-summary';
// import {RouterLink, RouterLinkActive} from '@angular/router';
// import {AccountDto, Crystal, SummaryEntry} from '../../api/crystal';
// import {NgForOf, NgIf} from '@angular/common';
//
// @Component({
//   selector: 'app-home',
//   imports: [
//     HeaderComponent,
//     StoryCard,
//     AccountCard,
//     OperationsSummary,
//     RouterLink,
//     RouterLinkActive,
//     NgForOf,
//     NgIf
//   ],
//   templateUrl: './home.html',
//   styleUrl: './home.css'
// })
// export class Home implements OnInit, OnDestroy{
//   nickname = '';
//   avatarUrl = '';
//   accounts: AccountDto[] = [];
//   summaryTotal = 0;
//   summaryMonth = '';
//   summaryEntries: SummaryEntry[] = [];
//   loading = true;
//
//   private intervalId: any;
//
//   constructor(private api: Crystal) {}
//
//   ngOnInit(): void {
//     this.fetchData();
//     this.intervalId = setInterval(() => this.fetchData(), 3000);
//   }
//
//   ngOnDestroy(): void {
//     clearInterval(this.intervalId);
//   }
//
//   private fetchData(): void {
//     this.api.getHomeData().subscribe({
//       next: ({ profile, accountsWrap, summary }) => {
//         this.nickname = profile.nickname;
//         this.avatarUrl = `https://mc-heads.net/avatar/${profile.nickname}`;
//
//         const updated: AccountDto[] = [];
//         let personal: AccountDto | null = null;
//
//         for (const newAcc of accountsWrap.accounts) {
//           const existing = this.accounts.find(a => a.id === newAcc.id);
//           if (existing) {
//             existing.balance = newAcc.balance;
//             updated.push(existing);
//           } else {
//             updated.push(newAcc);
//           }
//
//           if (newAcc.type === 'personal') {
//             personal = existing ?? newAcc;
//           }
//         }
//
//         this.accounts = personal
//           ? [personal, ...updated.filter(a => a.id !== personal!.id)]
//           : updated;
//
//         this.summaryTotal = summary.total;
//         this.summaryMonth = summary.monthLabel;
//         this.summaryEntries = summary.entries;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Ошибка при обновлении данных:', err);
//         this.loading = false;
//       },
//     });
//   }
// }
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/header.component/header.component';
import { StoryCard } from '../../components/story-card/story-card';
import { AccountCard } from '../../components/account-card/account-card';
import { OperationsSummary } from '../../components/operations-summary/operations-summary';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountDto, Crystal, SummaryEntry } from '../../api/crystal';
import { NgForOf, NgIf } from '@angular/common';

// +++ ADD:
import { ElementRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';

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
export class Home implements OnInit, OnDestroy, AfterViewInit {
  nickname = '';
  avatarUrl = '';
  accounts: AccountDto[] = [];
  summaryTotal = 0;
  summaryMonth = '';
  summaryEntries: SummaryEntry[] = [];
  loading = true;

  private intervalId: any;

  // +++ ADD: stories container ref
  @ViewChild('stories', { static: true }) storiesRef!: ElementRef<HTMLDivElement>;

  // +++ ADD: scroll settings
  private dragScrollSpeed = 3.2;   // мышь: чувствительность перетаскивания
  private wheelSpeed = 2.5;        // колесо: множитель delta

  // +++ ADD: drag state
  private dragging = false;
  private pid: number | null = null;
  private startX = 0;
  private startLeft = 0;

  // +++ ADD: wheel handler ref
  private wheelHandler?: (e: WheelEvent) => void;

  constructor(private api: Crystal, private zone: NgZone) {}

  ngOnInit(): void {
    this.fetchData();
    this.intervalId = setInterval(() => this.fetchData(), 3000);
  }

  // +++ ADD: attach non-passive wheel listener
  ngAfterViewInit(): void {
    const el = this.storiesRef?.nativeElement;
    if (!el) return;
    this.zone.runOutsideAngular(() => {
      this.wheelHandler = (e: WheelEvent) => {
        // переводим вертикальное колесо/трекпад в горизонтальный скролл
        const base = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        el.scrollLeft += base * this.wheelSpeed;
        e.preventDefault();
      };
      el.addEventListener('wheel', this.wheelHandler!, { passive: false });
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (this.wheelHandler && this.storiesRef) {
      this.storiesRef.nativeElement.removeEventListener('wheel', this.wheelHandler);
    }
  }

  private fetchData(): void {
    this.api.getHomeData().subscribe({
      next: ({ profile, accountsWrap, summary }) => {
        this.nickname = profile.nickname;
        this.avatarUrl = `https://mc-heads.net/avatar/${profile.nickname}`;

        const updated: AccountDto[] = [];
        let personal: AccountDto | null = null;

        for (const newAcc of accountsWrap.accounts) {
          const existing = this.accounts.find(a => a.id === newAcc.id);
          if (existing) {
            existing.balance = newAcc.balance;
            updated.push(existing);
          } else {
            updated.push(newAcc);
          }
          if (newAcc.type === 'personal') {
            personal = existing ?? newAcc;
          }
        }

        this.accounts = personal
          ? [personal, ...updated.filter(a => a.id !== personal!.id)]
          : updated;

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

  // +++ ADD: mouse-drag handlers for stories
  onStoriesDown(ev: PointerEvent) {
    if (ev.pointerType !== 'mouse' || ev.button !== 0) return; // только ЛКМ мыши
    const el = this.storiesRef.nativeElement;
    this.dragging = true;
    this.pid = ev.pointerId;
    el.setPointerCapture(ev.pointerId);
    this.startX = ev.clientX;
    this.startLeft = el.scrollLeft;
    el.classList.add('cursor-grabbing');
    ev.preventDefault();
  }

  onStoriesMove(ev: PointerEvent) {
    if (!this.dragging || ev.pointerId !== this.pid) return;
    const el = this.storiesRef.nativeElement;
    const dx = ev.clientX - this.startX;
    el.scrollLeft = this.startLeft - dx * this.dragScrollSpeed;
    ev.preventDefault();
  }

  onStoriesUp(ev: PointerEvent) {
    if (!this.dragging || (this.pid !== null && ev.pointerId !== this.pid)) return;
    const el = this.storiesRef.nativeElement;
    try { el.releasePointerCapture(this.pid!); } catch {}
    this.dragging = false;
    this.pid = null;
    el.classList.remove('cursor-grabbing');
  }
}
