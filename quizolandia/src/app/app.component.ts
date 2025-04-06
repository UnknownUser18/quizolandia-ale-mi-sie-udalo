import { AfterViewInit, Component } from '@angular/core';
import { DatabaseService } from './database.service';
import {NavComponent} from './header/nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'quizolandia';
  constructor(private databaseService: DatabaseService) {}
  ngAfterViewInit(): void {
    this.databaseService.initWebSocket();
  }
}
