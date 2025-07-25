import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-user-avatars',
  imports: [
    NgForOf
  ],
  templateUrl: './user-avatars.html',
  styleUrl: './user-avatars.css'
})
export class UserAvatars {
  @Input()  users: { name: string; avatar: string }[] = [];
  @Output() avatarClick = new EventEmitter<string>();
  click(name: string) {
    this.avatarClick.emit(name);
  }
}
