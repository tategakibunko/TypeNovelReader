import { Injectable } from '@angular/core';
import {
  SemanticSeason,
  SemanticDate,
  SemanticTime,
  SemanticTimeDivision,
} from '../../common/models';

@Injectable({
  providedIn: 'root'
})
export class SemanticDataService {
  constructor() { }

  indexOfTime(time: string): number {
    return time.indexOf(':') < 0 ? -1 : +time.split(':')[0];
  }

  monthOfDate(date: string): number {
    return date.indexOf('/') < 0 ? -1 : +date.split('/')[0];
  }

  dayOfDate(date: string): number {
    return date.indexOf('/') < 0 ? -1 : +date.split('/')[1];
  }

  getTimeDivision(time: SemanticTime): SemanticTimeDivision | 'unknown' {
    if (!time) {
      return 'unknown';
    }
    const index = this.indexOfTime(time);
    if (0 <= index && index < 6 || 18 <= index && index <= 23) {
      return 'night';
    }
    if (6 <= index && index < 10) {
      return 'morning';
    }
    if (10 <= index && index < 16) {
      return 'noon';
    }
    if (16 <= index && index < 18) {
      return 'afternoon';
    }
    return 'unknown';
  }

  getTimeImageSrc(theme: string, time: SemanticTime): string {
    const division = this.getTimeDivision(time);
    return `assets/themes/${theme}/images/times/${division}.png`;
  }

  parseAnnotValue(value: string): string | undefined {
    if (value.startsWith('?')) {
      return undefined;
    }
    return value;
  }

  parseAnnotTime(value: string): SemanticTime {
    const time = this.parseAnnotValue(value);
    if (!time) {
      return undefined;
    }
    // [example] 1:10, 01:10, 7:20, 10:30 ...
    if (/\d{1,2}:\d{1,2}/.test(time) === false) {
      console.error(`parseAnnotTime: invalid format(${time})`);
      return undefined;
    }
    const index = this.indexOfTime(time);
    if (index < 0 || index >= 24) {
      console.error(`parseAnnotTime: invalid format(${time})`);
      return undefined;
    }
    return time;
  }

  parseAnnotSeason(value: string): SemanticSeason {
    const season = this.parseAnnotValue(value);
    if (!season) {
      return undefined;
    }
    if (season !== 'spring' && season !== 'summer' && season !== 'autumn' && season !== 'winter') {
      console.error(`parseAnnotSeason: invalid format(${season})`);
      return undefined;
    }
    return season;
  }

  parseAnnotDate(value: string): SemanticDate {
    const date = this.parseAnnotValue(value);
    if (!date) {
      return undefined;
    }
    if (/\d{1,2}\/\d{1,2}/.test(date) === false) {
      console.error(`parseAnnotDate: invalid format(${date})`);
      return undefined;
    }
    const month = this.monthOfDate(date);
    if (month < 0 || month > 12) {
      console.error(`parseAnnotDate: invalid format(${date})`);
      return undefined;
    }
    const day = this.dayOfDate(date);
    if (day < 0 || day > 31) {
      console.error(`parseAnnotDate: invalid format(${date})`);
      return undefined;
    }
    return date;
  }
}
