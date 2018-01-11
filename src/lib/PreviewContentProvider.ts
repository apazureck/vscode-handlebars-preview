import {
  workspace,
  window,
  commands,
  TextDocumentContentProvider,
  Event,
  Uri,
  EventEmitter,
  Disposable
} from "vscode";
import { dirname } from "path";
import { existsSync, readFileSync } from "fs";
import renderContent from "./renderContent";
import * as vscode from 'vscode';
import * as path from 'path';
import { Settings } from '../settings';

const resolveFileOrText = fileName => {
  console.log(fileName, workspace.textDocuments.map(x => x.fileName));
  let document = workspace.textDocuments.find(e => e.fileName === fileName);

  if (document) {
    return document.getText();
  }
  if (dirname(fileName) && existsSync(fileName)) {
    return readFileSync(fileName, "utf8");
  }
};

export default class HtmlDocumentContentProvider
  implements TextDocumentContentProvider {
  private _onDidChange = new EventEmitter<Uri>();
  private _fileName: string;
  private _dataFileName: string;

  constructor(private context: vscode.ExtensionContext) {}

  public provideTextDocumentContent(uri: Uri): string {
    let templateSource;
    let dataSource;

    if (window.activeTextEditor && window.activeTextEditor.document) {
      let currentFileName = window.activeTextEditor.document.fileName;
      let dataFileName;
      let fileName;

      if (
        currentFileName === this._fileName ||
        currentFileName === this._dataFileName
      ) {
        // User swtiched editor to context, just use stored on
        fileName = this._fileName;
        dataFileName = this._dataFileName;
      } else {
        dataFileName = currentFileName + ".json";
        fileName = currentFileName;
      }

      this._fileName = fileName;
      this._dataFileName = dataFileName;
      templateSource = resolveFileOrText(fileName);
      dataSource = resolveFileOrText(dataFileName);
    }
    const body = renderContent(templateSource, dataSource);
    return `<!DOCTYPE html>
            <html>
            <head>
              <link rel="stylesheet" href="${this.getMediaPath(Settings.codeStyle)}.css">
            </head>
            <body>
                ${body}
            </body>
            </html>`;
  }

  get onDidChange(): Event<Uri> {
    return this._onDidChange.event;
  }

  public update(uri: Uri) {
    this._onDidChange.fire(uri);
  }

  private getMediaPath(mediaFile: string): string {
		return vscode.Uri.file(this.context.asAbsolutePath(path.join('styles', mediaFile))).toString();
}
}
