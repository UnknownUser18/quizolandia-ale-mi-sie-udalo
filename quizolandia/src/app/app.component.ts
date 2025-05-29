import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DatabaseService, WebSocketStatus } from './database.service';
import { NavComponent } from './header/nav/nav.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

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

  constructor(
    private databaseService: DatabaseService,
    protected router: Router,
    private localStorage : LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.databaseService.initWebSocket().then((r: WebSocketStatus) => {
      this.localStorage.websocketStatus.next(r);
    });
  }
}
