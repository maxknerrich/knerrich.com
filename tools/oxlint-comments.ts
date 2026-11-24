type Comment = { value: string; loc: { start: { line: number } } };
type Context = {
  sourceCode: { getAllComments(): Comment[] };
  report(problem: { loc: { line: number; column: number }; message: string }): void;
};

const DIRECTIVE = /^\s*(?:oxlint-|eslint-|@ts-|prettier-ignore|\/\s*<reference)/;

export default {
  meta: { name: "comments" },
  rules: {
    "no-comments": {
      create(context: Context) {
        return {
          Program() {
            for (const comment of context.sourceCode.getAllComments()) {
              if (DIRECTIVE.test(comment.value)) continue;
              context.report({
                loc: { line: comment.loc.start.line, column: 0 },
                message: "No comments: name it, type it, test it, or put the reason in docs/.",
              });
            }
          },
        };
      },
    },
  },
};
