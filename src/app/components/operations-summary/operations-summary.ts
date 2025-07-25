import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

interface TransactionEntry {
  name: string;
  amount: number;
  type: string;
  date: string;
}

@Component({
  selector: 'app-operations-summary',
  standalone: true,
  imports: [NgClass, NgForOf, RouterLink],
  templateUrl: './operations-summary.html',
  styleUrl: './operations-summary.css'
})
export class OperationsSummary {
  @Input() total: number = 0;
  @Input() monthLabel: string = '';
  @Input() entries: TransactionEntry[] = [];

  get progressParts() {
    const total = this.entries.reduce((sum, e) => sum + Math.abs(e.amount), 0);
    if (total === 0) return [];

    return this.entries.map(entry => ({
      amount: entry.amount,
      percentage: Math.abs(entry.amount) / total * 100
    }));
  }

}
