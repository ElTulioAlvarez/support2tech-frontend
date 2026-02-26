type Handler = () => void;

const handlers = new Set<Handler>();

export const authEvents = {
  onUnauthorized(handler: Handler) {
    handlers.add(handler);
    return () => handlers.delete(handler);
  },
  emitUnauthorized() {
    for (const h of handlers) h();
  },
};