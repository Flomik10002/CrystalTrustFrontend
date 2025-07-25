import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from "../../../shared/header.component/header.component";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from '@angular/router';
import {StoryCard} from '../../../components/story-card/story-card';

@Component({
  selector: 'app-success-business',
  imports: [
    FormsModule,
    HeaderComponent,
    RouterLink,
    StoryCard
  ],
  templateUrl: './success-business.html',
  styleUrl: './success-business.css'
})
export class SuccessBusiness {

}
