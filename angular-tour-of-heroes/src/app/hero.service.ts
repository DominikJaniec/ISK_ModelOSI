import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessagesService } from './messages.service';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';

@Injectable()
export class HeroService {
  constructor(private messageService: MessagesService) {}

  getHeroes(): Observable<Hero[]> {
    // TODO: Send the message _after_ fetching the heroes.
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  }
}
