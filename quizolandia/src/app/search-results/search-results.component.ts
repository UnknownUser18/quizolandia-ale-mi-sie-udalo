import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { NgForOf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss'
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  protected searchQuery : string = '';
  protected selectedCategory : string = '';
  protected result : any | null = null;
  private routerSubscription: Subscription | undefined;
  constructor(private route : ActivatedRoute, private database : DatabaseService, private router : Router) {}
  public ngOnInit() : void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchQuery'] || '';
      this.selectedCategory = params['selectedCategory'] || '';
      if(this.searchQuery === '' || this.searchQuery === undefined) return;
      let sql : string = `SELECT id_quiz, quiz.name AS quiz_name, description, user.username, category.name AS category_name FROM quiz JOIN category ON quiz.id_category = category.id_category JOIN user ON user.id_User = quiz.createdBy = user.id_User WHERE quiz.name LIKE '%${this.searchQuery}%' AND isPublic = 1`;
      if(this.selectedCategory !== 'wszystkie') {
        sql += ` AND category.name = '${this.selectedCategory}'`;
      }
      sql += ` ORDER BY quiz.name;`;
      this.database.getData(sql).then(() : void => {
        this.result = this.database.result.value;
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
}
