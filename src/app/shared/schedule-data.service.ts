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
        this.slots = orderBy(slots, e => e.slotStartTime)
            .map(({slotId, slotLabel, slotStartTime, slotEndTime}) => ({
                slotId, slotLabel, slotStartTime, slotEndTime,
                sessions: createSessionMap(sessions, rooms, slotId)
            }));
    }
}

function createSessionMap(sessions: SessionShape[], rooms: Room[], slotId: string): SessionMap {
    let smap: SessionMap = {};
    let roomsToFind = new Set<string>(rooms.map(r => r.roomId));
    for (let session of sessions) {
        if (session.planning.sltId === slotId) {
            let {romId} = session.planning;
            roomsToFind.delete(romId);
            smap[romId] = session;
            if (session.planning.sessionDuration === '2') {
                session.doubleSlot = true;
            }
        }
    }
    // Some rooms were not filled, find out what is going on...
    roomsToFind.forEach(roomId => {
        // Try previous slot.
        let previousSlotId = (+slotId - 1).toString();
        for (let session of sessions) {
            if (session.planning.sltId === previousSlotId && session.planning.romId === roomId) {
                if (session.planning.sessionDuration === '2') {
                    // Aha!
                    let {speakers, title} = session;
                    smap[roomId] = { speakers, title, continued: true };
                } else {
                    // Give up.
                    return;
                }
            }
        }
    });
    return smap;
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
    continued?: boolean;
    doubleSlot?: boolean;
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
        sessionDuration: string;
    };
}
