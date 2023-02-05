import { Request } from 'express';
import { MessagingDevicesResponse, MessagingPayload, Message } from 'firebase-admin/messaging';
import firebaseAdmin from '../firebase';
import AppError from '../errors';

const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};

export default class NotificationService {
  static async send(req: Request): Promise<String> {
    const { topicName, title, body, icon, color } = req.body;
    if (!(title && body)) throw new AppError(400, 'All input is required');

    const payload: Message = {
      notification: {
        title: title,
        body: body,
      },
      android: {
        restrictedPackageName: 'com.oxygendevs.my_fatura', // ()
        notification: {
          icon: icon ?? 'stock_ticker_update',
          color: color ?? '#7e55c3',
          imageUrl: 'https://foo.bar.pizza-monster.png',
          clickAction: 'news_intent',
        },
      },
      // apns: {
      //   payload: {
      //     aps: {
      //       mutableContent: true,
      //       category: 'INVITE_CATEGORY',
      //     },
      //   },
      //   fcmOptions: {
      //     imageUrl: 'https://foo.bar.pizza-monster.png',
      //   },
      // },
      // fcmOptions: FcmOptions(),
      // {
      //   // priority: string;
      //   // timeToLive: number;
      //   timeToLive: 60 * 60,
      //   priority: 'high',
      // },
      // condition: '',
      data: {
        key: 'value',
      },

      topic: topicName ?? 'industry-tech',
    };
    var topicPayload: MessagingPayload = {
      data: {
        message: 'data',
      },
      notification: {
        title: title,
        body: body,
      },
    };
    // await firebaseAdmin.message.sendToTopic(topicName, topicPayload);
    // return message id
    return firebaseAdmin.message.send(payload);
    // return '';
  }

  static async sendToDevice(req: Request): Promise<MessagingDevicesResponse> {
    const options = notification_options;
    const { registrationToken, message, title, body } = req.body;
    if (!(registrationToken && message && title && body)) throw new AppError(400, 'All input is required');

    var payload: MessagingPayload = {
      data: {
        message,
      },
      notification: {
        title: title,
        body: body,
      },
    };

    return firebaseAdmin.message.sendToDevice(registrationToken, payload, options);
  }
}
