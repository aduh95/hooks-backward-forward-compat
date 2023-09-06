let port;
export function globalPreload(data) {
  port = data.port;
  port.postMessage({ type: "globalPreload" });
  return `\
  globalThis.getPortFromLoader(port)
    `;
}

export function initialize(data) {
  if (data == null) {
    // Legacy --loader flag was used, ignore
    return;
  }
  port = data.port;
  port.postMessage({ type: "initialize" });
}

export function resolve(referrer, context, next) {
  if (port == null) {
    // Legacy --loader flag was used, ignore
    return next(referrer, context);
  }
  port.postMessage({ type: "resolve", referrer, url: import.meta.url });
  return next(referrer, context);
}

export function load(url, context, next) {
  if (port == null) {
    // Legacy --loader flag was used, ignore
    return next(url, context);
  }
  port.postMessage({ type: "load", url, url: import.meta.url });
  return next(url, context);
}
