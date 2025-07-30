// import {Component, computed, inject, OnInit, signal} from '@angular/core';
// import {FormsModule} from "@angular/forms";
// import {NgClass, NgForOf, NgIf} from "@angular/common";
// import {RouterLink} from '@angular/router';
// import {HeaderComponent} from '../../shared/header.component/header.component';
// import {Crystal, TransactionDay} from '../../api/crystal';
// import {finalize} from 'rxjs';
//
// @Component({
//   selector: 'app-transaction-history',
//   imports: [
//     FormsModule,
//     NgForOf,
//     RouterLink,
//     NgClass,
//     HeaderComponent,
//     NgIf
//   ],
//   templateUrl: './transaction-history.html',
//   styleUrl: './transaction-history.css'
// })
// export class TransactionHistory implements OnInit {
//   private api = inject(Crystal);
//
//   private txData = signal<TransactionDay[]>([]);
//   searchQuery = signal('');
//
//   loading = signal(false);
//
//   filteredTransactions = computed(() => {
//     const q = this.searchQuery().toLowerCase();
//     return this.txData()
//       .map(day => ({
//         ...day,
//         items: day.items.filter(tx =>
//           [tx.name, tx.type, tx.from, tx.to,
//             tx.from_account, tx.to_account]
//             .some(s => s.toLowerCase().includes(q))
//         )
//       }))
//       .filter(day => day.items.length);
//   });
//
//   ngOnInit() {
//     this.loading.set(true);
//     this.api.getTransactions()
//       .pipe(finalize(() => this.loading.set(false)))
//       .subscribe({
//         next: data => this.txData.set(data),
//         error: err => console.error('TX fetch failed', err)
//       });
//   }
// }
//

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../shared/header.component/header.component';
import { Crystal, TransactionDay } from '../../api/crystal';
import { finalize } from 'rxjs';

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
