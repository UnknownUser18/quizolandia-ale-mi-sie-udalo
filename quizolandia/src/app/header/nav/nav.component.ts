import {Component, NgZone} from '@angular/core';
import {SearchComponent} from '../search/search.component';
import {RouterLink} from '@angular/router';
import {LocalStorageService} from '../../local-storage.service';
import {WebSocketStatus} from '../../database.service';

@Component({
    selector: 'app-nav',
    imports: [
        SearchComponent,
        RouterLink,
    ],
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {
  protected localStorageUsername: string | null = null;

  constructor(private zone : NgZone, private localService : LocalStorageService) {
    this.localService.websocketStatus.subscribe(status => {
      if(status !== WebSocketStatus.OPEN) return;
      this.localStorageUsername = this.localService.get('username');
    })
  }

}
