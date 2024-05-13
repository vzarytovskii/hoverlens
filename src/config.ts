import * as vscode from 'vscode'

export const getEnabled = () =>
    vscode.workspace.getConfiguration('cornerlens').get('enabled', true)

export const getDebounceUpdate = () =>
    vscode.workspace.getConfiguration('cornerlens').get('debounceUpdate', 50)

export const getMaxShift = () =>
    vscode.workspace.getConfiguration('cornerlens').get('maximumShiftCount', 20)
