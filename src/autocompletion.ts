import {
  autocompletion,
  CompletionContext,
  Completion,
  CompletionResult
} from '@codemirror/autocomplete';
import { syntaxTree } from '@codemirror/language';
import { Toptions } from 'codemirror-lang-spreadsheet';
import { EditorView } from '@codemirror/view';
import { Compartment } from '@codemirror/state';

/**
 * Dispatch a autocompletion reconfigure on editor
 * @param editor the Editor View
 * @param autocompleteCompartment the autocomplete compartment
 * @param newIdiom the new idiom to autocomplete
 */
export async function setAutocompletionIdiom(
  editor: EditorView,
  autocompleteCompartment: Compartment,
  newIdiom: NonNullable<Toptions['idiom']>
): Promise<any> {
  const fileName = `${newIdiom}.json`,
    optionsResponse = await fetch(fileName);
  if (!optionsResponse.ok) throw new Error(`Failed to fetch ${fileName}`);

  const options = await optionsResponse.json();
  function completions(context: CompletionContext): CompletionResult | null {
    const currNode = syntaxTree(context.state).resolveInner(context.pos, 0);
    if (currNode.name === 'TextToken') return null;
    const word = context.matchBefore(/\w*/);
    if (word && word.from == word.to && !context.explicit) return null;
    return {
      from: word!.from,
      options: options.map(
        (label: string): Completion => ({
          label,
          type: 'function',
          apply: `${label}(`
        })
      )
    };
  }

  editor.dispatch({
    effects: autocompleteCompartment.reconfigure(
      autocompletion({ override: [completions] })
    )
  });
}
