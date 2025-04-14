import { Component, OnInit } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
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
export class QuizPageComponent implements OnInit {
  protected quizId: number | undefined;
  private routerSubscription: Subscription | undefined;
  protected result: Quiz & Category & User | null = null;
  constructor(protected router : Router, private database : DatabaseService) {}
  public ngOnInit() : void {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments : string[] = event.url.split('/');
      if(!urlSegments.includes('quiz')) return;
      this.quizId = parseInt(urlSegments[urlSegments.length - 1], 10);
      this.database.getQuiz(this.quizId).then((r : Quiz & Category & User | null) : void => {
        this.result = r!;
      });
    });
  }

  startQuiz() : void {
    this.router.navigate([`quiz/${this.quizId}/solve`]).then();
  }
}
