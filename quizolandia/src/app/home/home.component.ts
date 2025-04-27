import {AfterViewInit, Component} from '@angular/core';
import { Category, DatabaseService, Quiz } from '../database.service';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

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
export class HomeComponent implements AfterViewInit {
  protected quizzes: (Quiz & Category)[] | undefined;
  protected quizzesWeekend: (Quiz & Category)[] | undefined;
  constructor(private databaseService: DatabaseService, private title : Title) {
    this.title.setTitle('Quizolandia');
  }
  public ngAfterViewInit(): void {
    setTimeout(() : void => {
      this.databaseService.send('getQuizzesFromToday', {}, "quizzesFromToday").then(() : void => {
        this.quizzes = this.databaseService.get_variable('quizzesFromToday');

        this.databaseService.send('getQuizzesFromWeekend', {}, "quizzesFromWeekend").then(() : void => {
          this.quizzesWeekend = this.databaseService.get_variable('quizzesFromWeekend');
        });
      })
    }, 500)

  }
}
