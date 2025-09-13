import BirthdayPageDisplay from '@/components/birthday-page-display';
import { getBirthdayData } from '@/lib/storage';
import { notFound } from 'next/navigation';

export default async function BirthdayPage({ params }: { params: { id: string } }) {
  const birthdayData = await getBirthdayData(params.id);

  if (!birthdayData) {
    notFound();
  }

  return <BirthdayPageDisplay data={birthdayData} />;
}
