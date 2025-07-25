import {Component, Input} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-story-card',
  imports: [
    NgClass
  ],
  templateUrl: './story-card.html',
  styleUrl: './story-card.css'
})
export class StoryCard {
  @Input() color = 'bg-primary';
}
