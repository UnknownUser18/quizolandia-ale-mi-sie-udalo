import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from './database.service';
import { NavComponent } from './header/nav/nav.component';
import {Router, RouterLink, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'quizolandia';
  result: boolean | undefined;
  constructor(private databaseService: DatabaseService, protected router: Router) { }
  async ngAfterViewInit(): Promise<void> {
    this.result = await this.databaseService.initWebSocket();
  }
}
