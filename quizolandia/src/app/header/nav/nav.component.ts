import { AfterViewInit, Component } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { Router, RouterLink } from '@angular/router';

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
  constructor(protected router : Router) {}
  protected localStorage : Storage | undefined;
  public ngAfterViewInit() {
    this.localStorage = localStorage;
  }
}
