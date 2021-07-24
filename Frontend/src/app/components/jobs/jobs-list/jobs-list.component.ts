import { ElementRef, HostListener } from "@angular/core";
import { Component, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";

import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm.component";
import { JobListDataSource } from "./jobs-list-data-source";
import { fromEvent, merge } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { BaseComponent } from "../../base.component";
import { Job, PaginationData } from '../jobs.model';
import { AppService } from '../../../core/services/app.service';
import { Router } from "@angular/router";

@Component({
  selector: "app-jobs-list",
  templateUrl: "./jobs-list.component.html",
  styleUrls: ["./jobs-list.component.scss"],
})
export class JobsListComponent extends BaseComponent {
  jobs: Job[] = [];
  countOfJobs: number;

  displayedColumns = [];
  dataSource: JobListDataSource;// MatTableDataSource<JobData>;

  constructor(public dialog: MatDialog, private router: Router, public appService: AppService) {
    super();
    // this.spinner.show();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    if (this.appService.jobs.length === 0) {
      this.appService.getJobs()
    } else {
      this.initData()
    }
    this.appService.jobsSubject.subscribe(() => {
      this.initData()
    })

    this.displayedColumns = [
      "qrCode",
      "jobNumber",
      "description",
      "actions",
    ];
  }
  initData() {
    this.jobs = this.appService.jobs
    this.countOfJobs = this.appService.countOfJobs
    this.setDataSource(this.jobs)
  }

  ngAfterViewInit() {
    if (this.sort && this.paginator) {
      this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      merge(this.sort.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadDataForPage())
        )
        .subscribe();
    }

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        tap(() => {
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }

          this.loadDataForPage();
        })
      )
      .subscribe();
  }

  loadDataForPage() {
    setTimeout(() => {
      let paginationData = new PaginationData(
        this.sort.active,
        this.sort.direction,
        this.paginator.pageIndex,
        this.paginator.pageSize,
        this.filter.nativeElement.value,
      );
      this.appService.getJobs(paginationData)
    })
  }

  openJobPage(job: Job) {
    this.appService.currentJob = job
    this.appService.jobUserActions = []
    this.appService.panels = []
    this.appService.currentJobSubject.next()
    this.router.navigate([`/jobs/${job.jobNumber}`]);
  }


  setDataSource(jobs: Job[]) {
    if (!jobs) return;

    let data: Job[] = []
    if (jobs.length > 0) {
      jobs.forEach((item, i) => {
        let jobData = new Job(
          item.id,
          item.jobNumber,
          item.description,
        );
        data.push(jobData);
      });
    }

    this.dataSource = new JobListDataSource(data);

    //this.spinner.hide();
  }

  deleteJob(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        text: "Are you sure you want delete this job?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appService.deleteJob(id)
      }
    });
  }

  get canEditJobs(): boolean {
    return this.canEdit && !this.isSmallScreen
  }

  // @HostListener("click")
  // setNormalQrCode() {
  //   this.appService.clickSubject.next()
  // }
}
