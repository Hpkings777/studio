'use client';

import { useState } from 'react';
import type { Memory } from '@/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Send, MessageSquare } from 'lucide-react';

interface MemoryWallProps {
  memories: Memory[];
  showForm: boolean;
  onAddMemoryClick: () => void;
  onMemorySubmit: (author: string, message: string) => void;
  onCancel: () => void;
}

function MemoryForm({ onMemorySubmit, onCancel }: { onMemorySubmit: (author: string, message: string) => void; onCancel: () => void; }) {
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(author.trim() && message.trim()) {
            onMemorySubmit(author, message);
            setAuthor('');
            setMessage('');
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Leave a Message</CardTitle>
                <CardDescription>Share a happy memory or a birthday wish!</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <Input 
                        value={author} 
                        onChange={(e) => setAuthor(e.target.value)} 
                        placeholder="Your Name" 
                        required 
                    />
                    <Textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Your message..."
                        required
                    />
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">
                        <Send className="mr-2 h-4 w-4" />
                        Post Message
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}


export default function MemoryWall({ memories, showForm, onAddMemoryClick, onMemorySubmit, onCancel }: MemoryWallProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
        <h2 className="text-3xl font-headline text-center mb-6">Memory Wall</h2>
        {showForm ? (
            <MemoryForm onMemorySubmit={onMemorySubmit} onCancel={onCancel} />
        ) : (
            <div className="text-center mb-8">
                 <Button onClick={onAddMemoryClick}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Leave a Birthday Message
                </Button>
            </div>
        )}
      
        <div className="space-y-4 mt-8">
            {memories.length > 0 ? (
                 [...memories].reverse().map(memory => (
                    <Card key={memory.id} className="bg-card/80">
                        <CardContent className="p-4">
                            <p className="font-semibold">{memory.author} says:</p>
                            <p className="italic text-muted-foreground">"{memory.message}"</p>
                            <p className="text-xs text-right text-muted-foreground/50 mt-2">{new Date(memory.timestamp).toLocaleString()}</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                !showForm && <p className="text-center text-muted-foreground">Be the first to leave a message!</p>
            )}
        </div>
    </div>
  );
}
