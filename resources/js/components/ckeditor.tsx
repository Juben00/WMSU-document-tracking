import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { Editor } from '@ckeditor/ckeditor5-core';

interface CKEditorProps {
    value: string;
    onChange: (data: string) => void;
}

const CKEditorComponent: React.FC<CKEditorProps> = ({ value, onChange }) => {
    return (
        <CKEditor
            editor={ClassicEditor as any}
            data={value}
            onChange={(event, editor) => {
                const data = editor.getData();
                onChange(data);
            }}
            config={{
                licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTA0NjM5OTksImp0aSI6ImVkYmZhZjUzLTUxNDUtNDQ0Zi1hN2Q3LWMxZDU4ZGI0YmNkMyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjhjNTgyN2I0In0.ceTmxH-ydmskK6H8gOE6Sdpo8miGB1luRcTifUMhkWaA_sWPvgxXDBY91Mdv76zVFuNB3enY5OMqt4ZPKO5R_A',
                toolbar: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'outdent',
                    'indent',
                    '|',
                    'blockQuote',
                    'insertTable',
                ]
            }}
        />
    );
};

export default CKEditorComponent;
