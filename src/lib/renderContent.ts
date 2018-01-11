import * as Handlebars from "handlebars";
import { Settings } from "../settings";
import * as hljs from "highlight.js";
import * as MarkdownIt from "markdown-it";
import * as mdihjs from "markdown-it-highlightjs";
const md = MarkdownIt();
md.use(mdihjs);

export default (templateSource: string, dataSource: string): string => {
  if (!templateSource) {
    return "<body>Select document to render</body>";
  }

  try {
    let data = JSON.parse(dataSource || "{}");
    let template = Handlebars.compile(templateSource);
    if (Settings.language === "HTML") {
      return template(data);
    } else {
      return md.render(
        "```" + Settings.language + "\n" + template(data) + "\n```"
      );
    }
  } catch (ex) {
    return `
            <body>
                <h2>Error occured</h2>
                <pre>${ex}</pre>
            </body>
        `;
  }
};
