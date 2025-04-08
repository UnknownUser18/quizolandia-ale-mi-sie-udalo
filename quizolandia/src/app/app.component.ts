import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from './database.service';
import {NavComponent} from './header/nav/nav.component';
import {Router} from '@angular/router';
import {SearchResultsComponent} from './search-results/search-results.component';
import {QuizPageComponent} from './quizy/quiz-page/quiz-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    SearchResultsComponent,
    QuizPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'quizolandia';
  constructor(private databaseService: DatabaseService, protected router: Router) { }
  ngAfterViewInit(): void {
    this.router.navigate(['']).then();
    this.databaseService.initWebSocket();
  }
}
