let port;
console.log("loader loading");
export function globalPreload(data) {
  port = data.port;
  return `\
  globalThis.getPortFromLoader(port)
    `;
}

export function initialize(data) {
  port ??= data?.port;
}

export function resolve(referrer, context, next) {
  port?.postMessage({ referrer });
  return next(referrer, context);
}
