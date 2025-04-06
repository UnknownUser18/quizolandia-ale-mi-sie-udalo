import { Component, OnInit } from '@angular/core';
import { CommentsComponent } from '../comments/comments.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import {Quiz, DatabaseService, User, Category} from '../../database.service';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [
    CommentsComponent,
    NgOptimizedImage
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
      this.database.getData(`SELECT quiz.name AS quiz_name, category.name AS category_name, description, creationDate, lastUpdate, user.username, image FROM quiz JOIN user ON user.id_User = quiz.createdBy JOIN category ON quiz.id_category = category.id_category WHERE id_quiz = ${this.quizId};`).then(() => {
        this.result = this.database.result.value;
        if (Array.isArray(this.result) && this.result.length > 0) {
          this.result = this.result[0];
        }
      });
    });
  }
}
