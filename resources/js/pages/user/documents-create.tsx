import React from 'react'
import { router } from '@inertiajs/react'
import Navbar from '@/components/navbar'
import DocumentForm from '@/components/document-form'

const DocumentsCreate = () => {
    return (
        <>
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="flex justify-center items-center mb-6">
                    <h1 className="text-2xl font-bold">Create New Document</h1>
                </div>
                <DocumentForm isOpen={true} onOpenChange={() => router.visit('/documents')} />
            </div>
        </>
    )
}

export default DocumentsCreate
