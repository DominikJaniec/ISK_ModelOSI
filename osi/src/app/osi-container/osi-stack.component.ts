import { Component, OnInit, Input } from '@angular/core';
import { Direction, LayerKind } from '../domain/layers';
import { TranslateService } from '../translate.service';

@Component({
  selector: 'app-osi-stack',
  templateUrl: './osi-stack.component.html',
  styleUrls: ['./osi-stack.component.css']
})
export class OsiStackComponent {
  @Input() direction: Direction;

  applicationLayerKind = LayerKind.Application;
  presentationLayerKind = LayerKind.Presentation;
  sessionLayerKind = LayerKind.Session;
  transportLayerKind = LayerKind.Transport;
  networkLayerKind = LayerKind.Network;
  dataLinkLayerKind = LayerKind.DataLink;
  PhysicalLayerKind = LayerKind.Physical;

  constructor(private readonly translate: TranslateService) {}

  getFlowDirectionName(): string {
    return this.translate.direction(this.direction);
  }
}
