import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { Router } from '@angular/router';
import {Quiz, DatabaseService, User, Category, Solve} from '../../database.service';
import { NgOptimizedImage } from '@angular/common';
import { QuizSolveComponent } from '../quiz-solve/quiz-solve.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [
    CommentsComponent,
    NgOptimizedImage,
    QuizSolveComponent
  ],
  templateUrl: './quiz-page.component.html',
  styleUrl: './quiz-page.component.scss'
})
export class QuizPageComponent {
  protected quizId: number | undefined;
  protected result: Quiz & Category & User | null = null;
  protected leaderboard : (User & Solve)[] | null = null;
  constructor(protected router : Router, private database : DatabaseService, private title : Title) {
    const urlSegments : string[] = this.router.url.split('/');
    this.quizId = parseInt(urlSegments[urlSegments.length - 1], 10);
    this.database.send('getQuiz', { id_quiz: this.quizId }, 'quiz').then(() : void => {
      this.result = (this.database.get_variable('quiz') as unknown as (Quiz & Category & User)[])[0];
      this.title.setTitle(`${this.result?.quiz_name!} - Quizolandia`);
      this.database.send('getLeaderboard', { id_quiz: this.quizId }, 'scoresList').then(() : void => {
        this.leaderboard = (this.database.get_variable('scoresList') as (User & Solve)[]);
      });
    });
  }

  protected startQuiz() : void {
    this.router.navigate([`quiz/${this.quizId}/solve`]).then();
  }
}
