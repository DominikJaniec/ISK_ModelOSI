import {
  Component,
  ComponentRef,
  ComponentFactory,
  ComponentFactoryResolver,
  OnInit,
  OnDestroy,
  Input,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as uuid from 'uuid/v4';

import {
  OrchestratorService,
  ProgressData,
  Progress
} from '../orchestrator.service';
import { TranslateService } from '../translate.service';
import { LayerKind, Direction, LayerData, LayerId } from '../domain/layers';
import { LayerContent, layerContentTypeFactory } from './layer-content';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit, OnDestroy {
  readonly id = `layer-${uuid()}`;
  isCurrent = false;
  isExpanded = false;

  @Input() layerKind: LayerKind;
  @Input() direction: Direction;

  @ViewChild('layerContainer', { read: ViewContainerRef })
  private layerContainer: ViewContainerRef;
  private layerContentComponent: ComponentRef<LayerContent>;
  private navigatorSubscription: Subscription;

  constructor(
    private readonly resolver: ComponentFactoryResolver,
    private readonly orchestrator: OrchestratorService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit() {
    this.navigatorSubscription = this.orchestrator
      .registerNavigator()
      .subscribe(progress => this.handleProgress(progress));

    const componentType = layerContentTypeFactory(this.layerKind);
    const factory = this.resolver.resolveComponentFactory(componentType);
    this.layerContentComponent = this.layerContainer.createComponent(factory);
    this.layerContentComponent.instance.initialize(this.direction);

    if (
      this.layerKind === LayerKind.Application &&
      this.direction === Direction.Sender
    ) {
      this.isCurrent = true;
      this.isExpanded = true;
    }
  }

  ngOnDestroy() {
    this.layerContentComponent.destroy();
  }

  getLayerName(): string {
    return this.translate.layer(this.layerKind);
  }

  isReceiver(): boolean {
    return this.direction === Direction.Receiver;
  }

  private handleProgress(progress: ProgressData) {
    if (progress.progress !== Progress.LayerStep) {
      return;
    }

    this.isCurrent =
      this.layerKind === progress.layerId.kind &&
      this.direction === progress.layerId.direction;

    if (this.isCurrent) {
      this.isExpanded = true;
      this.scrollToSelf();
    }
  }

  private scrollToSelf() {
    document.getElementById(this.id).parentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }
}
