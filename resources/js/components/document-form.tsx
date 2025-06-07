import React, { useEffect } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { useState } from 'react'
import CKEditorComponent from './ckeditor'
import DocumentModal from './document-modal'
import { router, usePage } from '@inertiajs/react'
import { type SharedData } from '@/types'

interface DocumentFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ isOpen, onOpenChange }) => {
    const { auth } = usePage<SharedData>().props;
    const [memoDate, setMemoDate] = useState('')
    const [memoFor, setMemoFor] = useState('')
    const [memoThru, setMemoThru] = useState('')
    const [memoFrom, setMemoFrom] = useState('')
    const [memoSubject, setMemoSubject] = useState('')
    const [memoBody, setMemoBody] = useState('')
    const [previewOpen, setPreviewOpen] = useState(false)

    // Set memoFrom with user's full name when component mounts
    useEffect(() => {
        if (auth.user) {
            const fullName = `${auth.user.first_name} ${auth.user.middle_name} ${auth.user.last_name}${auth.user.suffix ? `, ${auth.user.suffix}` : ''}${auth.user.title ? `, ${auth.user.title}` : ''}`.trim();
            setMemoFrom(fullName);
        }
    }, [auth.user]);

    // Set default date to current date
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        setMemoDate(formattedDate);
    }, []);

    const previewRef = React.useRef<HTMLDivElement>(null);

    const handleCreateDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TODO: Implement document creation logic
        console.log('Creating document:', {
            memoDate,
            memoFor,
            memoThru,
            memoFrom,
            memoSubject,
            memoBody
        })
        router.visit('/documents')
    }

    // Add html2pdf.js via CDN when preview modal is open
    useEffect(() => {
        if (previewOpen) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [previewOpen]);

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleCreateDocument} className="bg-white rounded-lg shadow p-6">
                <div className="grid gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:flex-1">
                            <Label htmlFor="memoFor">For</Label>
                            <Input id="memoFor" value={memoFor} onChange={e => setMemoFor(e.target.value)} placeholder="e.g. MA. CARLA A. OCHOTORENA, RN, PhD" />
                        </div>
                        <div className="w-full sm:flex-1">
                            <Label htmlFor="memoThru">Thru</Label>
                            <Input id="memoThru" value={memoThru} onChange={e => setMemoThru(e.target.value)} placeholder="e.g. NURSIA M. BARJOSE, RN, DSN" />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:flex-1">
                            <Label htmlFor="memoFrom">From</Label>
                            <Input id="memoFrom" value={memoFrom} onChange={e => setMemoFrom(e.target.value)} placeholder="e.g. MARK L. FLORES, PhD" />
                        </div>
                        <div className="w-full sm:flex-1">
                            <Label htmlFor="memoDate">Date</Label>
                            <Input id="memoDate" type="date" value={memoDate} onChange={e => setMemoDate(e.target.value)} />
                        </div>
                    </div>
                    <div className="w-full">
                        <Label htmlFor="memoSubject">Subject</Label>
                        <Input id="memoSubject" value={memoSubject} onChange={e => setMemoSubject(e.target.value)} placeholder="e.g. RECOMMENDATION OF FACULTY MEMBERS TO HANDLE SUBJECTS" />
                    </div>
                    <div className="w-full">
                        <Label htmlFor="memoBody">Body/Content</Label>
                        <CKEditorComponent
                            value={memoBody}
                            onChange={setMemoBody}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
                        Preview
                    </Button>
                    <Button type="submit">Send Memo</Button>
                </div>
            </form>

            <DocumentModal
                previewOpen={previewOpen}
                setPreviewOpen={setPreviewOpen}
                previewRef={previewRef}
                memoDate={memoDate}
                memoFor={memoFor}
                memoThru={memoThru}
                memoFrom={memoFrom}
                memoSubject={memoSubject}
                memoBody={memoBody}
                onClose={() => setPreviewOpen(false)}
            />
        </div>
    )
}

export default DocumentForm
