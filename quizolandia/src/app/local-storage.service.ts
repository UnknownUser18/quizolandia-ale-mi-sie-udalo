import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import CryptoJS from 'crypto-js';
import { WebSocketStatus } from './database.service';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public readonly key = CryptoJS.enc.Hex.parse("b0040a25cceb0bcff0ce7e63f103091616426f32f54086fdbf5d636ca789baa6");
  public websocketStatus : BehaviorSubject<WebSocketStatus> = new BehaviorSubject<WebSocketStatus>(WebSocketStatus.CLOSED);

  constructor(@Inject(PLATFORM_ID) private platformId : Object) {}

  private encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
    }).toString();
  }
  private decrypt(cipherText: string): string {
    const bytes = CryptoJS.AES.decrypt(cipherText, this.key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Hex.parse("00000000000000000000000000000000")
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  public set(key : string, value : string) : void {
    if(!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(key, this.encrypt(value));
  }

  public get(key : string) : string | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;

    return this.decrypt(encryptedValue);
  }

  public remove(key : string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.removeItem(key);
  }

}
