import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { Room, Slot, SessionsModel } from '../shared';
import { SessionPreviewComponent } from './session-preview';

@Component({
    moduleId: module.id,
    selector: 'acs-overview',
    templateUrl: 'overview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [SessionPreviewComponent]
})
export class OverviewComponent {

    @Input() rooms: Room[];
    @Input() slots: Slot[];
    @Input() sessionModel: SessionsModel;

}
