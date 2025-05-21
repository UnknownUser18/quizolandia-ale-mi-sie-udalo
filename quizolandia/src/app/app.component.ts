import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './database.service';
import { NavComponent } from './header/nav/nav.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [
        NavComponent,
        RouterLink,
        RouterOutlet,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  protected title = 'quizolandia';

  constructor(private databaseService: DatabaseService, protected router: Router) { }

  public ngOnInit(): void {
    this.databaseService.initWebSocket().then();
  }
}
