import {Component, computed, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header.component/header.component';
import { Crystal, TransactionDay } from '../../api/crystal';
import { finalize } from 'rxjs';

export interface TxItem {
  id: string;
  name?: string | null;
  amount: number;
  type: string;
  from?: string | null;
  from_account?: string | null;
  to?: string | null;
  to_account?: string | null;
  avatar?: string | null;
  timestamp: string;
}

@Component({
  selector: 'app-transaction-history',
  imports: [
    FormsModule,
    NgForOf,
    RouterLink,
    NgClass,
    HeaderComponent,
    NgIf
  ],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css'
})

export class TransactionHistory implements OnInit {
  @ViewChild('amountInput', { static: true }) amountRef!: ElementRef<HTMLInputElement>;

  private api = inject(Crystal);

  private txData = signal<TransactionDay[]>([]);
  searchQuery = signal('');

  loading = signal(false);

  filteredTransactions = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.txData()
      .map(day => ({
        ...day,
        items: day.items.filter(tx =>
          [tx.name, tx.type, tx.from, tx.to,
            tx.from_account, tx.to_account]
            .some(s => s.toLowerCase().includes(q))
        )
      }))
      .filter(day => day.items.length);
  });

  ngOnInit() {
    this.fetchTxData();
    setInterval(() => this.fetchTxData(), 3000);
  }

  displayName(tx: TxItem): string {
    if (tx.name !== undefined && tx.name !== null) {
      return tx.name;
    }

    const fromNorm = (tx.from ?? '').trim();
    const toNorm = (tx.to ?? '').trim();
    if (fromNorm && toNorm && fromNorm.toLowerCase() === toNorm.toLowerCase()) {
      return 'CrystalBank';
    }

    return (tx.amount > 0 ? fromNorm : toNorm) || 'CrystalBank';
  }

  blurAmount(): void {
    this.amountRef?.nativeElement.blur();
  }

  onContainerPointerDown(ev: Event): void {
    const t = ev.target as HTMLElement | null;
    if (!t) return;
    const el = this.amountRef?.nativeElement;
    if (!el) return;
    if (t === el || t.closest('input') === el) return;
    this.blurAmount();
  }

  private fetchTxData(): void {
    this.loading.set(true);
    this.api.getTransactions()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: newData => {
          const current = this.txData();
          const merged: TransactionDay[] = [];

          for (const newDay of newData) {
            const existingDay = current.find(d => d.date === newDay.date);
            if (existingDay) {
              merged.push(newDay);
            } else {
              merged.push(newDay);
            }
          }

          this.txData.set(merged);
        },
        error: err => console.error('TX fetch failed', err)
      });
  }
}
