import * as vscode from 'vscode';

export class Settings {
    private static get config(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration("handlebarsPreview");
    }
    static get language(): string {
        return Settings.config.get("language", "HTML");
    }

    static get codeStyle(): string {
        return Settings.config.get("codeHighlightOutputStyle", "vs");
    }
}