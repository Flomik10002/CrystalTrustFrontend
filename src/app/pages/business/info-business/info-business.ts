import { Component } from '@angular/core';
import {HeaderComponent} from "../../../shared/header.component/header.component";
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-info-business',
  imports: [
    HeaderComponent,
    RouterLink
  ],
  templateUrl: './info-business.html',
  styleUrl: './info-business.css'
})
export class InfoBusiness {

}
