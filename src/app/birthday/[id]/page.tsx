import BirthdayPageDisplay from '@/components/birthday-page-display';
import BirthdayAfter from '@/components/birthday-after';
import BirthdayBefore from '@/components/birthday-before';
import { getBirthdayData } from '@/lib/storage';
import { notFound } from 'next/navigation';
import { isToday, isFuture, isPast, addDays } from 'date-fns';

export default async function BirthdayPage({ params }: { params: { id: string } }) {
  const birthdayData = await getBirthdayData(params.id);

  if (!birthdayData) {
    notFound();
  }

  const birthday = new Date(birthdayData.birthdayDate);
  const today = new Date();
  
  // To properly compare dates, we ignore the time part.
  const birthdayDay = new Date(birthday.getUTCFullYear(), birthday.getUTCMonth(), birthday.getUTCDate());
  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const isBirthdayToday = isToday(birthdayDay);
  const isBirthdayInTheFuture = isFuture(birthdayDay);
  const hasBirthdayPassed = isPast(addDays(birthdayDay, 1));

  if (hasBirthdayPassed) {
    return <BirthdayAfter name={birthdayData.name} />;
  }

  if (isBirthdayInTheFuture) {
    return <BirthdayBefore name={birthdayData.name} birthdayDate={birthdayData.birthdayDate} />;
  }
  
  // This will render if isBirthdayToday is true, or if it's the day right after the birthday.
  return <BirthdayPageDisplay data={birthdayData} />;
}
