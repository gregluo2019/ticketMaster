import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import { BaseComponent } from "../../base.component";
import { JobUserAction } from '../jobs.model';
import { AppService } from '../../../core/services/app.service';
import { MatTableDataSource } from "@angular/material/table";
import * as moment from 'moment';
import { ExportService } from '../../../core/services/export.service';
import { TIME_FORMAT, DATE_FORMAT } from "src/app/shared/ConstantItems";

export class ExportSheet extends Array<Array<any>> { }

@Component({
  selector: "app-job-user-list",
  templateUrl: "./job-user-list.component.html",
  styleUrls: ["./job-user-list.component.scss"],
})
export class JobUserListComponent extends BaseComponent {
  jobUserActions: JobUserAction[] = [];
  displayedColumns = [];
  dataSource: MatTableDataSource<JobUserAction>;

  constructor(public dialog: MatDialog, public appService: AppService) {
    super();
    //  this.spinner.show();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    if (this.appService.jobUserActions.length === 0) {
      this.appService.getJobUserActions()
    } else {
      this.initData()
    }
    this.appService.jobUserActionsSubject.subscribe(() => {
      this.initData()
    })

    this.displayedColumns = ["userName", "action", "start", "end", "duration", "rate"];
  }

  getCheckInTime(ju: JobUserAction): moment.Moment {
    let checkInOutOfUser = this.jobUserActions.find(a => {
      let isSameDay = a.start.format(DATE_FORMAT) === ju.start.format(DATE_FORMAT)
      return a.jobId === 1 && a.userId === ju.userId && isSameDay;
    })
    if (checkInOutOfUser) {
      return moment(checkInOutOfUser.start)
    } else {
      return null
    }
  }

  initData() {
    let createNewJobUserAction = (ju: JobUserAction, rate1EndTime: moment.Moment, rate1_5EndTime: moment.Moment) => {
      let start = moment(ju.start)
      let end = moment(ju.end)

      if (end <= rate1EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, end, this.getDuration(start, end), 1);

        jobUserActionsResult.push(newJobUserAction)
      }

      if (start < rate1EndTime && end > rate1EndTime && end <= rate1_5EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, rate1EndTime, this.getDuration(start, rate1EndTime), 1);

        jobUserActionsResult.push(newJobUserAction)

        newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          rate1EndTime, end, this.getDuration(rate1EndTime, end), 1.5);

        jobUserActionsResult.push(newJobUserAction)
      }

      if (start < rate1EndTime && end > rate1_5EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, rate1EndTime, this.getDuration(start, rate1EndTime), 1);

        jobUserActionsResult.push(newJobUserAction)

        newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          rate1EndTime, rate1_5EndTime, this.getDuration(rate1EndTime, rate1_5EndTime), 1.5);

        jobUserActionsResult.push(newJobUserAction)

        newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          rate1_5EndTime, end, this.getDuration(rate1_5EndTime, end), 2);

        jobUserActionsResult.push(newJobUserAction)
      }

      if (start > rate1EndTime && start < rate1_5EndTime && end > rate1EndTime && end <= rate1_5EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, end, this.getDuration(start, end), 1.5);

        jobUserActionsResult.push(newJobUserAction)
      }

      if (start >= rate1EndTime && start < rate1_5EndTime && end > rate1_5EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, rate1_5EndTime, this.getDuration(start, rate1_5EndTime), 1.5);

        jobUserActionsResult.push(newJobUserAction)

        newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          rate1_5EndTime, end, this.getDuration(rate1_5EndTime, end), 2);

        jobUserActionsResult.push(newJobUserAction)
      }

      if (start >= rate1_5EndTime && end > rate1_5EndTime) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, ju.action,
          start, end, this.getDuration(start, end), 2);

        jobUserActionsResult.push(newJobUserAction)
      }
    }

    let jobUserActionsResult: JobUserAction[] = []
    this.jobUserActions = this.appService.jobUserActions
    if (!this.jobUserActions) return;

    this.jobUserActions.forEach(ju => {
      ju.start = moment.utc(ju.start).local()
      ju.end = moment.utc(ju.end).local()
    });

    this.jobUserActions.forEach(ju => {
      if (ju.jobId === 1) {
        let newJobUserAction = new JobUserAction(ju.jobId, ju.jobNumber, ju.userId, ju.userName, 'Check In/Out',
          ju.start, ju.end, this.getDuration(ju.start, ju.end), null);

        jobUserActionsResult.push(newJobUserAction)
      } else {
        let checkIn = this.getCheckInTime(ju)
        if (checkIn) {
          let rate1EndTime = moment(checkIn).add(8, 'hours').add(30, 'minutes')
          let rate1_5EndTime = moment(checkIn).add(11, 'hours').add(30, 'minutes')
          createNewJobUserAction(ju, rate1EndTime, rate1_5EndTime)
        } else {
          let rate1EndTime = moment(ju.end.format('YYYY-MM-DD') + 'T' + '15:30:00')
          let rate1_5EndTime = moment(ju.end.format('YYYY-MM-DD') + 'T' + '18:30:00')
          createNewJobUserAction(ju, rate1EndTime, rate1_5EndTime)
        }
      }
    });

    this.dataSource = new MatTableDataSource(jobUserActionsResult);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.spinner.hide();

    this.appService.jobUserActionsResult = jobUserActionsResult
    this.applyFilter()
  }

  ngAfterViewInit() { }

  applyFilter() {
    const filterValue = this.filter.nativeElement.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDuration(startTime: moment.Moment, endTime: moment.Moment): string {
    var duration = moment.duration(endTime.diff(startTime));
    var result = Math.round(duration.asHours() * 100) / 100;
    return result.toString()
  }

  exportAsXLSX(): void {
    const data: ExportSheet = new ExportSheet();

    // header row
    const headerRow: Array<any> = new Array<any>();
    headerRow.push('');
    headerRow.push('Job Code');
    headerRow.push('Title');
    headerRow.push('Account');
    headerRow.push('Staff Name');
    headerRow.push('Code');
    headerRow.push('Details');
    headerRow.push('Start Date');
    headerRow.push('Start Time');
    headerRow.push('End Date');
    headerRow.push('End Time');
    headerRow.push('Hours');
    headerRow.push('Cost');
    headerRow.push('Rate');

    data.push(headerRow);
    // Item rows
    let sortedFilteredData = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    for (const userAction of sortedFilteredData) { //jobUserActions
      const row: Array<any> = new Array<any>();
      row.push('');
      row.push(userAction.jobNumber);
      row.push('');
      row.push('');
      row.push(userAction.userName);
      row.push('');
      row.push(userAction.action);
      row.push(userAction.start ? moment(userAction.start).format("DD/MM/YYYY") : '');
      row.push(userAction.start ? moment(userAction.start).format("HH:mm:ss") : '');
      row.push(userAction.end ? moment(userAction.end).format("DD/MM/YYYY") : '');
      row.push(userAction.end ? moment(userAction.end).format("HH:mm:ss") : '');
      row.push(userAction.duration);
      row.push('');
      row.push(userAction.rate);
      data.push(row);
    }
    const name = `Job-${this.appService.currentJob.jobNumber}`;
    (new ExportService()).exportAsExcelFile(data, name);
  }

  refresh() {
    this.appService.getJobUserActions()
  }

  formatTime(time: moment.Moment): string {
    return time.format(TIME_FORMAT)
  }
}
