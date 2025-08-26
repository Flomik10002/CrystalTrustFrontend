import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {HeaderComponent} from '../../../shared/header.component/header.component';
import {StoryCard} from '../../../components/story-card/story-card';
import {Crystal} from '../../../api/crystal';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-internal-transfer-success',
  standalone: true,
  imports: [RouterLink, HeaderComponent, StoryCard],
  templateUrl: './internal-transfer-success.html',
  styleUrl: './internal-transfer-success.css'
})
export class InternalTransferSuccess implements OnInit {
  nickname = '';
  avatarUrl = '';
  loading = true;

  constructor(private api: Crystal) {}

  ngOnInit(): void {
    this.api.getHomeData()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: ({ profile }) => {
          this.nickname = profile?.nickname ?? '';
          this.avatarUrl = this.nickname
            ? `https://mc-heads.net/avatar/${this.nickname}`
            : 'assets/fallback-avatar.png';
        },
        error: (err) => {
          console.error('Profile load failed', err);
          this.nickname = '';
          this.avatarUrl = 'assets/fallback-avatar.png';
        },
      });
  }
}
