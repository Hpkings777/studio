import BirthdayPageDisplay from '@/components/birthday-page-display';

export default function BirthdayPage({ params }: { params: { id: string } }) {
  return <BirthdayPageDisplay id={params.id} />;
}
