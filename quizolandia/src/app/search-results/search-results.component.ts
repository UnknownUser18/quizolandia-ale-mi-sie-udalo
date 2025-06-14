import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Category, DatabaseService, Quiz, WebSocketStatus } from '../database.service';
import { NgOptimizedImage } from '@angular/common';
import { LocalStorageService } from '../local-storage.service';

@Component({
    selector: 'app-search-results',
    imports: [
        RouterLink,
        NgOptimizedImage
    ],
    templateUrl: './search-results.component.html',
    styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent {
  protected searchQuery : string = '';
  protected selectedCategories : string = '';
  protected result : (Quiz & Category)[] | null = null;
  constructor(private title : Title, private route : ActivatedRoute, private database : DatabaseService, private localStorage : LocalStorageService) {

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'] || '';
      this.selectedCategories = params['selectedCategory'] || '';
      this.localStorage.websocketStatus.subscribe(status => {
        if (status !== WebSocketStatus.OPEN) return;
        this.database.send('getQuizzes', { quiz_name: this.searchQuery, category_name: this.selectedCategories }, 'quizzesList').then(() : void => {
          this.result = this.database.get_variable('quizzesList')!;
          this.title.setTitle('Wyszukiwanie quizów - Quizolandia');
        });
      });
    });
  }
}
