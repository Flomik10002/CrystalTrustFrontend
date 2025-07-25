import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../../shared/header.component/header.component';
import {StoryCard} from '../../../components/story-card/story-card';

@Component({
  selector: 'app-transfer-info',
  imports: [
    RouterLink,
    HeaderComponent,
    StoryCard
  ],
  templateUrl: './transfer-info.html',
  styleUrl: './transfer-info.css'
})
export class TransferInfo {

}
