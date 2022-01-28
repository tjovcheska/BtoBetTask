import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EventModel } from './event-dashboard.model';

@Component({
  selector: 'app-event-dashboard',
  templateUrl: './event-dashboard.component.html',
  styleUrls: ['./event-dashboard.component.css']
})
export class EventDashboardComponent implements OnInit {

  formValue !: FormGroup;
  eventModelObj : EventModel = new EventModel();
  eventData !: any;
  showAdd !: boolean;
  showUpdate !: boolean;

  constructor(private formbuilder: FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      eventName : [''],
      eventDate : [''],
      eventDescription : ['']
    })
    this.getAllEvents();
  }

  clickAddEvent() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEventDetails() {
    this.eventModelObj.eventName = this.formValue.value.eventName;
    this.eventModelObj.eventDate = this.formValue.value.eventDate;
    this.eventModelObj.eventDescription = this.formValue.value.eventDescription;

    this.api?.postEvent(this.eventModelObj)
    .subscribe(res=>{
      console.log(res);
      alert("Event added successully!")
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEvents();
    },
    err=>{
      alert("Something went wrong!");
    })
  }

  getAllEvents() {
    this.api.getEvent()
    .subscribe(res=>{
      this.eventData = res;
    })
  }

  deleteEvent(row: any) {
    this.api.deleteEvent(row.id).
    subscribe(res=>{
      alert("Event Deleted!");
      this.getAllEvents();
    })
  }

  onEdit(row: any) {
    this.showAdd = true;
    this.showUpdate = false;
    this.eventModelObj.id = row.id;
    this.formValue.controls['eventName'].setValue(row.eventName);
    this.formValue.controls['eventDate'].setValue(row.eventDate);
    this.formValue.controls['eventDescription'].setValue(row.eventDescription);
  }

  updateEventDetails() {
    this.eventModelObj.eventName = this.formValue.value.eventName;
    this.eventModelObj.eventDate = this.formValue.value.eventDate;
    this.eventModelObj.eventDescription = this.formValue.value.eventDescription;

    this.api.updateEvent(this.eventModelObj, this.eventModelObj.id)
    .subscribe(res=>{
      alert("Updated successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEvents();
    });
  }
}
