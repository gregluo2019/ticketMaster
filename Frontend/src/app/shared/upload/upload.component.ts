import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AppService } from 'src/app/core/services/app.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadFileComponent implements OnInit {
  progress: number = 0;
  message: string = '';
  fileList: string[] = [];

  @Input() disabled: boolean = false;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(public appService: AppService) { }

  ngOnInit() {
    console.log();
  }

  public uploadFile = (files: any) => {
    this.progress = 0;
    this.message = ''
    if (files.length === 0) {
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(files[i].name, files[i]);
    }

    this.appService.uploadFile(formData)
  };
}
