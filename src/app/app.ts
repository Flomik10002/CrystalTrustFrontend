import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './shared/header.component/header.component';
import {TelegramWebappService} from '@zakarliuka/ng-telegram-webapp';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  constructor(private telegram: TelegramWebappService) {}

  ngOnInit() {
    this.telegram.ready();
    this.telegram.expand();
  }
}
