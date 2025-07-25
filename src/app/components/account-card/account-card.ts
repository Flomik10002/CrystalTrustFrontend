import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-account-card',
  standalone: true,
  imports: [],
  templateUrl: './account-card.html',
  styleUrl: './account-card.css'
})
export class AccountCard {
  @Input() type!: 'personal' | 'business';
  @Input() balance: number = 0;
  @Input() title!: string;
  @Input() number!: number;

  getIconPath(t: string): string {
    return t === 'personal'
      ? 'assets/home/card/person.png'
      : 'assets/home/card/business.png';
  }

  get displayNumber(): string {
    return this.type === 'personal'
      ? `CRYSTAL-${String(this.number).padStart(3, '0')}`  // 001
      : `CRYSTAL-${this.number}`;                          // 1001
  }
}
