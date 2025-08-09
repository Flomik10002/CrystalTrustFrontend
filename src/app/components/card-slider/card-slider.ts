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

  private dragging = false;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private dragPointerId: number | null = null;

  private dragSpeed = 3.0;
  private swipeTriggerPx = 4;
  private wheelSpeed = 2.2;

  ngOnDestroy(): void {
    // no-op, оставлено на будущее
  }

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

  onWheel(e: WheelEvent) {
    if (!this.sliderRef) return;
    const el = this.sliderRef.nativeElement;
    const base = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    el.scrollLeft += base * this.wheelSpeed;
    e.preventDefault();
  }

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

    const dx = (ev.clientX - this.dragStartX) * this.dragSpeed;
    const movedEnough = Math.abs(dx) >= this.swipeTriggerPx;

    if (!movedEnough) {
      this.scrollToIndex(this.selectedCardIndex);
      return;
    }

    const dir = dx < 0 ? +1 : -1;
    const nextIdx = this.clampIndex(this.selectedCardIndex + dir);
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
