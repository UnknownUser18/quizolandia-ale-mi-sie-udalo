import { Component, NgZone } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { RouterLink } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { checkUser, DatabaseService, WebSocketStatus } from '../../database.service';

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
  protected isLoggedin : boolean = false;

  constructor(private localService : LocalStorageService, private database : DatabaseService, private zone : NgZone) {
    this.localService.websocketStatus.subscribe(status => {
      if(status !== WebSocketStatus.OPEN) return;
      this.localService.isLoggedin.subscribe((status) => {
        this.isLoggedin = status;
      });
      setTimeout(() => {
        checkUser(this.database).then((r) => {
          this.localService.isLoggedin.next(r);
        });
      }, 500);
    });
  }

}
