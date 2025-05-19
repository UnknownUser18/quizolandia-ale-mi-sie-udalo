import { AfterViewInit, Component, NgZone } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    SearchComponent,
    RouterLink,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent implements AfterViewInit {
  protected localStorageUsername: string | null = null;

  constructor(private zone : NgZone, private localService : LocalStorageService) {}

  public ngAfterViewInit(): void {
    this.zone.onStable.subscribe(() : void => {
        this.localStorageUsername = this.localService.get('username');
    });
  }
}
