// An oxlint plugin for this site's StyleX styles, loaded through `lint.jsPlugins`
// in vite.config.ts. Token files (*.stylex.ts) define the values, so they are skipped.
//
// `styles/no-raw-values`: styles use the design tokens from
// src/lib/styles/tokens.stylex.ts. It reports, inside stylex.create(),
// keyframes() and viewTransitionClass():
//   - `var(--…)` strings: import the token, so a typo is a type error;
//   - colors (hex, rgb(), color-mix(), light-dark(), …): add a color token;
//   - raw font sizes, font families, durations, radii and spacing (margins,
//     padding, gaps): use the scale.
//
// `styles/when-inside-create`: `stylex.when.*()` is only compiled inside
// stylex.create(). Kept in a constant elsewhere, it stays a runtime call and
// throws ("Unexpected 'stylex.when.ancestor' call at runtime").

type Node = { type: string; parent?: Node; [key: string]: unknown };
type Context = { filename: string; report(problem: { node: Node; message: string }): void };

const STYLEX_CALLS = new Set(["create", "keyframes", "viewTransitionClass"]);
const COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix|light-dark)\(/i;
const LENGTH = /\d(?:px|rem|em)\b/;
const SCALES: Record<string, string> = {
  fontSize: "text",
  fontFamily: "font",
  transitionDuration: "motion",
  animationDuration: "motion",
  borderRadius: "radius",
};
const SPACING = /^(?:margin|padding|gap$|rowGap$|columnGap$)/;
/** Values that are fine for any property: keywords and zero. */
const NEUTRAL = /^(?:0|auto|inherit|initial|unset|none|50%)$/;

/** Whether `node` is a call to `stylex.<one of names>(…)`. */
const isStylexCall = (node: Node, names = STYLEX_CALLS) => {
  if (node.type !== "CallExpression") return false;
  const callee = node.callee as Node;
  const object = callee.object as Node | undefined;
  const property = callee.property as Node | undefined;
  return (
    callee.type === "MemberExpression" &&
    object?.name === "stylex" &&
    names.has(String(property?.name))
  );
};

/** Whether `node` is a call like `stylex.when.ancestor(…)`. */
const isWhenCall = (node: Node) => {
  const callee = node.callee as Node;
  const object = callee.object as Node | undefined;
  return (
    callee.type === "MemberExpression" &&
    object?.type === "MemberExpression" &&
    (object.object as Node).name === "stylex" &&
    (object.property as Node).name === "when"
  );
};

/** A property's name, unless its key is computed (a condition like `[media.phone]` or a variable). */
function keyName(property: Node) {
  const key = property.key as Node;
  if (property.computed && key.type !== "Literal") return undefined;
  const name = key.type === "Identifier" ? key.name : key.value;
  return typeof name === "string" ? name : undefined;
}

/** The CSS property a value belongs to, looking past condition keys like `default`, `":hover"` and `[media.phone]`. */
function propertyOf(value: Node): string | undefined {
  let node: Node | undefined = value.parent;
  while (node?.type === "Property") {
    const name = keyName(node);
    const isCondition = name === undefined || name === "default" || /^[:@]/.test(name);
    if (!isCondition) return name;
    node = node.parent?.parent;
  }
  return undefined;
}

function insideStylexCall(node: Node, names = STYLEX_CALLS) {
  for (let current = node.parent; current; current = current.parent) {
    if (isStylexCall(current, names)) return true;
  }
  return false;
}

function check(context: Context, node: Node, value: string, property: string | undefined) {
  if (value.includes("var(--")) {
    context.report({ node, message: `Use the token import instead of "${value}".` });
  } else if (COLOR.test(value)) {
    context.report({
      node,
      message: `Raw color "${value}": add a color token to tokens.stylex.ts.`,
    });
  } else if (property && property in SCALES && !NEUTRAL.test(value)) {
    context.report({
      node,
      message: `Raw ${property} "${value}": use a \`${SCALES[property]}\` token from tokens.stylex.ts.`,
    });
  } else if (
    property &&
    SPACING.test(property) &&
    !NEUTRAL.test(value) &&
    (LENGTH.test(value) || /^-?[\d.]+$/.test(value))
  ) {
    context.report({
      node,
      message: `Raw ${property} "${value}": use a \`space\` token from tokens.stylex.ts.`,
    });
  }
}

export default {
  meta: { name: "styles" },
  rules: {
    "no-raw-values": {
      create(context: Context) {
        if (context.filename.endsWith(".stylex.ts")) return {};
        return {
          Literal(node: Node) {
            if (typeof node.value !== "string" && typeof node.value !== "number") return;
            if (node.parent?.type !== "Property" || node.parent.value !== node) return;
            if (!insideStylexCall(node)) return;
            check(context, node, String(node.value), propertyOf(node));
          },
          TemplateLiteral(node: Node) {
            if (node.parent?.type !== "Property" || !insideStylexCall(node)) return;
            // Interpolated tokens are fine; only the literal parts are checked.
            const quasis = node.quasis as { value: { cooked: string } }[];
            const literal = quasis.map((quasi) => quasi.value.cooked).join("");
            const property = propertyOf(node);
            if ((node.expressions as unknown[]).length === 0)
              check(context, node, literal, property);
            else if (literal.includes("var(--") || COLOR.test(literal))
              check(context, node, literal, undefined);
            else if (property && SPACING.test(property) && LENGTH.test(literal))
              check(context, node, literal, property);
          },
        };
      },
    },
    "when-inside-create": {
      create(context: Context) {
        const create = new Set(["create"]);
        return {
          CallExpression(node: Node) {
            if (!isWhenCall(node) || insideStylexCall(node, create)) return;
            context.report({
              node,
              message:
                "stylex.when.*() only compiles inside stylex.create(); write it in the condition key there.",
            });
          },
        };
      },
    },
  },
};
