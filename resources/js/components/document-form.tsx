import React, { useEffect } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { useState } from 'react'
import CKEditorComponent from './ckeditor'
import DocumentModal from './document-modal'
import { router } from '@inertiajs/react'

interface DocumentFormProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const DocumentForm: React.FC<DocumentFormProps> = ({ isOpen, onOpenChange }) => {
    const [memoNumber, setMemoNumber] = useState('')
    const [memoDate, setMemoDate] = useState('')
    const [memoFor, setMemoFor] = useState('')
    const [memoThru, setMemoThru] = useState('')
    const [memoFrom, setMemoFrom] = useState('')
    const [memoRecipient, setMemoRecipient] = useState('')
    const [memoSubject, setMemoSubject] = useState('')
    const [memoBody, setMemoBody] = useState('')
    const [previewOpen, setPreviewOpen] = useState(false)

    const previewRef = React.useRef<HTMLDivElement>(null);

    const handleCreateDocument = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // TODO: Implement document creation logic
        console.log('Creating document:', {
            memoNumber,
            memoDate,
            memoFor,
            memoThru,
            memoFrom,
            memoRecipient,
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
                            <Label htmlFor="memoNumber">Memo No.</Label>
                            <Input id="memoNumber" value={memoNumber} onChange={e => setMemoNumber(e.target.value)} placeholder="e.g. 0118" />
                        </div>
                        <div className="w-full sm:flex-1">
                            <Label htmlFor="memoDate">Date</Label>
                            <Input id="memoDate" type="date" value={memoDate} onChange={e => setMemoDate(e.target.value)} />
                        </div>
                    </div>
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
                            <Label htmlFor="memoRecipient">Recipient</Label>
                            <Select value={memoRecipient} onValueChange={setMemoRecipient}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select recipient" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user1">User 1</SelectItem>
                                    <SelectItem value="user2">User 2</SelectItem>
                                    <SelectItem value="user3">User 3</SelectItem>
                                </SelectContent>
                            </Select>
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
                memoNumber={memoNumber}
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
