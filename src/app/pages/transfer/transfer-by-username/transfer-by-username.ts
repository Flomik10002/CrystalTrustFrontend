// transfer-by-username.ts
import {
  Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';
import {AmountInput} from '../../../components/amount-input/amount-input';
import {CardSliderComponent, Card} from '../../../components/card-slider/card-slider';
import {HeaderComponent} from '../../../shared/header.component/header.component';
import {Crystal, AccountDto, TransferPayload} from '../../../api/crystal';

@Component({
  selector: 'app-transfer-by-username',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterModule,
    HeaderComponent,
    CardSliderComponent,
    AmountInput,
  ],
  templateUrl: './transfer-by-username.html',
  styleUrls: ['./transfer-by-username.css'],
})
export class TransferByUsername implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  private readonly accounts = signal<AccountDto[]>([]);
  private readonly sortedAccounts = computed(() =>
    [...this.accounts()].sort(a => a.type === 'personal' ? -1 : 1)
  );
  readonly pending = signal(false);
  readonly error = signal('');

  nickname = '';
  customAmount = '';
  message = '';
  selectedCardIndex = 0;

  readonly sliderCards = computed<Card[]>(() =>
    [...this.accounts()]
      .sort(a => a.type === 'personal' ? -1 : 1)
      .map(acc => ({
        id: acc.id,
        type: acc.type,
        balance: acc.balance,
        label: acc.type === 'personal'
          ? 'Личный счёт'
          : acc.business?.name ?? 'Бизнес‑счёт',
        number: `CRYSTAL-${String(acc.id).padStart(
          acc.type === 'personal' ? 3 : 4, '0')}`,
        bgClass: acc.type === 'personal' ? 'bg-card' : 'bg-card-muted',
      }))
  );

  get canSubmit(): boolean {
    return (
      this.nickname.trim().length >= 3 &&
      Number(this.customAmount) > 0 &&
      this.accounts().length  > 0
    );
  }

  constructor(
    private readonly api: Crystal,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.nickname = this.route.snapshot.queryParamMap.get('to') ?? '';
    this.route.queryParamMap
      .pipe(
        tap(map => this.nickname = map.get('to') ?? ''),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.api.getAccounts()
      .pipe(
        tap(res => this.accounts.set(res.accounts ?? [])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        error: () => this.error.set('Не удалось загрузить счета'),
      });
  }

  ngOnDestroy(): void {
  }

  private get selectedAccount(): AccountDto {
    return this.sortedAccounts()[this.selectedCardIndex]!;
  }

  clearError(): void {
    this.error.set('');
  }

  async submitTransfer(): Promise<void> {
    if (!this.canSubmit) return;
    this.pending.set(true);

    const payload: TransferPayload = {
      recipient_type: 'nickname',
      recipient: this.nickname.trim(),
      amount: Number(this.customAmount),
      comment: this.message.slice(0, 40),
      from_account_id: this.selectedAccount.id,
    };

    try {
      await this.api.transfer( payload).toPromise();
      await this.router.navigate(
        ['/transfer/pending-transfer'],
        { queryParams: { amount: payload.amount, to: payload.recipient } }
      );
    } catch (err: any) {
      this.error.set(err?.error?.detail ?? err?.message ?? 'Неизвестная ошибка');
    } finally {
      this.pending.set(false);
    }
  }
}
