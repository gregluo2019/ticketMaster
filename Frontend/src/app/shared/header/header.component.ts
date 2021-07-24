import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "../../core/services/auth.service";
import { BreakpointObserver } from "@angular/cdk/layout";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { FADE_IN_OUT_Width } from "src/app/core/eh-animations";
import { Location } from "@angular/common";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  animations: [FADE_IN_OUT_Width]
})
export class HeaderComponent implements OnInit {
  protected feature: string;

  constructor(
    public dialog: MatDialog,
    public authService: AuthService,
    public breakpointObserver: BreakpointObserver,
    public router: Router,
    location: Location,
    private translate: TranslateService
  ) {
    router.events.subscribe((val: any) => {
      let feature = location.path()
      if (feature.includes("/staffs")) {
        this.currentMenu = 1;
      } else if (feature.includes("/jobs")) {
        this.currentMenu = 8;
      } else if (feature.includes("/scan")) {
        this.currentMenu = 10;
      } else if (feature.includes("/checkInOut")) {
        this.currentMenu = 12;
      } else if (feature.includes("/home")) {
        this.currentMenu = 0;
      }
    });

  }

  isSmallScreen = this.breakpointObserver.isMatched("(max-width: 599px)");
  currentMenu = 0;
  sarchSchool = false;

  isChineseLang = false;

  ngOnInit() {
    let lang = localStorage.getItem('lang')
    if (lang === "cn") {
      this.isChineseLang = true;
    } else {
      this.isChineseLang = false;
    }
  }

  changeLanguage() {
    if (this.isChineseLang) {
      this.translate.use('en');
      localStorage.setItem('lang', 'en');
    } else {
      this.translate.use('cn');
      localStorage.setItem('lang', 'cn');
    }
    this.isChineseLang = !this.isChineseLang;
  }

  /*
    openLoginDialog(): void {
      const dialogRef = this.dialog.open(LoginComponent, {
        maxWidth: "600px",
        width: "100%",
        autoFocus: true,
      });
    }
  
    openRegisterDialog(): void {
      const dialogRef = this.dialog.open(RegisterComponent, {
        maxWidth: "600px",
        width: "100%",
        autoFocus: true,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result == "good") {
          this.openLoginDialog();
        }
      });
    }*/
}
