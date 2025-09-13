import { db } from './firebase';
import { collection, doc, setDoc, getDoc, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import type { BirthdayData, Memory, MemoryData } from '@/types';

const BIRTHDAYS_COLLECTION = 'birthdays';
const MEMORIES_COLLECTION = 'memories';

export async function saveBirthdayData(data: Omit<BirthdayData, 'id'>): Promise<string> {
  try {
    const newDocRef = doc(collection(db, BIRTHDAYS_COLLECTION));
    const birthdayDataWithTimestamp = {
      ...data,
      birthdayDate: Timestamp.fromDate(new Date(data.birthdayDate)),
    }
    await setDoc(newDocRef, birthdayDataWithTimestamp);
    return newDocRef.id;
  } catch (error) {
    console.error('Failed to save birthday data to Firestore', error);
    throw new Error('Could not save birthday data.');
  }
}

export async function getBirthdayData(id: string): Promise<BirthdayData | null> {
  try {
    const docRef = doc(db, BIRTHDAYS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const birthdayDate = (data.birthdayDate as Timestamp).toDate().toISOString();
      return { ...data, id: docSnap.id, birthdayDate } as BirthdayData;
    } else {
      console.log('No such document!');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve birthday data from Firestore', error);
    return null;
  }
}

export async function getMemories(birthdayId: string): Promise<Memory[]> {
  try {
    const memoriesColRef = collection(db, BIRTHDAYS_COLLECTION, birthdayId, MEMORIES_COLLECTION);
    const querySnapshot = await getDocs(memoriesColRef);
    const memories = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const timestamp = (data.timestamp as Timestamp).toDate().toISOString();
        return { ...data, id: doc.id, timestamp } as Memory;
    });
    return memories.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  } catch (error) {
    console.error('Failed to retrieve memories from Firestore', error);
    return [];
  }
}

export async function saveMemory(birthdayId: string, memoryData: { author: string; message: string }): Promise<Memory> {
  try {
    const memoriesColRef = collection(db, BIRTHDAYS_COLLECTION, birthdayId, MEMORIES_COLLECTION);
    const memoryDataWithTimestamp: MemoryData = {
        ...memoryData,
        timestamp: Timestamp.now(),
    }
    const docRef = await addDoc(memoriesColRef, memoryDataWithTimestamp);

    const newMemory: Memory = {
        id: docRef.id,
        author: memoryData.author,
        message: memoryData.message,
        timestamp: (memoryDataWithTimestamp.timestamp as Timestamp).toDate().toISOString(),
    }
    return newMemory;

  } catch (error) {
    console.error('Failed to save memory to Firestore', error);
    throw new Error('Could not save memory.');
  }
}
