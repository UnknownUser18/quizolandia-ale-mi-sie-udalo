import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from './database.service';
import { NavComponent } from './header/nav/nav.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ContactComponent} from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    RouterLink,
    RouterOutlet,
    ContactComponent,
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
