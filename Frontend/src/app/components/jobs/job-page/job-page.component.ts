import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../core/services/app.service';
import { Job } from '../jobs.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-job-page',
  templateUrl: './job-page.component.html',
  styleUrls: ['./job-page.component.scss'],
})
export class JobPageComponent extends BaseComponent implements OnInit {
  jobNumber = ''
  job: Job = null

  public form: FormGroup;
  constructor(public appService: AppService, private router: Router, private route: ActivatedRoute, public fb: FormBuilder) {
    super()
    this.jobNumber = this.route.snapshot.paramMap.get("jobNumber");
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: 0,
      jobNumber: [{ value: '', disabled: true }, Validators.required],
      description: [{ value: '', disabled: !this.canEdit }],
    });

    if (this.appService.currentJob) {
      this.job = this.appService.currentJob
      this.initData()
    } else {
      this.job = this.appService.jobs.find(j => j.jobNumber === this.jobNumber)
      if (this.job) {
        this.appService.currentJob = this.job
        this.initData()
      } else {
        this.appService.getJob(this.jobNumber)
      }
    }
    this.appService.currentJobSubject.subscribe(() => {
      this.job = this.appService.currentJob
      this.initData()
    })
  }

  initData() {
    //this.form.patchValue(this.job);
    this.form.patchValue({
      id: this.job.id,
      jobNumber: this.job.jobNumber,
      description: this.job.description,
    });
  }

  public onSubmit() {
    const form = this.form.value;
    if (form.id === 0) {
      this.appService.addJob(new Job(0, this.jobNumber, form.description))
    } else {
      this.appService.editJob(new Job(form.id, this.jobNumber, form.description))
    }
    this.close();
  }

  close(): void {
    this.router.navigate([`/jobs`]);
  }

  // @HostListener("click")
  // setNormalQrCode() {
  //   this.appService.clickSubject.next()
  // }

  getPanelsCount(): string {
    if (this.appService.panels.length > 0)
      return `   (Count: ${this.appService.panels.length})`

    return ''
  }

  getJobUserActionsCount(): string {
    if (this.appService.jobUserActionsResult && this.appService.jobUserActionsResult.length > 0)
      return `   (Count: ${this.appService.jobUserActionsResult.length})`
    else if (this.appService.jobUserActions && this.appService.jobUserActions.length > 0)
      return `   (Count: ${this.appService.jobUserActions.length})`
    return ''
  }
}
