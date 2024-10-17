import { createContext } from "react";

type InboxConfigType = {
    inboxes: any[],
    setInboxes?: (inboxes: any[]) => void
}

type ActiveInboxConfigType = {
    inbox: any,
    setInbox?: (inbox: any) => void
}


export const InboxContext = createContext<InboxConfigType>({ inboxes: [] });
export const ActiveInboxContext = createContext<ActiveInboxConfigType>({ inbox: undefined });