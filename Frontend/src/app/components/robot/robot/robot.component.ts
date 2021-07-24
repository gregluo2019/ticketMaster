import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FADE_IN_OUT_Height } from 'src/app/core/eh-animations';
import { GenericValidator } from 'src/app/shared/validators/generic-validator';

import { RobotService } from '../robot.service';

@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrls: ['./robot.component.scss'],
  animations: [FADE_IN_OUT_Height]
})
export class RobotComponent implements OnInit {
  toyRobot$ = null
  errorMessage = ''
  report = ''

  public form: FormGroup
  displayMessage: { [key: string]: string } = {}
  private validationMessages: { [key: string]: { [key: string]: string } }
  private genericValidator: GenericValidator
  protected unsubscribeAll = new Subject();

  placeholder = `Please input commands like 
PLACE X,Y,F
MOVE
LEFT 
RIGHT 
REPORT`

  constructor(protected fb: FormBuilder, private robotService: RobotService) {
    this.form = this.fb.group({
      commands: ['', [Validators.required]],
    });

    this.validationMessages = {
      commands: {
        required: "Commands are required.",
      },
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(
      () => {
        this.displayMessage = this.genericValidator.processMessages(this.form);
      });

    this.toyRobot$ = this.robotService.toyRobot$
    this.robotService.errorMessageSubject
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.errorMessage = data as string
      })
    this.robotService.reportSubject
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((data) => {
        this.report = data as string
      })
  }

  execute() {
    this.robotService.report = ''
    this.robotService.reportSubject.next('')
    this.robotService.errorMessage = ''
    this.robotService.errorMessageSubject.next('')
    setTimeout(() => {
      let data = this.form.value
      let commands = data.commands.split('\n')
      this.robotService.executeCommands(commands)
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.complete();
  }

  validateForm() {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }
}
