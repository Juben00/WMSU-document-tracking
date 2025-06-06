import React, { useEffect } from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { DialogFooter } from './ui/dialog'
import { useState } from 'react'
import CKEditorComponent from './ckeditor'
import { Modal } from '@mantine/core'

const DocumentForm = () => {
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
        <>

            <DialogContent className="sm:max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>Create New Document</DialogTitle>
                    <DialogDescription>
                        Fill in the memo details below.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateDocument}>
                    <div className="grid gap-4 py-4">
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
                    <DialogFooter className="flex flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)} className="w-full sm:w-auto">
                            Preview
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Send Memo</Button>
                    </DialogFooter>
                </form>
            </DialogContent>

            <Modal
                opened={previewOpen}
                onClose={() => setPreviewOpen(false)}
                title="Memo Preview"
                size="xl"
                centered
                closeOnClickOutside={false}
                closeOnEscape={false}
            >
                <div id="memo-preview-content" ref={previewRef} className="bg-white rounded shadow flex w-full max-w-4xl mx-auto print:max-w-none print:rounded-none print:shadow-none">
                    {/* Sidebar */}
                    <div className="w-64 bg-gray-100 border-r p-4 flex flex-col items-center text-xs print:w-64">
                        <div className="font-bold text-center mb-2">WMSU Vision</div>
                        <div className="mb-4 text-justify">
                            By 2040, WMSU is a Smart Research University generating competent professionals and global citizens engendered by the knowledge from sciences and liberal education, empowering communities, promoting peace, harmony, and cultural diversity.
                        </div>
                        <div className="font-bold text-center mb-2">WMSU Mission</div>
                        <div className="mb-4 text-justify">
                            WMSU commits to create a vibrant atmosphere of learning where science, technology, innovation, research, the arts and humanities, and management flourish, and produce world-class professionals committed to sustainable development and peace.
                        </div>
                        <div className="font-bold text-center mb-2">College of Computing Studies (CCS) Goals</div>
                        <div className="mb-4 text-justify">
                            The college aspires to provide world-class education in the field of Information and Communications Technology with the following goals:
                            <ul className="list-disc ml-4 mt-1">
                                <li>Produce quality graduates who are technically competent, environmentally proactive, and gender responsive.</li>
                                <li>Achieve the highest level of accreditation and become a center of development/excellence anchored on outcomes-based education.</li>
                                <li>Establish and sustain partnerships with relevant industries and communities as an outlet for research, development, and extension.</li>
                            </ul>
                        </div>
                        <div className="font-bold text-center mb-2">College of Computing Studies (CCS) Core Values</div>
                        <div className="mb-4 text-justify">
                            <ul className="list-disc ml-4 mt-1">
                                <li>Creativity</li>
                                <li>Self-Reliance</li>
                                <li>Integrity</li>
                                <li>Teamwork</li>
                            </ul>
                        </div>
                    </div>
                    {/* Main Memo Content */}
                    <div className="flex-1 p-8">
                        <div className="flex items-center justify-between mb-2">
                            {/* Placeholder for CCS logo */}
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                <img src="/images/wmsu.png" alt="WMSU Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center flex-1">
                                <div className="font-bold text-base">Republic of the Philippines</div>
                                <div className="font-bold text-base">Western Mindanao State University</div>
                                <div className="font-bold text-base">COLLEGE OF COMPUTING STUDIES</div>
                                <div className="text-xs">Zamboanga City</div>
                                <div className="text-xs">Email: ics@wmsu.edu.ph</div>
                            </div>
                            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                                <img src="/images/wmsu.png" alt="CCS Logo" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <div className="border-b-2 border-black my-2" />
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-bold">MEMORANDUM ORDER NO. <span className="underline">{memoNumber || '_____'}</span></div>
                            <div className="font-bold">{memoDate || '_____'}</div>
                        </div>
                        <div className="mb-2"><b>Series of 2025</b></div>
                        <div className="mb-2"><b>For:</b> {memoFor || '_____'}</div>
                        <div className="mb-2"><b>Thru:</b> {memoThru || '_____'}</div>
                        <div className="mb-2"><b>From:</b> {memoFrom || '_____'}</div>
                        <div className="mb-2"><b>Subject:</b> <span className="underline">{memoSubject || '_____'}</span></div>
                        <div className="my-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: memoBody || '<i>(No content)</i>' }} />
                        <div className="mb-4">
                            For your favorable consideration and approval. Thank you.
                        </div>
                        <div className="flex flex-col items-end mt-8">
                            <div className="font-bold">MARK L. FLORES, PhD</div>
                            <div>OIC–Dean, College of Computing Studies</div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-4">
                    <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                        Close Preview
                    </Button>
                </div>
            </Modal>
        </>
    )
}

export default DocumentForm
