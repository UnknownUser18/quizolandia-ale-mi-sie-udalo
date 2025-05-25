import {AfterViewInit, Component} from '@angular/core';
import {Category, DatabaseService, Quiz, WebSocketStatus} from '../database.service';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {LocalStorageService} from '../local-storage.service';

@Component({
    selector: 'app-home',
    imports: [
        NgOptimizedImage,
        RouterLink
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  protected quizzes: (Quiz & Category)[] | undefined;
  protected quizzesWeekend: (Quiz & Category)[] | undefined;
  constructor(private databaseService: DatabaseService, private title : Title, private localStorage : LocalStorageService) {
    this.title.setTitle('Quizolandia');
  }
  public ngAfterViewInit(): void {
    this.localStorage.websocketStatus.subscribe((status) : void => {
      if(status !== WebSocketStatus.OPEN) return;
      this.databaseService.send('getQuizzesFromToday', {}, "quizzesFromToday").then(() : void => {
        this.quizzes = this.databaseService.get_variable('quizzesFromToday');
        this.databaseService.send('getQuizzesFromWeekend', {}, "quizzesFromWeekend").then(() : void => {
          this.quizzesWeekend = this.databaseService.get_variable('quizzesFromWeekend');
        });
      });
    });
  }
}
