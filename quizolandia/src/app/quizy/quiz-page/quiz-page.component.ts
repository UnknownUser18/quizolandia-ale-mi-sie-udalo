import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import {Router, RouterLink} from '@angular/router';
import { Quiz, DatabaseService, User, Category, Solve } from '../../database.service';
import {NgClass, NgOptimizedImage} from '@angular/common';
import { QuizSolveComponent } from '../quiz-solve/quiz-solve.component';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-quiz-page',
  imports: [
    CommentsComponent,
    NgOptimizedImage,
    QuizSolveComponent,
    NgClass,
    RouterLink
  ],
    templateUrl: './quiz-page.component.html',
    styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {
  protected quizId: number | undefined;
  protected result: Quiz & Category & User | null = null;
  protected leaderboard: (User & Solve)[] = [];

  constructor(protected router : Router, private database : DatabaseService, private title : Title) {
    const urlSegments : string[] = this.router.url.split('/');
    this.quizId = parseInt(urlSegments[urlSegments.length - 1], 10);
    this.database.send('getQuiz', { id_quiz: this.quizId }, 'quiz').then(() : void => {
      this.result = (this.database.get_variable('quiz') as unknown as (Quiz & Category & User)[])[0];
      this.title.setTitle(`${this.result?.quiz_name!} - Quizolandia`);
      this.database.send('getLeaderboard', { id_quiz: this.quizId }, 'leaderboard').then(() : void => {
        this.leaderboard = this.database.get_variable('leaderboard') as (User & Solve)[];
        console.log(this.leaderboard);
      });
    });

  }

  protected startQuiz() : void {
    this.router.navigate([`quiz/${this.quizId}/solve`]).then();
  }
}
