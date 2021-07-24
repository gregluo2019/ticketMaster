import { ElementRef } from "@angular/core";
import { ChangeDetectionStrategy } from "@angular/core";
import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { User } from "src/app/core/models/auth/register.model";

import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm.component";
import { Html2PlaintextPipe } from "src/app/core/pipe/htmlToPlaintext.pipe";
import { BaseComponent } from "../../base.component";
import { MatTableDataSource } from "@angular/material/table";
import { StaffEditComponent } from "../staff-edit-dialog/staff-edit.component";

export class StaffData {
  id: number;
  title: string;
  userName: string;
  phone: string;
  email: string;
  note: string;
  address: string;
}

@Component({
  selector: "app-staffs-list",
  templateUrl: "./staffs-list.component.html",
  styleUrls: ["./staffs-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaffsListComponent extends BaseComponent {
  users: User[] = [];
  displayedColumns = [];
  dataSource: MatTableDataSource<User>;

  index: number;
  userId: string;
  email = "";
  phone = "";
  userName = "";

  constructor(
    public dialog: MatDialog,
    private html2PlaintextPipe: Html2PlaintextPipe,
  ) {
    super();
    // this.spinner.show();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    if (this.appService.users.length === 0) {
      this.appService.getUsers()
    } else {
      this.initData()
    }
    this.appService.usersSubject.subscribe(() => {
      this.initData()
    })

    if (this.isSmallScreen) {
      this.displayedColumns = ["userName", "email"];

    } else {
      this.displayedColumns = ["actions", "userName", "email", "phone", "note"];

    }
  }

  initData() {
    this.users = this.appService.users
    if (!this.users) return;

    this.dataSource = new MatTableDataSource(this.users);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.spinner.hide();
  }

  ngAfterViewInit() { }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addNew(): void {
    this.appService.currentUser = new User()
    this.appService.currentUserSubject.next();
    this.openEditDialog();
  }

  userSelected(user: User): void {
    this.appService.currentUser = user
    this.appService.currentUserSubject.next();
    this.openEditDialog();
  }

  openEditDialog() {
    this.dialog.open(StaffEditComponent, {
      width: "60vw",
      maxWidth: "60vw",
      minHeight: "510px",
      panelClass: "my-dialog",
    });
  }

  deleteStaff(i: number, userId: string, phone: string) {
    this.index = i;
    this.userId = userId;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        text: "Are you sure you want remove this staff?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appService.deleteUser(userId)
      }
    });
  }
}
