import BirthdayPageDisplay from '@/components/birthday-page-display';
import BirthdayAfter from '@/components/birthday-after';
import BirthdayBefore from '@/components/birthday-before';
import { getBirthdayData } from '@/lib/storage';
import { notFound } from 'next/navigation';
import { isToday, isFuture, isPast, addDays, startOfDay } from 'date-fns';

export default async function BirthdayPage({ params }: { params: { id: string } }) {
  const birthdayData = await getBirthdayData(params.id);

  if (!birthdayData) {
    notFound();
  }

  const birthdayDay = startOfDay(new Date(birthdayData.birthdayDate));

  const isBirthdayToday = isToday(birthdayDay);
  const isBirthdayInTheFuture = isFuture(birthdayDay);
  // Expire the page one day after the birthday
  const hasBirthdayPassed = isPast(addDays(birthdayDay, 1));

  if (hasBirthdayPassed) {
    return <BirthdayAfter name={birthdayData.name} />;
  }

  if (isBirthdayInTheFuture) {
    return <BirthdayBefore name={birthdayData.name} birthdayDate={birthdayData.birthdayDate} />;
  }
  
  // Only show the main page if it's today or in the future but not yet passed the 1 day grace period
  return <BirthdayPageDisplay data={birthdayData} />;
}
