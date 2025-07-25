import {Component, OnInit, signal} from '@angular/core';
import {HeaderComponent} from '../../shared/header.component/header.component';
import {UserAvatars} from '../../components/user-avatars/user-avatars';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {Crystal, Recipient} from '../../api/crystal';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-payments',
  imports: [
    HeaderComponent,
    UserAvatars,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './payments.html',
  styleUrl: './payments.css'
})
export class Payments implements OnInit {
  readonly recipients = signal<Recipient[]>([]);
  readonly loading    = signal(true);

  constructor(private api: Crystal, private router: Router) {}

  async ngOnInit() {
    try {
      const list = await this.api.getRecipients().toPromise();   // RecipientDto[]
      this.recipients.set(
        (list ?? []).map(r => ({ name: r.nickname, avatar: r.avatar }))
      );
    } finally {
      this.loading.set(false);
    }
  }

  quickTransfer(name: string) {
    this.router.navigate(
      ['/transfer/by-username'],
      { queryParams: { to: name } }
    );
  }
}
