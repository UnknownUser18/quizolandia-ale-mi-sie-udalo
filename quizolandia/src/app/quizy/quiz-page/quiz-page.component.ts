import { Component } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { Router } from '@angular/router';
import { Quiz, DatabaseService, User, Category } from '../../database.service';
import { NgOptimizedImage } from '@angular/common';
import { QuizSolveComponent } from '../quiz-solve/quiz-solve.component';

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
  constructor(protected router : Router, private database : DatabaseService) {
    const urlSegments : string[] = this.router.url.split('/');
    if(!urlSegments.includes('quiz')) return;
    this.quizId = parseInt(urlSegments[urlSegments.length - 1], 10);
    this.database.getQuiz(this.quizId).then((r : Quiz & Category & User | null) : void => {
      console.log(r);
      this.result = r!;
    });
  }

  protected startQuiz() : void {
    this.router.navigate([`quiz/${this.quizId}/solve`]).then();
  }
}
