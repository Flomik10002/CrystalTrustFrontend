import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../../shared/header.component/header.component';
import {StoryCard} from '../../../components/story-card/story-card';

@Component({
  selector: 'app-internal-transfer-success',
  imports: [
    RouterLink,
    HeaderComponent,
    StoryCard
  ],
  templateUrl: './internal-transfer-success.html',
  styleUrl: './internal-transfer-success.css'
})
export class InternalTransferSuccess {

}
