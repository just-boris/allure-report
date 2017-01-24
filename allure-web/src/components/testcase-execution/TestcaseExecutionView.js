import {View} from 'backbone.marionette';
import {regions} from '../../decorators';
import pluginsRegistry from '../../util/pluginsRegistry';
import ExecutionView from '../execution/ExecutionView';
import template from './TestcaseExecutionView.hbs';

@regions({
    execution: '.testcase__execution'
})
class TestcaseExecutionView extends View {
    template = template;

    initialize() {
        this.plugins = [];
    }

    onRender() {
        this.showTestcasePlugins(this.$('.testcase__content_before'), pluginsRegistry.testcaseBlocks.before);
        this.showChildView('execution', new ExecutionView({
            baseUrl: this.options.baseUrl + '/' + this.model.id,
            model: this.model
        }));
        this.showTestcasePlugins(this.$('.testcase__content_after'), pluginsRegistry.testcaseBlocks.after);
    }

    onDestroy() {
        this.plugins.forEach(plugin => plugin.destroy());
    }

    showTestcasePlugins(container, plugins) {
        plugins.forEach((Plugin) => {
            const plugin = new Plugin({model: this.model});
            plugin.$el.appendTo(container);
            this.plugins.push(plugin);
            plugin.render();
        });
    }
}

export default TestcaseExecutionView;