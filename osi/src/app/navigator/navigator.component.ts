import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  ProgressData,
  Navigate,
  Progress
} from '../orchestrator.service';
import { flowCentsOf } from '../domain/layers';

export interface SleepOption {
  name: string;
  ms: number;
}

const availableSleepOptions: SleepOption[] = [
  { name: '250 ms', ms: 250 },
  { name: 'pół sekundy', ms: 500 },
  { name: '4 sekundy', ms: 4 * 1000 },
  { name: '15 sekund', ms: 15 * 1000 },
  { name: 'pół minuty', ms: 30 * 1000 },
  { name: 'całą minutę', ms: 60 * 1000 },
  { name: '3 minuty', ms: 3 * 60 * 1000 },
  { name: '7 minut', ms: 7 * 60 * 1000 },
  { name: '16 minut', ms: 16 * 60 * 1000 }
];

@Component({
  selector: 'app-navigator',
  templateUrl: './navigator.component.html',
  styleUrls: ['./navigator.component.css']
})
export class NavigatorComponent implements OnDestroy {
  private readonly subscription: Subscription;
  private timer: number | null;
  private fastForward = false;
  readonly sleepOptions: SleepOption[];
  sleepOption = availableSleepOptions[2];
  currentProgress: ProgressData;
  progressPercent: number;
  autoNext = false;

  constructor(private readonly orchestrator: OrchestratorService) {
    this.sleepOptions = availableSleepOptions;
    this.subscription = orchestrator
      .registerNavigator()
      .subscribe(progress => this.handle(progress));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  autoNextChanged() {
    if (!this.autoNext) {
      this.clearTimer();
    }
  }

  canGoForward(): boolean {
    return this.isCurrent(Progress.LayerStep);
  }

  hasProgress(): boolean {
    return this.currentProgress != null;
  }

  isRunning(): boolean {
    return this.canGoForward() && !!this.timer;
  }

  flowRestart() {
    this.fastForward = false;
    this.orchestrator.navigate(Navigate.Restart);
  }

  flowStop() {
    this.autoNext = false;
    this.autoNextChanged();
  }

  flowNext() {
    this.clearTimer();
    this.orchestrator.navigate(Navigate.Next);
  }

  flowFinish() {
    this.fastForward = true;
    this.flowNext();
  }

  private isCurrent(progress: Progress): boolean {
    return this.hasProgress() && this.currentProgress.progress === progress;
  }

  private handle(progress: ProgressData) {
    this.setCurrentProgress(progress);
    if (this.isCurrent(Progress.Finished)) {
      this.clearTimer();
      return;
    }

    if (this.autoNext || this.fastForward) {
      this.setTimer(() => this.orchestrator.navigate(Navigate.Next));
    }
  }

  private setCurrentProgress(progress: ProgressData) {
    this.currentProgress = progress;

    switch (progress.progress) {
      case Progress.Beginning:
        this.progressPercent = 0;
        break;

      case Progress.Finished:
        this.progressPercent = 100;
        break;

      case Progress.LayerStep:
        this.progressPercent = flowCentsOf(progress.layerId);
        break;

      default:
        throw new Error(
          `Unknown value: '${progress.progress} for the 'Progress'.`
        );
    }
  }

  private setTimer(action: () => void) {
    this.clearTimer();
    this.timer = window.setTimeout(action, this.sleepTime());
  }

  private clearTimer() {
    window.clearTimeout(this.timer);
    this.timer = null;
  }

  private sleepTime(): number {
    if (this.isCurrent(Progress.Beginning) || this.fastForward) {
      return 0;
    }

    return this.sleepOption.ms;
  }
}
