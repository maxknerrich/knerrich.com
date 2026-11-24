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
const NEUTRAL = /^(?:0|auto|inherit|initial|unset|none|50%)$/;

const isStylexCall = (node: Node) => {
  if (node.type !== "CallExpression") return false;
  const callee = node.callee as Node;
  const object = callee.object as Node | undefined;
  const property = callee.property as Node | undefined;
  return (
    callee.type === "MemberExpression" &&
    object?.name === "stylex" &&
    STYLEX_CALLS.has(String(property?.name))
  );
};

function keyName(property: Node) {
  const key = property.key as Node;
  if (property.computed && key.type !== "Literal") return undefined;
  const name = key.type === "Identifier" ? key.name : key.value;
  return typeof name === "string" ? name : undefined;
}

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

function insideStylexCall(node: Node) {
  for (let current = node.parent; current; current = current.parent) {
    if (isStylexCall(current)) return true;
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
  },
};
