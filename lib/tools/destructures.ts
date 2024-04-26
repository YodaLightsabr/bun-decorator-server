export const destructures = (fn: Function) => fn.toString().substring(
    fn.toString().indexOf("{") + 2,
    fn.toString().indexOf("}") - 1
).split(", ");
