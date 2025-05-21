import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Category, DatabaseService, Quiz, User } from '../database.service';
import { NgOptimizedImage } from '@angular/common';
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
  protected selectedCategory : string = '';
  protected result : (Quiz & Category)[] | null = null;
  constructor(private title : Title, private route : ActivatedRoute, private database : DatabaseService) {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'] || '';
      this.selectedCategory = params['selectedCategory'] || '';
      if(this.searchQuery === '' || this.searchQuery === undefined) return;
      this.database.send('getQuizzes', { quiz_name: this.searchQuery, category_name: this.selectedCategory }, 'quizzesList').then(() : void => {
        this.result = this.database.get_variable('quizzesList')!;
        this.title.setTitle('Wyszukiwanie quizów - Quizolandia');
      });
    });
  }
}
