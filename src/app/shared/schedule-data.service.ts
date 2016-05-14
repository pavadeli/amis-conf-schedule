import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/cache';
import 'rxjs/add/operator/map';

@Injectable()
export class ScheduleDataService {

    constructor(private http: Http) { }

    allData = this.http.get('https://data-api-lucasjellema.apaas.em2.oraclecloud.com/all')
        .map(r => <InputShape>r.json())
        .cache(1);

    rooms$ = this.allData.map(d => orderBy(d.rooms, e => e.roomLabel));
    slots$ = this.allData.map(d => orderBy(d.slots, e => e.slotStartTime));
    sessionModel$ = this.allData.map(d => new SessionsModel(d.sessions));
}

export class SessionsModel {
    constructor(private sessions: SessionShape[]) { }

    find(roomId: string, slotId: string): Session {
        for (let session of this.sessions) {
            if (session.planning.romId === roomId && session.planning.sltId === slotId) {
                return session;
            }
        }
        return null;
    }
}

function orderBy<T>(arr: T[], project: (element: T) => any): T[] {
    return arr.sort((a, b) => {
        let a1 = project(a), b1 = project(b);
        return +(a1 > b1) || +(a1 === b1) - 1;
    });
}

export interface Session {
    title: string;
    speakers: {
        firstName: string;
        lastName: string;
    }[];
}

export interface Room {
    roomId: string;
    roomLabel: string;
}

export interface Slot {
    slotId: string;
    slotLabel: string;
}

interface InputShape {
    rooms: Room[];

    slots: Slot & {
        slotStartTime: string;
        slotEndTime: string;
    }[];

    sessions: SessionShape[];
}

interface SessionShape extends Session {
    planning: {
        romId: string;
        sltId: string;
    };
}
