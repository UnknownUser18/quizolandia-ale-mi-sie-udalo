import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from './database.service';
import { NavComponent } from './header/nav/nav.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results.component';
import { QuizPageComponent } from './quizy/quiz-page/quiz-page.component';
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login-page/login/login.component';
import { UserPageComponent } from './user/user-page/user-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    SearchResultsComponent,
    QuizPageComponent,
    RouterLink,
    ContactComponent,
    LoginComponent,
    UserPageComponent,
    RouterOutlet,
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
