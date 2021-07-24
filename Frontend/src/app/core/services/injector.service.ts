import { Injector, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class InjectorService {

  constructor() {
  }

  private static injector: Injector;

  static setInjector(injector: Injector): void {
    InjectorService.injector = injector;
  }

  static getInjector(): Injector {
    return InjectorService.injector;
  }
}

