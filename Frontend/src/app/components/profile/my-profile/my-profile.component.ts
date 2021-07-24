import { Component, OnInit } from "@angular/core";

import { BaseComponent } from "../../base.component";

import { FormBuilder, Validators } from "@angular/forms";
import { compareValidator } from "src/app/shared/validators/compare-validator.directive";
import { FADE_IN_OUT, FADE_IN_OUT_Width } from "src/app/core/eh-animations";
import { User } from "src/app/core/models/auth/register.model";

@Component({
  selector: "app-my-profile",
  templateUrl: "./my-profile.component.html",
  styleUrls: ["./my-profile.component.scss"],
  animations: [FADE_IN_OUT_Width, FADE_IN_OUT]
})
export class MyProfileComponent extends BaseComponent implements OnInit {
  public myForm;

  constructor(
    protected fb: FormBuilder
  ) {
    super();

    this.myForm = this.fb.group({
      setNewPassword: false,
      oldPassword: '',
      password: '',
      confirmPassword: '',
    });

    this.myForm.get('oldPassword').setValidators(Validators.required);
    this.myForm.get('oldPassword').setValidators(Validators.minLength(8));
    this.myForm.get('password').setValidators(Validators.required);
    this.myForm.get('password').setValidators(Validators.minLength(8));
    this.myForm.get('confirmPassword').setValidators(Validators.required);
    this.myForm.get('confirmPassword').setValidators(compareValidator("password"));
  }

  ngOnInit() {
    this.myForm.patchValue({
      oldPassword: '',
      password: '',
      confirmPassword: '',
    });


  }

  get oldPassword() {
    return this.myForm.get("oldPassword");
  }
  get password() {
    return this.myForm.get("password");
  }
  get confirmPassword() {
    return this.myForm.get("confirmPassword");
  }

  save(): void {
    const form = this.myForm.value;
    const user = new User(
      this.authService.email,
      this.authService.userName,
      form.password || "vitragroup",
      form.oldPassword || "vitragroup",
    );

    this.authService.updateUserPassword(user).subscribe(() => {
      this.snackBar.open("Saved successful! Please login again.", '', {
        duration: 3000,
        panelClass: ['mat-toolbar', 'mat-primary'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      this.myForm.reset();
      this.authService.logout();
    });
  }
}
