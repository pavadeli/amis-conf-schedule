import {
    Component, Input, ViewEncapsulation, ChangeDetectionStrategy, OnChanges
} from '@angular/core';
import { Session } from '../../shared';

@Component({
    moduleId: module.id,
    selector: 'acs-session-preview',
    templateUrl: 'session-preview.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionPreviewComponent implements OnChanges {

    @Input() session: Session;

    title: string;
    speakers: string;

    ngOnChanges() {
        if (this.session) {
            this.title = this.session.title;
            this.speakers = this.session.speakers
                .map(s => `${s.firstName} ${s.lastName}`)
                .join(', ');
        }
    }

}
