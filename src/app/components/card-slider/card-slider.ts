import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass, NgForOf} from '@angular/common';

export interface Card {
  id: number;
  type: 'personal' | 'business' | string;
  balance: number;
  label: string;
  number: string;
  bgClass: string;
}

@Component({
  selector: 'app-card-slider',
  imports: [
    NgForOf,
    NgClass
  ],
  standalone: true,
  templateUrl: './card-slider.html',
  styleUrl: './card-slider.css'
})

export class CardSliderComponent {
  @Input() cards: Card[] = [];
  @Input() selectedCardIndex: number = 0;
  @Output() selectedCardIndexChange = new EventEmitter<number>();


  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;

    const index = Math.round(scrollLeft / itemWidth);
    this.selectedCardIndex = index;

    this.selectedCardIndexChange.emit(index);
  }

  getIconPath(type: string): string {
    switch (type) {
      case 'personal':
        return 'assets/home/card/person.png';
      case 'business':
        return 'assets/home/card/business.png';
      default:
        return 'assets/home/card/person.png';
    }
  }
}
