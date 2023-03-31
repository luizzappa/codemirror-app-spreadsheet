import { EditorView } from '@codemirror/view';
import { ensureSyntaxTree } from '@codemirror/language';

/**
 * Improve function visualization by adding indentation
 * @param editor the EditorView
 * @param indentSize number of indent spaces
 * @returns
 */
export function codePrettier(
  editor: EditorView,
  indentSize: number | string
): void {
  // Just remove current whitespaces and line breakes
  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: editor.state.doc.toString().replace(/(?:\r\n|\r|\n)/g, '')
    }
  });

  const currDoc = editor.state.doc.toString();

  // Get node tree
  const tree = ensureSyntaxTree(editor.state, currDoc.length, 5000);

  if (!tree) return;

  // Nodes that will be indent/dedent
  const indentNodes = ['Function', 'Argument', 'OpenParen', 'CloseParen'],
    indentIncrease = ['Function'],
    indentDecrease = ['CloseParen'],
    nodes: { from: number; to: number; indent: number }[] = []; // Stores node position and indentation value for later processing

  let indentDepth = 0; // Stores indent level
  tree.iterate({
    enter: ({ name, from, to }) => {
      if (indentNodes.indexOf(name) === -1) return;
      if (indentDecrease.indexOf(name) !== -1) indentDepth--;
      nodes.push({
        from,
        to,
        indent: +indentSize * indentDepth
      });
      if (indentIncrease.indexOf(name) !== -1) indentDepth++;
    }
  });

  let formattedDoc = '';
  for (let idx = 0; idx < nodes.length; idx++) {
    const currNode = nodes[idx],
      nextNode = nodes[idx + 1];

    formattedDoc =
      formattedDoc +
      ' '.repeat(currNode.indent) +
      currDoc.substring(
        idx === 0 ? 0 : currNode.from,
        nextNode?.from ?? currNode.to
      ) +
      (nextNode?.indent > 0 || currNode.indent > 0 ? '\n' : '');
  }

  // Remove empty lines
  formattedDoc = (formattedDoc === '' ? currDoc : formattedDoc).replace(
    /^\s*[\r\n]/gm,
    ''
  );

  editor.dispatch({
    changes: {
      from: 0,
      to: editor.state.doc.length,
      insert: formattedDoc
    }
  });
}
