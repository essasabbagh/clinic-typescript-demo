export interface IPushNotification {
  token: string;
  notification: {
    title: string;
    body: string;
  };
}
export interface INotificationPayload {
  data: object;
  notification: {
    title: string;
    body: string;
  };
}

// const payload = {
//   'notification': {
//     'title': `${toTitleCase(name)} just logged an event`,
//     'body': `${events[eventType]} for ${toTitleCase(petName)}`,
//   },
//   // NOTE: The 'data' object is inside payload, not inside notification
//   'data': {
//         'personSent': userSent
//   }
// };
