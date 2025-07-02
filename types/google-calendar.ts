// Types para attendees
export type TResponseStatus =
  | "accepted"
  | "declined"
  | "tentative"
  | "needsAction";

export type TAttendee = {
  email: string;
  displayName?: string;
  responseStatus?: TResponseStatus;
  self?: boolean;
};

// Types para usuários (creator / organizer)
export type TUser = {
  email: string;
  displayName?: string;
  self?: boolean;
};

// Types para start/end
export type TDateTime = {
  date?: string; // Date only (YYYY-MM-DD)
  dateTime?: string; // ISO string
  timeZone?: string;
};

// Types para reminders
export type TReminders = {
  useDefault: boolean;
};

// Types para cor opcional
export type TEventColor = {
  background: string;
  foreground: string;
};

// Type principal do evento
export type TCalendarEvent = {
  id: string;
  kind: string;
  status: string;
  htmlLink: string;
  summary?: string;
  description?: string;
  location?: string;
  start: TDateTime;
  end: TDateTime;
  created: string;
  updated: string;
  creator: TUser;
  organizer: TUser;
  attendees?: TAttendee[];
  reminders?: TReminders;
  visibility?: string;
  sequence?: number;
  eventType?: string;
  guestsCanInviteOthers?: boolean;
  iCalUID?: string;
  etag?: string;
  transparency?: string;
  privateCopy?: boolean;
  _color?: TEventColor;
};
