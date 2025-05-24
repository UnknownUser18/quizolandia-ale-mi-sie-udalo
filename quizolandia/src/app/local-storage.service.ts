import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly key = "b0040a25cceb0bcff0ce7e63f103091616426f32f54086fdbf5d636ca789baa6";
  constructor(@Inject(PLATFORM_ID) private platformId : Object) {}
  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.key).toString();
  }
  private decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public set(key : string, value : string) : void {
    if(!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(key, this.encrypt(value));
  }
  public get(key : string) : string | null {
    if(!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.decrypt(key));
  }
  public remove(key : string) : void {
    if(!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }
}
