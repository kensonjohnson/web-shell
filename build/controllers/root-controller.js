export function helloController(_, res) {
    res.json({ serverMessage: getHello() });
}
export function getHello() {
    return "Hello World!";
}
