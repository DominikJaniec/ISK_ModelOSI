import { Component, OnInit, Input } from '@angular/core';
import { Endpoint } from '../domain/endopoint';

@Component({
  selector: 'app-endpoint',
  templateUrl: './endpoint.component.html',
  styleUrls: ['./endpoint.component.css']
})
export class EndpointComponent implements OnInit {
  @Input() displayName: string;
  @Input() endpoint: Endpoint;

  constructor() {}

  ngOnInit() {}
}
