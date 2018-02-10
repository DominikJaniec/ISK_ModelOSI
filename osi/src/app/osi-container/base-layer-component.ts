import { OnDestroy, Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { OrchestratorService } from '../orchestrator.service';
import { LayerContent } from './layer-content';
import { LayerData, Direction, LayerKind, LayerId } from '../domain/layers';

export abstract class BaseLayerComponent implements OnDestroy, LayerContent {
  protected sourceLayerData: LayerData = { blocks: [] };
  private clearStreamSubscription: Subscription;
  private layerDataSubscription: Subscription;
  private direction: Direction;

  constructor(private readonly orchestrator: OrchestratorService) {}

  initialize(direction: Direction) {
    this.direction = direction;

    const observables = this.orchestrator.registerLayer(this.getLayerId());
    this.clearStreamSubscription = observables.clearStream.subscribe(() => {
      this.sourceLayerData = { blocks: [] };
      this.clearRequested();
    });

    this.layerDataSubscription = observables.layerData.subscribe(data => {
      this.sourceLayerData = data;
      if (this.hasSource()) {
        this.processSourceLayerData();
        this.pushNextLayerData();
      }
    });
  }

  ngOnDestroy() {
    this.clearStreamSubscription.unsubscribe();
    this.layerDataSubscription.unsubscribe();
    this.onDestroy();
  }

  abstract getLayerKind(): LayerKind;

  isSender(): boolean {
    return this.direction === Direction.Sender;
  }

  hasSource(): boolean {
    return this.sourceLayerData.blocks.length > 0;
  }

  pushNextLayerData() {
    if (this.hasSource()) {
      const nextLayerData = this.getNextLayerData();
      this.orchestrator.ready(this.getLayerId(), nextLayerData);
    }
  }

  protected clearRequested(): void {}

  protected processSourceLayerData(): void {}

  protected getNextLayerData(): LayerData {
    return this.sourceLayerData;
  }

  protected onDestroy(): void {}

  private getLayerId(): LayerId {
    return {
      kind: this.getLayerKind(),
      direction: this.direction
    };
  }
}
