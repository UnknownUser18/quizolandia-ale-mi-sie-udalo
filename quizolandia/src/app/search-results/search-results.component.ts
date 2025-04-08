import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Category, DatabaseService, Quiz, User } from '../database.service';
import { NgForOf, NgOptimizedImage } from '@angular/common';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  protected searchQuery : string = '';
  protected selectedCategory : string = '';
  protected result : (Quiz & User & Category)[] | null = null;
  private routerSubscription: Subscription | undefined;
  constructor(private title : Title, private route : ActivatedRoute, private database : DatabaseService, private router : Router) {}
  public ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'] || '';
      this.selectedCategory = params['selectedCategory'] || '';
      if(this.searchQuery === '' || this.searchQuery === undefined) return;
      this.database.getQuizzes(this.searchQuery, this.selectedCategory).then((r : (Quiz & User & Category)[]) : void => {
        this.result = r;
        this.title.setTitle("Wyszukiwanie quizów - Quizolandia");
      });
    });
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && !event.urlAfterRedirects.includes('search-results')) {
        this.result = null;
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  goToQuiz(quizId : number, name : string) : void {
    this.router.navigate(['/quiz', quizId]).then(() : void => {});
    this.title.setTitle(`${name} - Quizolandia`);
  }
}
