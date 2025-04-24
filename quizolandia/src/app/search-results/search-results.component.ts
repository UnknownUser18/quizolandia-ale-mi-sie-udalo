import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Category, DatabaseService, Quiz, User } from '../database.service';
import { NgOptimizedImage } from '@angular/common';
@Component({
  selector: 'app-search-results',
  standalone: true,
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
  protected result : (Quiz & User & Category)[] | null = null;
  constructor(private title : Title, private route : ActivatedRoute, private database : DatabaseService) {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'] || '';
      this.selectedCategory = params['selectedCategory'] || '';
      if(this.searchQuery === '' || this.searchQuery === undefined) return;
      this.database.getQuizzes(this.searchQuery, this.selectedCategory).then((r : (Quiz & User & Category)[]) : void => {
        this.result = r;
        this.title.setTitle("Wyszukiwanie quizów - Quizolandia");
      });
    });
  }
}
