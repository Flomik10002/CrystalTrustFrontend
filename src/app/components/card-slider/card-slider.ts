// import {Component, EventEmitter, Input, Output} from '@angular/core';
// import {NgClass, NgForOf} from '@angular/common';
// import {AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone} from '@angular/core';
//
// export interface Card {
//   id: number;
//   type: 'personal' | 'business' | string;
//   balance: number;
//   label: string;
//   number: string;
//   bgClass: string;
// }
//
// @Component({
//   selector: 'app-card-slider',
//   imports: [
//     NgForOf,
//     NgClass
//   ],
//   standalone: true,
//   templateUrl: './card-slider.html',
//   styleUrl: './card-slider.css'
// })
//
//
// export class CardSliderComponent {
//   @Input() cards: Card[] = [];
//   @Input() selectedCardIndex: number = 0;
//   @Output() selectedCardIndexChange = new EventEmitter<number>();
//
//   // +++ ADD: ссылка на контейнер
//   @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
//
//   // +++ ADD: состояние драга
//   private dragging = false;
//   private dragStartX = 0;
//   private dragStartScrollLeft = 0;
//   private dragPointerId: number | null = null;
//
//   onScroll(event: Event) {
//     const container = event.target as HTMLElement;
//     const scrollLeft = container.scrollLeft;
//     const itemWidth = container.offsetWidth;
//     const index = Math.round(scrollLeft / itemWidth);
//     this.selectedCardIndex = index;
//     this.selectedCardIndexChange.emit(index);
//   }
//
//   // Оставь, если уже был. Не мешает.
//   onWheel(e: WheelEvent) {
//     if (!this.sliderRef) return;
//     const el = this.sliderRef.nativeElement;
//     if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) {
//       el.scrollLeft += e.deltaY;
//       e.preventDefault();
//     }
//   }
//
//   // +++ ADD: drag-to-scroll (только мышь)
//   onDragStart(ev: PointerEvent) {
//     if (ev.pointerType !== 'mouse' || ev.button !== 0) return; // только ЛКМ мыши
//     const el = this.sliderRef.nativeElement;
//     this.dragging = true;
//     this.dragPointerId = ev.pointerId;
//     el.setPointerCapture(ev.pointerId);
//     this.dragStartX = ev.clientX;
//     this.dragStartScrollLeft = el.scrollLeft;
//     el.classList.add('cursor-grabbing');
//     ev.preventDefault();
//   }
//
//   onDragMove(ev: PointerEvent) {
//     if (!this.dragging || ev.pointerId !== this.dragPointerId) return;
//     const el = this.sliderRef.nativeElement;
//     const dx = ev.clientX - this.dragStartX;
//     el.scrollLeft = this.dragStartScrollLeft - dx;
//     // предотвращаем выделение текста/изображений
//     ev.preventDefault();
//   }
//
//   onDragEnd(ev: PointerEvent) {
//     if (!this.dragging || (this.dragPointerId !== null && ev.pointerId !== this.dragPointerId)) return;
//     const el = this.sliderRef.nativeElement;
//     try { el.releasePointerCapture(this.dragPointerId!); } catch {}
//     this.dragging = false;
//     this.dragPointerId = null;
//     el.classList.remove('cursor-grabbing');
//     // опционально: дожимаем к ближайшему снэпу (скролл-снэп и так сделает своё)
//     // const itemWidth = el.offsetWidth;
//     // el.scrollTo({ left: Math.round(el.scrollLeft / itemWidth) * itemWidth, behavior: 'smooth' });
//   }
//
//   getIconPath(type: string): string {
//     switch (type) {
//       case 'personal': return 'assets/home/card/person.png';
//       case 'business': return 'assets/home/card/business.png';
//       default: return 'assets/home/card/person.png';
//     }
//   }
// }
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { ElementRef, ViewChild, OnDestroy } from '@angular/core';

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
  imports: [NgForOf, NgClass],
  standalone: true,
  templateUrl: './card-slider.html',
  styleUrl: './card-slider.css'
})
export class CardSliderComponent implements OnDestroy {
  @Input() cards: Card[] = [];
  @Input() selectedCardIndex: number = 0;
  @Output() selectedCardIndexChange = new EventEmitter<number>();

  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;

  // drag state
  private dragging = false;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private dragPointerId: number | null = null;

  // чувствительность
  private dragSpeed = 3.0;        // выше — быстрее «едет» под мышью
  private swipeTriggerPx = 4;     // сколько пикселей достаточно, чтобы перелистнуть (после умножения на dragSpeed)
  private wheelSpeed = 2.2;       // чувствительность колеса -> горизонтальный скролл

  ngOnDestroy(): void {
    // no-op, оставлено на будущее
  }

  // актуальный индекс по положению скролла
  private computeIndexByScroll(el: HTMLDivElement): number {
    const itemW = el.offsetWidth || 1;
    return Math.round(el.scrollLeft / itemW);
  }

  private clampIndex(i: number): number {
    const max = Math.max(0, this.cards.length - 1);
    return Math.min(Math.max(i, 0), max);
  }

  private scrollToIndex(i: number, behavior: ScrollBehavior = 'smooth') {
    const el = this.sliderRef?.nativeElement;
    if (!el) return;
    const itemW = el.offsetWidth || 1;
    const idx = this.clampIndex(i);
    this.selectedCardIndex = idx;
    this.selectedCardIndexChange.emit(idx);
    el.scrollTo({ left: idx * itemW, behavior });
  }

  onScroll(event: Event) {
    const container = event.target as HTMLElement;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const index = Math.round(scrollLeft / itemWidth);
    this.selectedCardIndex = index;
    this.selectedCardIndexChange.emit(index);
  }

  // Увеличенная чувствительность колеса: вертикальное колесо -> горизонтальный скролл
  onWheel(e: WheelEvent) {
    if (!this.sliderRef) return;
    const el = this.sliderRef.nativeElement;
    const base = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    el.scrollLeft += base * this.wheelSpeed;
    e.preventDefault(); // чтобы не прокручивалась страница
  }

  // --- Drag-to-snap (мышь): всегда листаем ровно на одну карту по направлению жеста ---
  onDragStart(ev: PointerEvent) {
    if (ev.pointerType !== 'mouse' || ev.button !== 0) return; // только ЛКМ мыши
    const el = this.sliderRef.nativeElement;
    this.dragging = true;
    this.dragPointerId = ev.pointerId;
    el.setPointerCapture(ev.pointerId);
    this.dragStartX = ev.clientX;
    this.dragStartScrollLeft = el.scrollLeft;
    el.classList.add('cursor-grabbing');
    ev.preventDefault();
  }

  onDragMove(ev: PointerEvent) {
    if (!this.dragging || ev.pointerId !== this.dragPointerId) return;
    const el = this.sliderRef.nativeElement;
    const dx = ev.clientX - this.dragStartX;
    // Движение «для ощущения схвата» — усиливаем чувствительность
    el.scrollLeft = this.dragStartScrollLeft - dx * this.dragSpeed;
    ev.preventDefault();
  }

  onDragEnd(ev: PointerEvent) {
    if (!this.dragging || (this.dragPointerId !== null && ev.pointerId !== this.dragPointerId)) return;
    const el = this.sliderRef.nativeElement;
    try { el.releasePointerCapture(this.dragPointerId!); } catch {}
    this.dragging = false;
    this.dragPointerId = null;
    el.classList.remove('cursor-grabbing');

    // Решение «без возврата»: листаем на ±1 карту при малейшем осмысленном движении
    const dx = (ev.clientX - this.dragStartX) * this.dragSpeed;
    const movedEnough = Math.abs(dx) >= this.swipeTriggerPx;

    if (!movedEnough) {
      // Почти клик — оставляем на текущей карте, дожимаем к текущему индексу
      this.scrollToIndex(this.selectedCardIndex);
      return;
    }

    const dir = dx < 0 ? +1 : -1; // тянем влево -> следующая, вправо -> предыдущая
    const nextIdx = this.clampIndex(this.selectedCardIndex + dir);
    // Всегда нежно докручиваем к выбранному индексу
    this.scrollToIndex(nextIdx);
  }

  getIconPath(type: string): string {
    switch (type) {
      case 'personal': return 'assets/home/card/person.png';
      case 'business': return 'assets/home/card/business.png';
      default: return 'assets/home/card/person.png';
    }
  }
}
