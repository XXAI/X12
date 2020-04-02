import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit {

  lat = 16.75305556;
  lng = -93.11555556;
  
  constructor() { }

  ngOnInit() {
  }

}
