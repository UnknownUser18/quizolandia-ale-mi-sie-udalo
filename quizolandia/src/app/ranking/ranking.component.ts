import { Component } from '@angular/core';
import { DatabaseService, WebSocketStatus, Solve, User } from '../database.service';
import { LocalStorageService } from '../local-storage.service';
import {RouterLink} from '@angular/router';
import {NgClass, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-ranking',
  imports: [
    RouterLink,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss'
})
export class RankingComponent {
  protected leaderboard : (Solve & User)[] | undefined = undefined;
  protected countSolved: (Solve & User & { quiz_count: number })[] | undefined = undefined;

  constructor(
    private database: DatabaseService,
    private localStorage : LocalStorageService,
  ) {
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;

      this.database.send('getTopUsers', {}, 'leaderboard').then(() => {
        this.leaderboard = this.database.get_variable('leaderboard');
        this.database.send('getCountSolved', {}, 'empty').then(() => {
          this.countSolved = this.database.get_variable('empty');
        });
      })
    });
  }

  protected findUserSolve(userId : string): number | undefined {
    const user = this.countSolved?.find((x) => x.username === userId);
    return user?.quiz_count;
  }
}
