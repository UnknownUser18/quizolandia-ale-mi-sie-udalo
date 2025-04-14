import {AfterViewInit, Component } from '@angular/core';
import {SearchComponent} from '../search/search.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    SearchComponent,
    RouterLink
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements AfterViewInit {
  protected localStorageUsername: string | null = null;
  constructor() {}
  ngAfterViewInit(): void {
    this.localStorageUsername = localStorage.getItem('username');
  }
}
