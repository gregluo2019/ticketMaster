import {
  animate,
  keyframes,
  group,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";

export const FADE_IN_OUT_Height: any =
  trigger('fadeInOutHeight', [
    state('out', style({
      opacity: 0,
      minHeight: 0,
      maxHeight: 0,
      height: 0,
    })),
    state('in', style({
      opacity: 1,
    })),
    transition('in => out', animate('1000ms 0.3s ease-out')),
    transition('out => in', animate('1000ms 0.3s ease-in')),
  ]);
export const FADE_IN_OUT_Width: any =
  trigger('fadeInOutWidth', [
    state('out', style({
      opacity: 0,
      minWidth: 0,
      maxWidth: 0,
      width: 0,
    })),
    state('in', style({
      opacity: 1,
    })),
    transition('in => out', animate('1000ms 0.3s ease-out')),
    transition('out => in', animate('1000ms 0.3s ease-in')),
  ]);

export const FADE_IN_OUT: any =
  trigger('fadeInOut', [
    state('out', style({
      // display: 'none',
      opacity: 1,

    })),
    state('in', style({
      opacity: 1,
    })),
    transition('in => out', animate('1600ms 1.3s ease-out')),
    transition('out => in', animate('1600ms 1.3s ease-in')),
  ]);

export const FADE_OUT_LEFT: any = trigger("fadeOutLeft", [
  state(
    "out",
    style({
      opacity: 0,
      transform: "translateX(-300px)",
    })
  ),
  state(
    "in",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  transition("in => out", animate("0.6s ease-in")),
  transition("out => in", animate("0s ease-out")),
]);

export const FADE_IN_LEFT: any = trigger("fadeInLeft", [
  state(
    "out",
    style({
      opacity: 0,
      transform: "translateX(300px)",
    })
  ),

  state(
    "in",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  transition("in => out", animate("0s ease-in")),
  transition("out => in", animate("0.6s ease-out")),
]);

export const FADE_OUT_RIGHT: any = trigger("fadeOutRight", [
  state(
    "out",
    style({
      opacity: 0,
      transform: "translateX(300px)",
    })
  ),
  state(
    "in",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  transition("in => out", animate("0.6s ease-in")),
  transition("out => in", animate("0s ease-out")),
]);

export const FADE_IN_RIGHT: any = trigger("fadeInRight", [
  state(
    "out",
    style({
      opacity: 0,
      transform: "translateX(-300px)",
    })
  ),

  state(
    "in",
    style({
      opacity: 1,
      transform: "translateX(0)",
    })
  ),
  transition("in => out", animate("0s ease-in")),
  transition("out => in", animate("0.6s ease-out")),
]);
