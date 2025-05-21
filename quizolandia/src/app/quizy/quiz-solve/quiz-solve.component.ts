import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-quiz-solve',
    imports: [],
    templateUrl: './quiz-solve.component.html',
    styleUrl: './quiz-solve.component.scss'
})
export class QuizSolveComponent {
  quiz : number | undefined;
  private routerSubscription : Subscription | undefined;
  result : any | null = null;
  constructor(protected router : Router) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const urlSegments : string[] = event.url.split('/');
      if(!urlSegments.includes('quiz')) return;
      this.quiz = parseInt(urlSegments[urlSegments.length - 1], 10);
    });
  }
}
