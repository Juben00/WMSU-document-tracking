import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Search, Inbox, Send } from 'lucide-react';
import { Modal } from '@mantine/core';
import DocumentForm from '@/components/document-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
    id: number;
    title: string;
    description: string;
    sender: string;
    date: string;
    status: 'pending' | 'approved' | 'rejected';
    type: 'received' | 'sent';
}

// @ts-ignore
declare global {
    interface Window {
        html2pdf?: any;
    }
}

// Minimal error boundary for Lexical
function LexicalErrorBoundary(props: { children: React.ReactNode; error?: Error }) {
    if (props.error) {
        return <div className="text-red-500">Editor error: {props.error.message}</div>;
    }
    return <>{props.children}</>;
}

// TinyMCE file picker callback types
type FilePickerCallback = (cb: (url: string, meta?: any) => void, value: string, meta: any) => void;

const Documents = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('received');
    const [memoNumber, setMemoNumber] = useState('');
    const [memoDate, setMemoDate] = useState(new Date().toISOString().slice(0, 10));
    const [memoFor, setMemoFor] = useState('');
    const [memoThru, setMemoThru] = useState('');
    const [memoFrom, setMemoFrom] = useState('');
    const [memoSubject, setMemoSubject] = useState('');
    const [memoBody, setMemoBody] = useState('');
    const [memoRecipient, setMemoRecipient] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);


    const previewRef = React.useRef<HTMLDivElement>(null);
    const editorRef = useRef<HTMLDivElement>(null);

    // Mock data - replace with actual API call
    const documents: Document[] = [
        {
            id: 1,
            title: 'Leave Request',
            description: 'Annual leave request for next month',
            sender: 'John Doe',
            date: '2024-03-15',
            status: 'pending',
            type: 'received'
        },
        {
            id: 2,
            title: 'Project Proposal',
            description: 'New project proposal for Q2',
            sender: 'Jane Smith',
            date: '2024-03-14',
            status: 'approved',
            type: 'sent'
        },
    ];

    const handleCreateDocument = (e: React.FormEvent) => {
        e.preventDefault();
        // Add your document creation logic here
        setIsCreateModalOpen(false);
    };

    const filteredDocuments = documents.filter(doc =>
        (doc.type === activeTab) &&
        (doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );



    // Toolbar actions
    const format = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        // Update memoBody after formatting
        if (editorRef.current) setMemoBody(editorRef.current.innerHTML);
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Documents</h1>
                    <Button onClick={() => router.visit('/documents/create')}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Document
                    </Button>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <Tabs defaultValue="received" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="received" className="flex items-center gap-2">
                            <Inbox className="h-4 w-4" />
                            Received Documents
                        </TabsTrigger>
                        <TabsTrigger value="sent" className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Sent Documents
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="received">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDocuments.map((doc) => (
                                <Card key={doc.id}>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                            <CardTitle>{doc.title}</CardTitle>
                                        </div>
                                        <CardDescription>From: {doc.sender}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">{doc.description}</p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Date: {doc.date}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="sent">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredDocuments.map((doc) => (
                                <Card key={doc.id}>
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-gray-500" />
                                            <CardTitle>{doc.title}</CardTitle>
                                        </div>
                                        <CardDescription>To: {doc.sender}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">{doc.description}</p>
                                        <div className="mt-2 text-sm text-gray-500">
                                            Date: {doc.date}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
};

export default Documents;
