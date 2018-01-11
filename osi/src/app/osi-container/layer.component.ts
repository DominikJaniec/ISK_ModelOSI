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
  readonly id = uuid();
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
  }

  ngOnDestroy() {
    this.layerContentComponent.destroy();
  }

  getLayerName(): string {
    return this.translate.layer(this.layerKind);
  }

  getFlowName(): string {
    return this.translate.direction(this.direction);
  }

  private handleProgress(progress: ProgressData) {
    if (progress.progress !== Progress.LayerStep) {
      return;
    }

    this.isExpanded =
      this.layerKind === progress.layerId.kind &&
      this.direction === progress.layerId.direction;
  }
}
