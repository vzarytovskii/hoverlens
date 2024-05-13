import * as vscode from 'vscode'
import {
    changeLeadingSpacesToNonBreaking,
    removeEmptyLines,
    removeSpecialLines,
    toPlainText,
} from './formatting'

export type Decoration = {
    editor: vscode.TextEditor
    type: vscode.TextEditorDecorationType
    line: number
}

export const getDecorations = async (
    editor: vscode.TextEditor,
    selections: readonly vscode.Selection[]
) => {

    if (!selections.length) return []

    // We don't want to process > 1 selection, only show info about first symbol
    const selection = selections[0]

    const position = selection.active

    const hover =
        await vscode.commands.executeCommand<vscode.Hover[]>(
            'vscode.executeHoverProvider',
            editor.document.uri,
            position
        )

    const lines =
        hover
        .map(toPlainText)
        .map(removeSpecialLines)
        .map(removeEmptyLines)
        .join('\n')
        .split('\n')

    const firstVisibleLine = editor.visibleRanges[0].start.line
    const firstVisibleLineLength = editor.document.lineAt(firstVisibleLine).text.length

    const text = `Please, kill me, this is cursed`

    return [{ editor, type: createDecorationType(text, firstVisibleLineLength), line: firstVisibleLine } ]
}

const createDecorationType = (text: string, offset: number) => {
    const line_offset = `0 0 0 0`
    return vscode.window.createTextEditorDecorationType({
        border: "1px solid red",
        rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
        after: {
            margin: line_offset,
            border: "1px solid green",
            contentText: changeLeadingSpacesToNonBreaking(text + line_offset),
            color: new vscode.ThemeColor('editorCodeLens.foreground'),
        },
        isWholeLine: true,
    })
}
