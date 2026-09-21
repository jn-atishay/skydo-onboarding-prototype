import log from "./logger";
import { create, zustandDevtools } from "./index";

const TOAST_TIMER = 5000;

type ID = string | number;

export type Message = {
  type: string;
  header?: string;
  body?: string;
  id: ID;
  time?: number;
  customClass?: string;
};

interface ToastMessagesStore {
  messages: { [key: ID]: Message };
  addToast: (message: Message) => void;
  removeToast: (id: ID) => void;
}

const useToastMessages = create<ToastMessagesStore>()(
  zustandDevtools(
    log((set: any, get: any) => ({
      messages: {},
      addToast: (message: Message) => {
        set((state: any) => {
          return { ...state, messages: { ...state.messages, [message.id]: message } };
        });
        setTimeout(() => {
          get().removeToast(message.id);
        }, message.time || TOAST_TIMER);
      },
      removeToast: (id: ID) => {
        set((state: any) => {
          const messages = get().messages;
          delete messages[id];
          return { ...state, messages: { ...messages } };
        });
      },
    }))
  )
);

export default useToastMessages;
