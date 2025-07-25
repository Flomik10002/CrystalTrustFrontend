import { Component, OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from './shared/header.component/header.component';
import {TelegramService} from './telegram.service';
import {Crystal} from './api/crystal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  constructor(private crystal: Crystal,private tg: TelegramService) {}

  ngOnInit() {
    console.log('ngOnInit сработал');

  }


}
