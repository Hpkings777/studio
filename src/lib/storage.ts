'use client';

import type { BirthdayData, Memory } from '@/types';

const BIRTHDAY_BLISS_PREFIX = 'birthday-bliss-';
const MEMORIES_PREFIX = 'birthday-memories-';


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

export function getMemories(birthdayId: string): Memory[] {
    try {
        const key = `${MEMORIES_PREFIX}${birthdayId}`;
        const serializedData = localStorage.getItem(key);
        if(serializedData === null) {
            return [];
        }
        return JSON.parse(serializedData) as Memory[];
    } catch(error) {
        console.error('Failed to retrieve memories from localStorage', error);
        return [];
    }
}

export function saveMemory(birthdayId: string, memoryData: { author: string; message: string }): Memory {
    const memories = getMemories(birthdayId);
    const newMemory: Memory = {
        id: crypto.randomUUID(),
        author: memoryData.author,
        message: memoryData.message,
        timestamp: new Date().toISOString(),
    };
    const updatedMemories = [...memories, newMemory];
    
    try {
        const key = `${MEMORIES_PREFIX}${birthdayId}`;
        localStorage.setItem(key, JSON.stringify(updatedMemories));
    } catch (error) {
        console.error('Failed to save memory to localStorage', error);
    }
    return newMemory;
}
