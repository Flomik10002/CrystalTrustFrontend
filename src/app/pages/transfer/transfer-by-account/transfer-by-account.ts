import { Component, OnInit, OnDestroy, signal, computed, inject, DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

import { HeaderComponent } from '../../../shared/header.component/header.component';
import { CardSliderComponent, Card } from '../../../components/card-slider/card-slider';
import { AmountInput } from '../../../components/amount-input/amount-input';
import { Crystal, AccountDto, TransferPayload } from '../../../api/crystal';

@Component({
  selector: 'app-transfer-by-account',
  standalone: true,
  imports: [
    FormsModule,
    RouterModule,
    HeaderComponent,
    CardSliderComponent,
    AmountInput,
    NgIf,
  ],
  templateUrl: './transfer-by-account.html',
  styleUrls: ['./transfer-by-account.css'],
})
export class TransferByAccount implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly accounts = signal<AccountDto[]>([]);

  readonly pending = signal(false);
  readonly error   = signal('');

  selectedCardIndex = 0;
  cardNumber  = '';
  customAmount = '';
  message      = '';

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

  readonly canSubmit = computed(() =>
    /^\d{3,4}$/.test(this.cardNumber.trim()) &&
    Number(this.customAmount) > 0 &&
    this.accounts().length > 0 &&
    this.cardNumber.trim() !== String(this.selectedAccount.id)
  );

  constructor(
    private readonly api: Crystal,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.api.getAccounts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(res => this.accounts.set(
          res.accounts?.sort(a => (a.type === 'personal' ? -1 : 1)) ?? []
        ))
      )
      .subscribe({
        error: () => this.error.set('Не удалось загрузить счета'),
      });
  }

  ngOnDestroy(): void {}

  private get selectedAccount(): AccountDto { return this.accounts()[this.selectedCardIndex]!; }

  clearError(): void { this.error.set(''); }

  blurActive(): void {
    const el = document.activeElement as HTMLElement | null;
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as any).isContentEditable)) {
      el.blur();
    }
  }

  onBackdropPointer(e: Event): void {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    // Если тапнули по input/textarea/contenteditable — ничего не делаем
    if (t.closest('input, textarea, [contenteditable="true"]')) return;
    // Иначе закрываем клавиатуру
    this.blurActive();
  }

  async submitTransfer(): Promise<void> {
    if (!this.canSubmit()) return;
    this.pending.set(true);

    const payload: TransferPayload = {
      recipient_type: 'account',
      recipient: this.cardNumber.trim(),
      amount: Number(this.customAmount),
      comment: this.message.slice(0, 40),
      from_account_id: this.selectedAccount.id,
    };

    try {
      await this.api.transfer( payload).toPromise();
      this.router.navigate(
        ['/transfer/pending-transfer'],
        { queryParams: { amount: payload.amount, to: this.cardNumber.trim() } }
      );
    } catch (err: any) {
      this.error.set(err?.error?.detail ?? err?.message ?? 'Неизвестная ошибка');
    } finally {
      this.pending.set(false);
    }
  }
}
