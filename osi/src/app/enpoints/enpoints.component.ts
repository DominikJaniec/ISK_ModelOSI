import { Component, OnInit } from '@angular/core';
import { Endpoints } from '../domain/endopoints';

@Component({
  selector: 'app-enpoints',
  templateUrl: './enpoints.component.html',
  styleUrls: ['./enpoints.component.css']
})
export class EnpointsComponent implements OnInit {
  readonly ends: Endpoints;

  constructor() {
    this.ends = new Endpoints();
  }

  ngOnInit() {
    this.regenerate();
  }

  regenerate() {
    this.ends.regenerate();
  }
}
