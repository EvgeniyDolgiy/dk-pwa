import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../../dialog.service';

@Component({
  selector: 'app-dialog-message',
  templateUrl: 'dialog-message.html',
})

export class DialogMessageComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: IDialogData) {}
}
