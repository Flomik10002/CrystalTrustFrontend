// transfer-between-accounts.ts
import {
  Component, OnInit, OnDestroy, signal, computed,
  inject, DestroyRef
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule, Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {tap} from 'rxjs';

import {HeaderComponent} from '../../../shared/header.component/header.component';
import {CardSliderComponent, Card} from '../../../components/card-slider/card-slider';
import {AmountInput} from '../../../components/amount-input/amount-input';
import {Crystal, AccountDto, TransferPayload} from '../../../api/crystal';

@Component({
  selector: 'app-transfer-between-accounts',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    NgIf,
    HeaderComponent,
    CardSliderComponent,
    AmountInput,
  ],
  templateUrl: './transfer-between-accounts.html',
  styleUrls: ['./transfer-between-accounts.css'],
})
export class TransferBetweenAccounts implements OnInit, OnDestroy {
  /* --- signals --------------------------------------------------------- */
  private readonly destroyRef = inject(DestroyRef);
  private readonly accounts   = signal<AccountDto[]>([]);   // ТЕПЕРЬ уже отсортированный массив

  readonly pending = signal(false);
  readonly error   = signal('');
  fromCardIndex = 0;
  toCardIndex   = 0;
  customAmount  = '';

  readonly sliderCards = computed<Card[]>(() =>
    this.accounts().map(acc => ({
      id:       acc.id,
      type:     acc.type,
      balance:  acc.balance,
      label:    acc.type === 'personal' ? 'Личный счёт' : acc.business?.name ?? 'Бизнес‑счёт',
      number:   `CRYSTAL-${String(acc.id).padStart(acc.type === 'personal' ? 3 : 4, '0')}`,
      bgClass:  acc.type === 'personal' ? 'bg-card' : 'bg-card-muted',
    }))
  );

  readonly canSubmit = computed(() =>
    Number(this.customAmount) > 0 &&
    this.accounts().length >= 2 &&
    this.fromCardIndex !== this.toCardIndex
  );

  constructor(
    private readonly api: Crystal,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.api.getAccounts()
      .pipe(
        tap(res => {
          const sorted = (res.accounts ?? [])
            .sort((a, b) => (a.type === 'personal' ? -1 : 1) - (b.type === 'personal' ? -1 : 1));

          this.accounts.set(sorted);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({ error: () => this.error.set('Не удалось загрузить счета') });
  }

  ngOnDestroy() {}

  private get fromAccount() { return this.accounts()[this.fromCardIndex]!; }
  private get toAccount()   { return this.accounts()[this.toCardIndex]!;   }
  clearError()              { this.error.set(''); }

  async submitTransfer() {
    if (!this.canSubmit()) return;
    this.pending.set(true);

    const payload: TransferPayload = {
      recipient_type: 'account',
      recipient: String(this.toAccount.id),
      amount: Number(this.customAmount),
      from_account_id: this.fromAccount.id,
    };

    try {
      await this.api.transfer( payload).toPromise();
      this.router.navigate(
        ['/transfer/internal-transfer-success'],
        { queryParams: { amount: payload.amount } }
      );
    } catch (e: any) {
      this.error.set(e?.error?.detail ?? e?.message ?? 'Неизвестная ошибка');
    } finally {
      this.pending.set(false);
    }
  }
}
