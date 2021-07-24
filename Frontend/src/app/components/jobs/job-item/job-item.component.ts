import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/components/base.component';
import { STATUS_COLOR, STATUS } from "src/app/shared/ConstantItems";
import { Job } from '../jobs.model';

@Component({
  selector: 'app-job-item',
  templateUrl: './job-item.component.html',
  styleUrls: ['./job-item.component.scss']
})
export class JobItemComponent extends BaseComponent implements OnInit, OnDestroy {
  startWorking = false

  private _job: Job;
  get job(): Job {
    return this._job;
  }
  @Input() set job(val: Job) {
    if (!val) { return; }

    this._job = val;
  }

  constructor(public dialog: MatDialog) {
    super()
  }

  ngOnInit(): void { }

  endWorking() { }

  get statusColor() {
    return ''
    // switch (this.job.status) {
    //   case STATUS.Cutting:
    //     return STATUS_COLOR.Cutting
    //   case STATUS.Sanding:
    //     return STATUS_COLOR.Sanding
    //   case STATUS.BaseCoating:
    //     return STATUS_COLOR.BaseCoating
    //   case STATUS.TopCoating:
    //     return STATUS_COLOR.TopCoating
    //   case STATUS.Packing:
    //     return STATUS_COLOR.Packing
    // }
  }

  get nextStatus(): string {
    return ''
    // switch (this.job.status) {
    //   case '':
    //     return STATUS.Cutting
    //   case STATUS.Cutting:
    //     return STATUS.Sanding
    //   case STATUS.Sanding:
    //     return STATUS.BaseCoating
    //   case STATUS.BaseCoating:
    //     return STATUS.TopCoating
    //   case STATUS.TopCoating:
    //     return STATUS.Packing
    //   case STATUS.Packing:
    //     return ""
    // }
  }

  hasStarted(): boolean {
    if (this.startWorking)
      return true
    return false
  }

  scanSuccessHandler(result) {
    console.log(result)
  }
}
