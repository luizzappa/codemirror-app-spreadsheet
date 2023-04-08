//3rd's
import { basicSetup } from 'codemirror';
import { EditorView, keymap } from '@codemirror/view';
import { spreadsheet, Toptions } from 'codemirror-lang-spreadsheet';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { Compartment } from '@codemirror/state';

// Locals
import {
  indentAndCompletionWithTab,
  tabObservable
} from './indent-completion-tab';
import { setAutocompletionIdiom } from './autocompletion';
import { setEditorOptions } from './idiom-decimal-separator';
import { codePrettier } from './prettier';

const defaultIdiom = 'en-US',
  inptIdiom = document.getElementById('langComp') as HTMLSelectElement,
  inptSeparator = document.getElementById('separator') as HTMLSelectElement,
  inptIndent = document.getElementById('indent') as HTMLInputElement,
  btnPrettier = document.getElementById('prettier') as HTMLButtonElement,
  languageCompart = new Compartment(),
  autocompleteCompart = new Compartment();

/**
 * Configure highlighting
 */
const myHighlightStyle = HighlightStyle.define([
  { tag: tags.name, color: 'green' }, // Color of functions
  { tag: tags.bool, color: '#A020F0' }, // Color of booleans (TRUE or FALSE)
  { tag: tags.color, color: '#0000FF' }, // Color of references (eg.: cell, range, named range,...)
  { tag: tags.invalid, color: '#FA6F66' } // Color of erros (eg.: #N/A, #DIV/0!, #REF!, #NAME!...)
]);

/**
 * Create the editor
 */
const extensions = [
  basicSetup,
  keymap.of([indentAndCompletionWithTab]),
  syntaxHighlighting(myHighlightStyle),
  tabObservable(),
  EditorView.lineWrapping
];

const editor = new EditorView({
  doc: 'IF(SUM(IF(A1=A2,10,-1))=1, "Condition1", "Condition2")',
  extensions: [
    ...extensions,
    languageCompart.of(spreadsheet()),
    autocompleteCompart.of([])
  ],
  parent: document.getElementById('editor') as HTMLDivElement
});

// Changes editor's config when change decimal separator
inptSeparator.addEventListener('change', (e) => {
  const newDecimalSeparator = (e.target as HTMLTextAreaElement).value;
  setEditorOptions(editor, languageCompart, {
    idiom: inptIdiom.value as NonNullable<Toptions['idiom']>,
    decimalSeparator: newDecimalSeparator as NonNullable<
      Toptions['decimalSeparator']
    >
  });
});

// Set default autocompletion
setAutocompletionIdiom(editor, autocompleteCompart, defaultIdiom);

// Changes editor's config and autocompletion when idiom change
inptIdiom.addEventListener('change', (e) => {
  const newIdiom = (e.target as HTMLTextAreaElement).value;
  setEditorOptions(editor, languageCompart, {
    idiom: newIdiom as NonNullable<Toptions['idiom']>,
    decimalSeparator: inptSeparator.value as NonNullable<
      Toptions['decimalSeparator']
    >
  });
  setAutocompletionIdiom(
    editor,
    autocompleteCompart,
    newIdiom as NonNullable<Toptions['idiom']>
  );
});

// Format formula
btnPrettier.addEventListener('click', (e) => {
  codePrettier(editor, inptIndent.value);
});
