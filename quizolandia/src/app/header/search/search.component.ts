import {Component, ElementRef, NgZone, ViewChild, ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, DatabaseService } from '../../database.service';
import { Router } from '@angular/router';
import {take} from 'rxjs';
import { TransitionService } from '../../transition.service';

@Component({
    selector: 'app-search',
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
  protected filteredCategories: Category[] = [];
  protected checkedCategories : Set<string> = new Set<string>();
  protected kategorieSearch: string = '';

  @ViewChild('filter') filter! : ElementRef;
  @ViewChild('search') search! : ElementRef;


  constructor(
    private databaseService: DatabaseService,
    private router : Router,
    private zone : NgZone,
    private transition : TransitionService,
    private cdr: ChangeDetectorRef
  ) {}

  protected openFilter() : void {
    this.showFilter = true;
    this.cdr.detectChanges();
    this.zone.onStable.pipe(take(1)).subscribe(() => {
      this.transition.animateWithTransitions(true, this.zone, this.filter.nativeElement).then(() : void => {
        this.zone.run(() => {
          if (this.categories.length !== 0) return;

          this.databaseService.send('getCategoryName', {}, 'categoryList').then((): void => {
            this.categories = this.databaseService.get_variable('categoryList')!;
            this.filteredCategories = [...this.categories];
            this.cdr.detectChanges();
          });
        });
      });
    });
  }
  protected updateCategory(category_name : string) : void {
    this.checkedCategories.has(category_name) ? this.checkedCategories.delete(category_name) : this.checkedCategories.add(category_name);
  }
  protected closeFilter() : void {
    this.transition.animateWithTransitions(false, this.zone, this.filter.nativeElement).then(() : void => {
      this.showFilter = false;
    });
  }
  protected filterCategories() : void {
    if(this.kategorieSearch.trim() === '') {
      this.filteredCategories = this.categories;
      return;
    }
    this.filteredCategories = this.categories.filter((category) => {
      return category.category_name.toLowerCase().includes(this.kategorieSearch.toLowerCase());
    });
    this.filteredCategories = this.filteredCategories.sort((a, b) => {
      const aChecked = this.checkedCategories.has(a.category_name) ? -1 : 1;
      const bChecked = this.checkedCategories.has(b.category_name) ? -1 : 1;
      return aChecked - bChecked;
    });
  }
  protected applyCategories() : void {
    this.closeFilter();
    this.searchQuizzes();
  }
  protected searchQuizzes(event : MouseEvent | KeyboardEvent | undefined = undefined) : void {
    if(event instanceof KeyboardEvent && event.key !== 'Enter') return;
    if(this.searchQuery.trim() === '' && this.checkedCategories.size === 0) return;
    this.router.navigate(['search-results'], {
      queryParams : {
        searchQuery : this.searchQuery.trim() || '',
        selectedCategory : Array.from(this.checkedCategories).join(',') || 'wszystkie',
      }
    }).then();
  }

}
