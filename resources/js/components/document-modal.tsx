import React from 'react'
import { Modal } from '@mantine/core'
import { Button } from './ui/button'
import { X } from 'lucide-react'

interface DocumentModalProps {
    previewOpen: boolean;
    setPreviewOpen: (open: boolean) => void;
    previewRef: React.RefObject<HTMLDivElement | null>;
    memoDate: string;
    memoFor: string;
    memoThru: string;
    memoFrom: string;
    memoSubject: string;
    memoBody: string;
    onClose?: () => void;
}

const DocumentModal: React.FC<DocumentModalProps> = ({
    previewOpen,
    setPreviewOpen,
    previewRef,
    memoDate,
    memoFor,
    memoThru,
    memoFrom,
    memoSubject,
    memoBody,
    onClose
}) => {
    const handleClose = () => {
        setPreviewOpen(false);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            opened={previewOpen}
            onClose={handleClose}
            size="xl"
            centered
            closeOnClickOutside={true}
            closeOnEscape={true}
            withCloseButton={false}
            classNames={{
                header: 'hidden',
                body: 'p-0 relative',
                root: 'z-[100]',
                modal: 'z-[100]',
                overlay: 'z-[99]'
            }}
        >
            <button
                onClick={handleClose}
                className="absolute right-2 top-2 z-50 rounded-full p-2 hover:bg-gray-100 transition-colors"
                aria-label="Close preview"
            >
                <X className="h-5 w-5" />
            </button>
            <div id="memo-preview-content" ref={previewRef} className="bg-white rounded shadow flex w-full print:max-w-none print:rounded-none print:shadow-none">
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
                    <div className="flex justify-end items-center mb-2">
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
        </Modal>
    )
}

export default DocumentModal
