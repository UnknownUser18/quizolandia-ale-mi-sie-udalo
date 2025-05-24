import { Injectable, NgZone } from '@angular/core';
import {take} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  constructor() { }

  /** @method animateWithTransitions
   * @description Tworzy animację przejścia dla komponentu, który jest otwierany lub zamykany.
   * @param open{boolean} - czy animacja ma być otwierająca (true) czy zamykająca (false)
   * @param zone{NgZone} - strefa Angulara, w której ma być wykonana animacja
   * @param background{HTMLElement} - element tła, na którym ma być wykonana animacja
   * @return {Promise<boolean>} - zwraca Promise, który rozwiązuje się na true, jeśli animacja zakończyła się sukcesem, lub false, jeśli nie doszło do animacji głównego elementu
   * @throws{ Error } - jeśli nie znaleziono elementu głównego do animacji
   * @memberOf TransitionService
   */
  public async animateWithTransitions(open: boolean, zone: NgZone, background: HTMLElement): Promise<boolean> {
    return new Promise((resolve) => {
      zone.runOutsideAngular(() => {
        let activeTransitions = 0;
        const controller = new AbortController();
        const { signal } = controller;
        let animationStarted = false;

        const startAnimation = () => {
          if (animationStarted) return;
          animationStarted = true;
          controller.abort();
          zone.run(() => {
            zone.onStable.pipe(take(1)).subscribe(() => {
              requestAnimationFrame(() => {
                const main = background.querySelector('section > div') as HTMLElement;
                if (!main) throw new Error('No main element found');
                background.classList.toggle('done', open);
                main.classList.toggle('done', open);
                const onTransitionEnd = (e: TransitionEvent): void => {
                  if (e.target === main) {
                    main.removeEventListener('transitionend', onTransitionEnd);
                    resolve(true);
                  }
                };
                main.addEventListener('transitionend', onTransitionEnd);
                setTimeout(() => {
                  main.removeEventListener('transitionend', onTransitionEnd);
                  resolve(false);
                }, 500);
              });
            });
          });
        };

        const onTransitionStart = () => {
          activeTransitions++;
        };
        const onTransitionEnd = () => {
          activeTransitions--;
          if (activeTransitions <= 0) {
            startAnimation();
          }
        };

        document.addEventListener('transitionstart', onTransitionStart, { signal });
        document.addEventListener('transitionend', onTransitionEnd, { signal });

        // Sprawdź, czy są aktywne przejścia po krótkim czasie
        setTimeout(() => {
          if (activeTransitions === 0) {
            startAnimation();
          }
        }, 50);
      });
    });
  }
}
