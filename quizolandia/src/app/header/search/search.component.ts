import {Component, ElementRef, NgZone, ViewChild} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, DatabaseService } from '../../database.service';
import { Router } from '@angular/router';
import {take} from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  protected showFilter : boolean = false;
  protected searchQuery: string = '';
  protected categories: Category[] = [];
  protected selectedCategory: string = 'wszystkie';

  protected checkedCategories = {}

  @ViewChild('filter') filter! : ElementRef;

  constructor(private databaseService: DatabaseService, private router : Router, private zone : NgZone) {}

  private async animateElement(open : boolean) : Promise<boolean> {
    return new Promise((resolve) => {
      this.zone.onStable.pipe(take(1)).subscribe(() => {
        requestAnimationFrame(() => {
          const background = this.filter.nativeElement as HTMLElement;
          const main = background.querySelector('section > div') as HTMLElement;
          if (!main) throw new Error('No main element found');
          background.classList.toggle('done', open);
          main.classList.toggle('done', open);
          const onTransitionEnd = (e : TransitionEvent) : void => {
            if(e.target === main) {
              main.removeEventListener('transitionend', onTransitionEnd);
              resolve(true);
            }
          };
          main.addEventListener('transitionend', onTransitionEnd);
        })
      });
    });
  }
  protected openFilter() : void {
    this.showFilter = true;
    this.animateElement(true).then(() : void => {
      if(this.categories.length !== 0) return; // if categories already fetched, do nothing
      this.databaseService.send('getCategoryName', {}, "categoryList").then(() : void => {
        this.categories = this.databaseService.get_variable('categoryList')!;
      });
    });
  }
  protected updateCategory(id_category : number) : void {
    const category = this.categories.find((category) => category.id_category === id_category);
    if(category) this.categories.push(category);
    this.selectedCategory = category ? category.category_name : 'wszystkie';
  }
  protected closeFilter() : void {
    this.animateElement(false).then(() : void => {
      this.showFilter = false;
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
    }).then();
  }

}
