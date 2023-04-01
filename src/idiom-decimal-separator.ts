import {
  spreadsheet,
  Toptions
} from 'codemirror-lang-spreadsheet';
import { EditorView } from '@codemirror/view';
import { Compartment } from '@codemirror/state';

/**
 * Changes editor options (idiom and/or decimal separator)
 * @param editor the EditorView
 * @param languageCompartment the language compartment
 * @param options spreadsheet language options (idiom and/or decimal separator)
 */
export function setEditorOptions(
  editor: EditorView,
  languageCompartment: Compartment,
  options: Toptions
): void {
  editor.dispatch({
    effects: languageCompartment.reconfigure(spreadsheet(options)),
    changes: {
      //Force reprocessing
      from: 0,
      to: editor.state.doc.length,
      insert: editor.state.doc.toString()
    }
  });
}
