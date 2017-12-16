import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import {
  OrchestratorService,
  LogEntry,
  LogEvent
} from '../orchestrator.service';

export interface LogItem {
  readonly header: string;
  readonly body?: string;
}

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrls: ['./logger.component.css']
})
export class LoggerComponent implements OnInit, OnDestroy {
  private readonly subscription: Subscription;
  @Input() enabled: boolean;
  @Input() onlyConsole = false;
  @Input() stringifyData = true;
  @Input() pushAtEnd = false;
  entries: LogItem[] = [];

  constructor(private readonly orchestrator: OrchestratorService) {
    this.subscription = orchestrator
      .registerLogger()
      .subscribe(entry => this.handleLog(entry));
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  clear() {
    this.entries = [];
  }

  hide() {
    this.onlyConsole = true;
    this.clear();
  }

  private handleLog(entry: LogEntry) {
    if (!this.enabled) {
      return;
    }

    const header = makeHeader(entry.event);

    // tslint:disable-next-line:no-console
    console.info('# Event Log: ' + header, entry.data);

    this.toLog({
      header: header,
      body: this.stringifyData ? JSON.stringify(entry.data) : undefined
    });
  }

  private toLog(item: LogItem): void {
    if (this.pushAtEnd) {
      this.entries.push(item);
    } else {
      this.entries.unshift(item);
    }
  }
}

function makeHeader(event: LogEvent): string {
  const time = new Date(Date.now());
  return (
    time.toLocaleTimeString() +
    '.' +
    time.getMilliseconds() +
    ' | ' +
    LogEvent[event]
  );
}
