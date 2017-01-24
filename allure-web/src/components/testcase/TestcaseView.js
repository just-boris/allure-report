import './styles.css';
import {View} from 'backbone.marionette';
import {on, regions, behavior} from '../../decorators';
import template from './TestcaseView.hbs';
import * as tabs from './tabs';

const SEVERITY_ICONS = {
    blocker: 'fa fa-exclamation-triangle',
    critical: 'fa fa-exclamation',
    normal: 'fa fa-file-o',
    minor: 'fa fa-arrow-down',
    trivial: 'fa fa-long-arrow-down'
};

@behavior('TooltipBehavior', {position: 'bottom'})
@regions({
    content: '.testcase__content'
})
class TestcaseView extends View {
    template = template;

    initialize({state}) {
        this.state = state;
        this.listenTo(this.state, 'change:attachment', this.highlightSelectedAttachment, this);
    }

    onRender() {
        const ChildView = tabs[this.state.get('attachment')] || tabs.execution;
        this.showChildView('content', new ChildView({
            model: this.model,
            baseUrl: this.options.baseUrl
        }));
        // this.highlightSelectedAttachment();
    }

    highlightSelectedAttachment() {
        const currentAttachment = this.state.get('attachment');
        this.$('.attachment-row').removeClass('attachment-row_selected');
        this.$(`.attachment-row[data-uid="${currentAttachment}"]`).addClass('attachment-row_selected');
    }

    serializeData() {
        return Object.assign({
            severityIcon: SEVERITY_ICONS[this.model.get('severity')],
            route: {
                baseUrl: this.options.baseUrl
            }
        }, super.serializeData());
    }

    @on('dblclick .testcase__failure')
    @on('click .testcase__trace-toggle')
    onStacktraceClick() {
        this.$('.testcase__failure').toggleClass('testcase__failure_expanded');
    }

    @on('click .pane__subtitle')
    onSubtitleClick() {
        this.$('.pane__subtitle').toggleClass('line-ellipsis', false);
    }
}

export default TestcaseView;
