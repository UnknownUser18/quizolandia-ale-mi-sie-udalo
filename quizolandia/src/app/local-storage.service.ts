import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(@Inject(PLATFORM_ID) private platformId : Object) {}

  public set(key : string, value : string) : void {
    if(!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(key, value);
  }
  public get(key : string) : string | null {
    if(!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(key);
  }
  public remove(key : string) : void {
    if(!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }
}
