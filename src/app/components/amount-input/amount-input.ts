import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-amount-input',
  imports: [],
  standalone: true,
  templateUrl: './amount-input.html',
  styleUrl: './amount-input.css'
})
export class AmountInput {
  @Input() customAmount: string = '';
  @Output() customAmountChange = new EventEmitter<string>();

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    this.customAmountChange.emit(digits);
  }

  preventNonDigits(event: KeyboardEvent): void {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (/^\d$/.test(event.key) || allowed.includes(event.key)) return;
    event.preventDefault();
  }

  handlePaste(event: ClipboardEvent): void {
    const pasted = event.clipboardData?.getData('text') || '';
    const digits = pasted.replace(/\D/g, '');
    this.customAmountChange.emit(digits);
    event.preventDefault();
  }
}
