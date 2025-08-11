'use client';

import type { BirthdayData } from '@/types';

const BIRTHDAY_BLISS_PREFIX = 'birthday-bliss-';

export function saveBirthdayData(data: BirthdayData): void {
  try {
    const key = `${BIRTHDAY_BLISS_PREFIX}${data.id}`;
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
  } catch (error) {
    console.error('Failed to save birthday data to localStorage', error);
  }
}

export function getBirthdayData(id: string): BirthdayData | null {
  try {
    const key = `${BIRTHDAY_BLISS_PREFIX}${id}`;
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return null;
    }
    return JSON.parse(serializedData) as BirthdayData;
  } catch (error) {
    console.error('Failed to retrieve birthday data from localStorage', error);
    return null;
  }
}
