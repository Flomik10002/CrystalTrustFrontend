import {Component, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from "../../../shared/header.component/header.component";
import {RouterLink} from '@angular/router';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import { Router } from '@angular/router';
import {finalize} from 'rxjs';
import {Crystal} from '../../../api/crystal';

const CATEGORY_MAP: Record<string, string> = {
  'Строительный': 'build',
  'Производственный': 'industrial',
  'Торгово-посреднический': 'store',
  'Азартный (казино, ставки)': 'casino',
  'Развлекательный': 'entertainment',
  'Другое': 'other',
};

@Component({
  selector: 'app-register-business',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    RouterLink,
    NgClass,
    NgForOf,
    NgIf
  ],
  templateUrl: './register-business.html',
  styleUrls: ['./register-business.css']
})

export class RegisterBusiness {
  businessTitle = '';
  businessTag = '';
  @Input() selected: string = '';
  categories = [
    'Строительный',
    'Производственный',
    'Торгово-посреднический',
    'Азартный (казино, ставки)',
    'Развлекательный',
    'Другое'
  ];

  constructor(private router: Router, private api: Crystal) {}

  modalVisible = false;
  modalMessage = '';
  loading = false;

  select(category: string) {
    this.selected = category;
  }

  get isTitleInvalid(): boolean {
    return this.businessTitle.trim().length < 3;
  }

  get isTagInvalid(): boolean {
    return !/^[a-zA-Z0-9-_]{3,20}$/.test(this.businessTag);
  }

  get isCategoryInvalid(): boolean {
    return !this.selected;
  }

  sumbitRegister() {
    if (this.isTitleInvalid) {
      this.showModal('Название бизнеса должно содержать минимум 3 символа');
      return;
    }

    if (this.isTagInvalid) {
      this.showModal('Тег должен быть минимум 3 символа и не содержать пробелы');
      return;
    }

    if (this.isCategoryInvalid) {
      this.showModal('Выберите категорию бизнеса');
      return;
    }

    const payload = {
      name: this.businessTitle.trim(),
      tag: this.businessTag.trim().toLowerCase(),
      category: CATEGORY_MAP[this.selected]
    };

    this.loading = true;
    this.api.createBusiness( payload)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/business/success-business']),
        error: (err) => {
          const msg = err?.error?.detail || err?.message || 'Неизвестная ошибка';
          this.showModal(msg);
        }
      });
  }

  showModal(message: string) {
    this.modalMessage = message;
    this.modalVisible = true;
  }
}
