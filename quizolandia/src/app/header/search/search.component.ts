import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, DatabaseService } from '../../database.service';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  constructor(private databaseService: DatabaseService, private router : Router) {}
  protected searchQuery: string = '';
  protected categories: Category[] = [];
  protected selectedCategory: string = 'wszystkie';
  protected fetchCategories() : void {
    if(this.categories.length !== 0) return; // if categories already fetched, do nothing
    this.databaseService.getData('SELECT name FROM category;').then(() => {
      this.categories = this.databaseService.result.value as Category[];
    });
  }

  protected searchQuizzes(event : MouseEvent | KeyboardEvent) : void {
    if(event instanceof KeyboardEvent && event.key !== 'Enter') return;
    if(this.searchQuery.trim() === '') return;
    this.router.navigate(['search-results'], {
      queryParams : {
        searchQuery : this.searchQuery.trim(),
        selectedCategory : this.selectedCategory
      }
    }).then(() => {})
  }
}
