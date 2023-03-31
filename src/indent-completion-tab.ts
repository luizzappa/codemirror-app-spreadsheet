import { EditorView } from '@codemirror/view';
import { completionStatus, acceptCompletion } from '@codemirror/autocomplete';
import { ViewPlugin, ViewUpdate, KeyBinding, Command } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

// Select autocompletion with tab
// Inspired by: https://sourcegraph.com/github.com/sourcegraph/sourcegraph@f1c08e272abf56e8f107589a49bc2a5c54429d19/-/blob/client/search-ui/src/input/extensions/loading-indicator.ts
let isAutocompleteOpen = false;

function tabRun(view: EditorView) {
  return isAutocompleteOpen
    ? acceptCompletion(view)
    : indentWithTab.run && indentWithTab.run(view);
}

export const indentAndCompletionWithTab: KeyBinding = {
  ...indentWithTab,
  run: tabRun as Command
};

export function tabObservable() {
  return [
    ViewPlugin.fromClass(
      class {
        constructor(private view: EditorView) {}

        update(update: ViewUpdate) {
          const status = completionStatus(update.state);
          isAutocompleteOpen = status !== null;
        }
      }
    )
  ];
}
