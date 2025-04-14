import { Component } from '@angular/core';
import { Category, DatabaseService, Quiz } from '../database.service';
import {NgForOf, NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected quizzes: (Quiz & Category)[] = [];
  protected quizzesWeekend: (Quiz & Category)[] = [];
  constructor(private databaseService: DatabaseService) {
    setTimeout(() : void => {
      this.databaseService.getQuizzesFromToday().then((r : (Quiz & Category)[]) : void => {
        this.quizzes = r;
      });
      setTimeout(() : void => {
        this.databaseService.getQuizzesFromWeekend().then((r : (Quiz & Category)[]) : void => {
          this.quizzesWeekend = r;
        });
      }, 500)
    }, 1000);
  }
}
