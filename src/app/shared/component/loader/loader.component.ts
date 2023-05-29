// my-loader.component.ts
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from 'src/app/core/services/loader.service';

/** 
* Brief description of the function here.
* @summary If the description is long, write your summary here. Otherwise, feel free to remove this.
* @param {ParamDataTypeHere} parameterNameHere - Brief description of the parameter here. Note: For other notations of data types, please refer to JSDocs: DataTypes command.
* @return {ReturnValueDataTypeHere} Brief description of the returning value here.
*/

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

  spinnerActive: boolean = true;

  constructor(public spinnerService: LoaderService, private spinner: NgxSpinnerService) {
    this.spinnerService.showSpinner.subscribe(this.showSpinner.bind(this));
  }

  showSpinner = (state: boolean): void => {
    this.spinnerActive = state;
    if (this.spinnerActive) {
      this.spinner.show();
    }
    else {
      this.spinner.hide();
    }

  };

  ngOnInit(): void {

  }

}
