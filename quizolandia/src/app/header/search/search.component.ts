import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Category, DatabaseService} from '../../database.service';
import {NgForOf, NgOptimizedImage} from '@angular/common';
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
  constructor(private databaseService: DatabaseService) {}
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
    const query : string = this.searchQuery.trim();
    const category : string = this.selectedCategory;
    let sql : string = `SELECT * FROM quiz WHERE name LIKE '%${query}%'`;
    if(category !== 'wszystkie') {
      sql = `SELECT * FROM quiz JOIN category ON quiz.id_category = category.id_category WHERE name LIKE '%${query}%' AND category.name = '${category}'`;
    }
    this.databaseService.getData(sql).then(() : void => {
      console.log(this.databaseService.result.value);
    });
  }
}
