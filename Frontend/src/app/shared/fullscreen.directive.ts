import { Directive, HostListener } from '@angular/core';
import * as screenfull from 'screenfull';

@Directive({
	selector: '[toggleFullscreen]'
})
export class ToggleFullscreenDirective {
	@HostListener('click') onClick() { //dblclick
		if (screenfull.isEnabled) {
			//	screenfull.toggle();
			screenfull.request();

		}
	}
}