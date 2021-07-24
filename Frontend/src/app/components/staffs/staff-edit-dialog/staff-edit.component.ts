import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GenericValidator } from "src/app/shared/validators/generic-validator";
import { User } from "src/app/core/models/auth/register.model";

import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { EventEmitter } from "@angular/core";
import { Output } from "@angular/core";

import { EDITOR_CONFIG } from "src/app/shared/ConstantItems";
import { BaseComponent } from "../../base.component";
import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm.component";
@Component({
  selector: "app-staff-edit",
  templateUrl: "./staff-edit.component.html",
  styleUrls: ["./staff-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class StaffEditComponent extends BaseComponent implements OnInit {

  user: User = null

  @Output() staffWasDeleted = new EventEmitter<string>();
  @Output() newStaffWasCreated = new EventEmitter<User>();
  @Output() staffWasUpdated = new EventEmitter<User>();
  @Output() staffWasChanged = new EventEmitter<number>();

  pageTitle = "User Edit";
  errorMessage = "";
  form: FormGroup;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<StaffEditComponent>,
    private fb: FormBuilder,
  ) {
    super()
    this.validationMessages = {
      userName: {
        required: "Full name is required.",
      },
      email: {
        required: "Email is required.",
      },
    };

    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    if (this.appService.currentUser) {
      this.user = this.appService.currentUser
      this.initData()
    }
    this.appService.currentUserSubject.subscribe(() => {
      this.user = this.appService.currentUser
      this.initData()
    })

    // Watch for value changes for validation
    this.form.valueChanges.subscribe(
      () =>
      (this.displayMessage = this.genericValidator.processMessages(
        this.form
      ))
    );

  }
  initData() {
    this.iniStaffForm();
    this.form.patchValue(this.user);
  }
  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(
      this.form
    );
  }

  get email() {
    return this.form.get("email");
  }

  iniStaffForm() {
    if (!this.form) {
      this.form = this.fb.group({
        userName: [{ value: '', disabled: this.user.id != "" }, Validators.required],
        phone: [""],
        email: [{ value: '', disabled: this.user.id != "" }, Validators.email],
        isManager: false,
        // address: [""],
        // isActive: true,
        note: "",
      });
    }
  }
  displayStaff(user: User | null): void {
    if (user) {
      // Reset the form back to pristine
      this.iniStaffForm();
      this.form.reset();

      // Update the data on the form
      this.form.patchValue(user);

      if (user.id === "") {
        this.pageTitle = "Add New Staff";
      } else {
        this.pageTitle = `Edit Staff`;
      }
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  deleteStaff(staff: User): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        text: "Are you sure you want delete this staff?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appService.deleteUser(staff.id)
        this.close()
      }
    });
  }

  saveStaff(originalStaff: User): void {
    if (this.form.valid) {
      if (this.form.dirty) {
        const user: User = {
          ...originalStaff,
          ...this.form.value,
        };

        if (!user.password) {
          user.password = "vitragroup"
        }
        if (!user.pw) {
          user.pw = "vitragroup"
        }

        if (user.id === "") {
          this.appService.addUser(user)
        } else {
          this.appService.editUser(user)
        }
        this.close()
      }
    }
  }
}
