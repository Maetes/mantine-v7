import React, { forwardRef, useRef, useEffect } from 'react';
import { Notification, NotificationProps } from '@mantine/core';
import { NotificationData } from './notifications.store';
import { getAutoClose } from './get-auto-close/get-auto-close';

interface NotificationContainerProps extends NotificationProps {
  data: NotificationData;
  onHide(id: string): void;
  autoClose: number | false;
}

export const NotificationContainer = forwardRef<HTMLDivElement, NotificationContainerProps>(
  ({ data, onHide, autoClose, ...others }, ref) => {
    const { autoClose: _autoClose, message, ...notificationProps } = data;
    const autoCloseDuration = getAutoClose(autoClose, data.autoClose);
    const autoCloseTimeout = useRef<number>();

    const cancelAutoClose = () => window.clearTimeout(autoCloseTimeout.current);

    const handleHide = () => {
      onHide(data.id!);
      cancelAutoClose();
    };

    const handleAutoClose = () => {
      if (typeof autoCloseDuration === 'number') {
        autoCloseTimeout.current = window.setTimeout(handleHide, autoCloseDuration);
      }
    };

    useEffect(() => {
      data.onOpen?.(data);
      handleAutoClose();
      return cancelAutoClose;
    }, []);

    return (
      <Notification
        {...others}
        {...notificationProps}
        onClose={handleHide}
        ref={ref}
        onMouseEnter={cancelAutoClose}
        onMouseLeave={handleAutoClose}
      >
        {message}
      </Notification>
    );
  }
);

NotificationContainer.displayName = '@mantine/notifications/NotificationContainer';
