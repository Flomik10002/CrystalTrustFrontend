import {Component, Input} from '@angular/core';
import {AmountInput} from "../../../components/amount-input/amount-input";
import {CardSliderComponent} from "../../../components/card-slider/card-slider";
import {HeaderComponent} from "../../../shared/header.component/header.component";
import {RouterLink, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-request-deposit',
  imports: [
    AmountInput,
    CardSliderComponent,
    FormsModule,
    HeaderComponent,
    RouterLink,
    RouterModule
  ],
  templateUrl: './request-deposit.html',
  styleUrl: './request-deposit.css'
})
export class RequestDeposit {
  selectedCardIndex = 0;
  @Input() type!: 'personal' | 'business';
  cards = [
    {
      id: 1,
      type: 'personal',
      balance: 202131,
      label: 'Личный счёт',
      number: 'CRYSTAL-001',
      bgClass: 'bg-card',
    },
    {
      id: 2,
      type: 'business',
      balance: 85423,
      label: 'Дрочильня',
      number: 'CRYSTAL-1001',
      bgClass: 'bg-[#4B5563]',
    },
    {
      id: 3,
      type: 'business',
      balance: 1580,
      label: 'ООО бнал',
      number: 'CRYSTAL-1002',
      bgClass: 'bg-card-muted',
    }
  ];

  customAmount = '';

  submitTransfer() {
    const selectedCard = this.cards[this.selectedCardIndex];
    console.log('Запрос пополнение:', {
      from: selectedCard.number,
      amount: this.customAmount,
    });
    // Тут будет API-запрос
  }
}
