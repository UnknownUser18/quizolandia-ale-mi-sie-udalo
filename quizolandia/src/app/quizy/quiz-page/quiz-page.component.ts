import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Category, DatabaseService, Quiz, Solve, User, WebSocketStatus } from '../../database.service';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { LocalStorageService } from '../../local-storage.service';
import { CommentsComponent } from '../comments/comments.component';

@Component({
  selector: 'app-quiz-page',
  imports: [
    NgOptimizedImage,
    NgClass,
    RouterLink,
    CommentsComponent
  ],
    templateUrl: './quiz-page.component.html',
    styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {
  protected quizId: number | undefined;
  protected result: Quiz & Category & User | null = null;
  protected leaderboard : (User & Solve)[] = [];
  constructor(
    private router : Router,
    private database : DatabaseService,
    private title : Title,
    private localStorage : LocalStorageService,
  ) {
    const urlSegments : string[] = this.router.url.split('/');
    this.quizId = parseInt(urlSegments[urlSegments.length - 1], 10);

    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;

      this.database.send('getQuiz', { id_quiz: this.quizId }, 'quiz').then(() : void => {
        this.result = (this.database.get_variable('quiz') as unknown as (Quiz & Category & User)[])[0];
        this.title.setTitle(`${this.result?.quiz_name!} - Quizolandia`);

        this.database.send('getLeaderboard', { id_quiz: this.quizId }, 'leaderboard').then(() : void => {
          this.leaderboard = this.database.get_variable('leaderboard') as (User & Solve)[];
        });
      });
    });
  }

  protected startQuiz() : void {
    this.router.navigate([`quiz/${this.quizId}/solve`]).then();
  }

  protected getTime(time : number) : string {
    let minutes = Math.floor(time / 60).toString();
    let seconds = Math.floor(time % 60).toString();
    let miliseconds = Math.floor((time - Math.floor(time)) * 1000).toString();
    return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}:${miliseconds.padStart(3, '0')}`;
  }
}
