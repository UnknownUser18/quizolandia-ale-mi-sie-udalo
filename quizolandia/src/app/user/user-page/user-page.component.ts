import { Component } from '@angular/core';
import { checkUser, DatabaseService, Quiz, Solve, User, WebSocketStatus } from '../../database.service';
import { LocalStorageService } from '../../local-storage.service';
import { Router, RouterLink } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-user-page',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
    templateUrl: './user-page.component.html',
    styleUrl: './user-page.component.scss'
})
export class UserPageComponent {
  protected user : User | null = null;
  protected userData = {
    topOne: 0,
    countCreatedQuizzes: 0,
    countSolves: 0,
    isOwn: false,
    lastSolves: [] as unknown as (Quiz & Solve)[]
  }
  constructor(
    private database : DatabaseService,
    private localStorage : LocalStorageService,
    private router : Router,
    private title : Title) {
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;
      const type = this.router.url.split('/')[1];
      if( type === 'profile') {
        checkUser(this.database).then((r) => {
          if (!r) return;

          this.database.send('getUserID', { username: this.localStorage.get('username'), password: this.localStorage.get('password') }, 'empty').then(() => {
            const id_User = this.database.get_variable('empty')[0].id_user;

            this.database.send('getTopLeaderboard', { id_user: id_User }, 'empty').then(() => {
              this.userData.topOne = parseInt(this.database.get_variable('empty')[0].count);

              this.database.send('getCountUserQuizzes', { createdBy: id_User }, 'empty').then(() => {
                this.userData.countCreatedQuizzes = this.database.get_variable('empty')[0].quiz_count;

                this.database.send('getCountUserSolves', { id_user: id_User }, 'empty').then(() => {
                  this.userData.countSolves = this.database.get_variable('empty')[0].solve_count;
                  this.userData.isOwn = true;

                  this.database.send('getUserData', { id_user: id_User }, 'user').then(() => {
                    this.user = this.database.get_variable('user')[0];
                    this.title.setTitle(`${this.user?.username} - Quizolandia`);

                    this.database.send('getLastSolves', { id_user: id_User }, 'empty').then(() => {
                      this.userData.lastSolves = this.database.get_variable('empty');
                    });
                  });
                });
              });
            });
          });
        });
      } else if (type === 'user') {
        const id_user = this.router.url.split('/')[2];
        this.database.send('getUserData', { id_user: id_user }, 'user').then(() => {
          this.user = this.database.get_variable('user')[0];
          this.title.setTitle(`${this.user?.username} - Quizolandia`);

          this.database.send('getTopLeaderboard', { id_user: id_user }, 'empty').then(() => {
            this.userData.topOne = parseInt(this.database.get_variable('empty')[0].count);

            this.database.send('getCountUserQuizzes', { createdBy: id_user }, 'empty').then(() => {
              this.userData.countCreatedQuizzes = this.database.get_variable('empty')[0].quiz_count;

              this.database.send('getCountUserSolves', { id_user: id_user }, 'empty').then(() => {
                this.userData.countSolves = this.database.get_variable('empty')[0].solve_count;
                this.userData.isOwn = false;

                this.database.send('getLastSolves', { id_user: id_user }, 'empty').then(() => {
                  this.userData.lastSolves = this.database.get_variable('empty');
                });
              });
            });
          });
        });
      }
    });
  }

  protected formatDate(date : string): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(',', '');
  }

  protected formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const tenths = Math.floor((time - Math.floor(time)) * 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${tenths.toString().padEnd(2, '0')}`;
  }
}
