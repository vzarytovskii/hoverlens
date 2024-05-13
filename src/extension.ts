import * as vscode from 'vscode'
import { Decoration, getDecorations as getDecoration, getDecorations } from './decoration'
import { debounce } from './utils'
import { getDebounceUpdate, getEnabled } from './config'

let tokenSource: vscode.CancellationTokenSource | undefined
const startUpdate = () => {
    tokenSource = new vscode.CancellationTokenSource()
    return tokenSource.token
}
const cancelUpdate = () => tokenSource?.cancel()

let currentDecorations: Decoration[] = []

const setDecorations = (decorations: Decoration[]) => {
    for (const { type } of currentDecorations) {
        type.dispose()
    }

    currentDecorations = decorations

    for (const { editor, type, line } of currentDecorations) {
        editor.setDecorations(type, [new vscode.Selection(line, 0, line, 0)])
    }
}

const updateDecorations = debounce(
    async (event: vscode.TextEditorSelectionChangeEvent) => {
        if (!getEnabled()) return

        const token = startUpdate()
        const selections = event.selections

        const decorations = await getDecorations(
            event.textEditor,
            selections
        )

        if (token.isCancellationRequested) return

        setDecorations(decorations)
    },
    getDebounceUpdate
)

export const activate = (context: vscode.ExtensionContext) => {
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(() => {
            if (getEnabled()) return
            cancelUpdate()
            setDecorations([])
        })
    )

    context.subscriptions.push(
        vscode.window.onDidChangeTextEditorSelection((event) => {
            cancelUpdate()
            updateDecorations(event)
        })
    )

    // TODO: update (scroll) current decorations on viewport changes
}
