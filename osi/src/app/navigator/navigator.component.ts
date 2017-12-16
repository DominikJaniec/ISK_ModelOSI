import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  ProgressData,
  Navigate,
  Progress
} from '../orchestrator.service';

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription;
  private timer: number | null;
  private fastForward = false;
  currentProgress: ProgressData;
  autoNext = true;
  sleepSeconds = 4;

  constructor(private readonly orchestrator: OrchestratorService) {
    this.subscription = orchestrator
      .registerNavigator()
      .subscribe(progress => this.handle(progress));
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  hasProgress(): boolean {
    return this.currentProgress != null;
  }

  canGoForward(): boolean {
    return this.isCurrent(Progress.LayerStep);
  }

  flowRestart() {
    this.fastForward = false;
    this.orchestrator.navigate(Navigate.Restart);
  }

  flowFinish() {
    this.fastForward = true;
    this.flowNext();
  }

  flowNext() {
    this.clearTimer();
    this.orchestrator.navigate(Navigate.Next);
  }

  autoNextChanged() {
    if (!this.autoNext) {
      this.clearTimer();
    }
  }

  private isCurrent(progress: Progress): boolean {
    return this.hasProgress() && this.currentProgress.progress === progress;
  }

  private handle(progress: ProgressData) {
    this.currentProgress = progress;
    if (this.isCurrent(Progress.Finished)) {
      return;
    }

    if (this.autoNext || this.fastForward) {
      this.setTimer(() => this.orchestrator.navigate(Navigate.Next));
    }
  }

  private setTimer(action: () => void): void {
    this.clearTimer();
    this.timer = window.setTimeout(action, this.sleepTime());
  }

  private clearTimer(): void {
    window.clearTimeout(this.timer);
    this.timer = null;
  }

  private sleepTime(): number {
    if (this.isCurrent(Progress.Beginning) || this.fastForward) {
      return 0;
    }

    return this.sleepSeconds * 1000;
  }
}
