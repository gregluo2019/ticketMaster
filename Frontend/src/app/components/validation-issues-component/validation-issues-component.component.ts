import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { VpValidation, VpValidationIssue } from 'src/app/core/models/vp-core';

@Component({
  selector: 'vp-validation-issues-component',
  templateUrl: './validation-issues-component.component.html',
  styleUrls: ['./validation-issues-component.component.scss']
})
export class ValidationIssuesComponent implements OnInit, OnDestroy {

  @Input() showInfo: boolean = false;
  @Input() showWarning: boolean = false;
  @Input() validation: VpValidation;

  constructor() { }

  public ngOnInit(): void {
  }

  public ngOnDestroy(): void {
  }

  filteredIssues(state: string): Array<VpValidationIssue> {
    return this.validation.issues.filter(o => o.state === state);
  }
}

