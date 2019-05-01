import { notification } from 'antd';

export const openNotification = (type: string, title: string, description: string) => {
  notification.success({
    message: title,
    description: description
  });
};
