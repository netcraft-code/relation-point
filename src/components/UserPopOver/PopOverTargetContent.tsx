import { Avatar, Text } from "@mantine/core";
import classes from './PopOverTargetContent.module.css';
import { useAppSelector } from "@/store";

export default function PopOverTargetContent() {
  const { fullName, email } = useAppSelector((state) => state.auth.user);

  // default initials
  let initials = '';
  if (fullName) {
    const nameParts = fullName.split(' ');
    const firstInitial = nameParts[0]?.[0] || '';
    const lastInitial = nameParts[1]?.[0] || '';
    initials = firstInitial + lastInitial;
  }

  return (
    <div className={classes.contentWrapper}>
      <Avatar color={'blue'} radius={'lg'}>{initials || '?'}</Avatar>
      <div>
        <Text style={{ fontWeight: 'bold' }} size="md">
          {fullName || 'Unknown User'}
        </Text>
        <Text size="xs">
          {email || 'No email'}
        </Text>
      </div>
    </div>
  );
}
