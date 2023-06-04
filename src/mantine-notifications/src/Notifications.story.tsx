import React from 'react';
import { Button, Group } from '@mantine/core';
import { Notifications } from './Notifications';
import { showNotification } from './notifications.store';

export default { title: 'Notifications' };

export function Usage() {
  return (
    <div style={{ padding: 40 }}>
      <Notifications autoClose={false} />

      <Group>
        <Button onClick={() => showNotification({ message: 'Test', title: 'Test' })}>
          Show notification
        </Button>
      </Group>
    </div>
  );
}
