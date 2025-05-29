import { Component } from '@angular/core';
import { Category, DatabaseService, WebSocketStatus } from '../database.service';
import {LocalStorageService } from '../local-storage.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-dziedziny',
  imports: [
    RouterLink
  ],
  templateUrl: './dziedziny.component.html',
  styleUrl: './dziedziny.component.scss'
})
export class DziedzinyComponent {
  protected categories: Category[] | undefined = undefined;
  protected categoriesCount : { category_name: Category['category_name'], count : number }[] = [];
  constructor(
    private database : DatabaseService,
    private localStorage : LocalStorageService
  ) {
    this.localStorage.websocketStatus.subscribe(status => {
      if (status !== WebSocketStatus.OPEN) return;

      this.database.send('getCategories', {}, 'categoryList').then(() => {
        this.categories = this.database.get_variable('categoryList');

        this.database.send('getCategoryCount', {}, 'empty').then(() => {
          this.categoriesCount = this.database.get_variable('empty');
        });
      });
    });
  }
  protected findCount(category : string): number | undefined {
    const found = this.categoriesCount.find(c => c.category_name === category);

    return found ? found.count : undefined;
  }
}
