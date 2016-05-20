import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/cache';
import 'rxjs/add/operator/map';

@Injectable()
export class ScheduleDataService {

    constructor(private http: Http) { }

    model$ = this.http.get('https://data-api-lucasjellema.apaas.em2.oraclecloud.com/all')
        .map(r => new ScheduleDataModel(r.json()))
        .cache(1);

}

export class ScheduleDataModel {
    rooms: Room[];
    slots: SlotInfo[];

    constructor({rooms, slots, sessions}: InputShape) {
        this.rooms = orderBy(rooms, e => e.roomLabel);
        sessions.forEach(session => {
            let {planning} = session;
            session.startTime = planning.slotDate + ' ' + planning.sessionStartTime;
            session.endTime = planning.slotDate + ' ' + planning.sessionEndTime;
            session.slots = 0;
        });
        this.slots = orderBy(slots, e => e.slotStartTime)
            .map(slot => {
                let {slotId, slotLabel, slotStartTime, slotEndTime} = slot;
                return {
                    slotId, slotLabel, slotStartTime, slotEndTime,
                    sessions: createSessionMap(sessions, rooms, slot)
                };
            });
    }
}

function createSessionMap(sessions: SessionShape[], rooms: Room[], slot: Slot): SessionMap {
    let smap: SessionMap = {};
    for (let session of sessions) {
        if (session.startTime === slot.slotStartTime ||
            session.startTime <= slot.slotStartTime && session.endTime > slot.slotStartTime) {
            let oldSession = smap[session.planning.romId];
            if (oldSession) {
                console.warn('Scheduling conflict! Already a session present at this slot!');
                --oldSession.slots;
            }
            smap[session.planning.romId] = session;
            ++session.slots;
        }
    }
    return smap;
}

function orderBy<T>(arr: T[], project: (element: T) => any): T[] {
    return arr.sort((a, b) => {
        let a1 = project(a), b1 = project(b);
        return +(a1 > b1) || +(a1 === b1) - 1;
    });
}

export interface SlotInfo extends Slot {
    sessions: SessionMap;
}

export interface SessionMap {
    [room: string]: Session;
}

export interface Session {
    title: string;
    speakers: {
        firstName: string;
        lastName: string;
    }[];
    startTime: string;
    endTime: string;
    slots: number;
}

export interface Room {
    roomId: string;
    roomLabel: string;
}

export interface Slot {
    slotId: string;
    slotLabel: string;
    slotStartTime: string;
    slotEndTime: string;
}

interface InputShape {
    rooms: Room[];
    slots: Slot[];
    sessions: SessionShape[];
}

interface SessionShape extends Session {
    planning: {
        romId: string;
        sltId: string;
        slotDate: string;
        sessionStartTime: string;
        sessionEndTime: string;
    };
}
