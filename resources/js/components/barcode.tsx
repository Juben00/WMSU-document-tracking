import React, { useRef, useState } from 'react';
import { Download, Copy } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

interface BarcodeProps {
    barcode_path?: string;
    barcode_value?: string;
    className?: string;
}

const BarcodeComponent: React.FC<BarcodeProps> = ({
    barcode_path,
    barcode_value,
    className = '',
}) => {
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const barcodeRef = useRef<HTMLDivElement>(null);

    const handleCopy = async () => {
        if (barcode_value) {
            try {
                await navigator.clipboard.writeText(barcode_value);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy barcode value:', err);
            }
        }
    };

    const generatePDF = async () => {
        setDownloading(true);

        try {
            // Create PDF directly using jsPDF without html2canvas
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pageWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm

            // Helper function to load images with multiple CORS strategies
            const loadImage = (src: string): Promise<HTMLImageElement> => {
                return new Promise((resolve, reject) => {
                    const img = new Image();

                    // Try different CORS strategies
                    const strategies = [
                        () => { img.crossOrigin = 'anonymous'; },
                        () => { img.crossOrigin = 'use-credentials'; },
                        () => { img.crossOrigin = ''; },
                        () => { delete (img as any).crossOrigin; }
                    ];

                    let strategyIndex = 0;

                    const tryLoad = () => {
                        if (strategyIndex < strategies.length) {
                            strategies[strategyIndex]();
                            strategyIndex++;
                        }

                        img.onload = () => {
                            console.log('Image loaded successfully with strategy', strategyIndex, ':', src);
                            resolve(img);
                        };

                        img.onerror = (error) => {
                            console.warn(`Image load failed with strategy ${strategyIndex} for:`, src, error);
                            if (strategyIndex < strategies.length) {
                                tryLoad(); // Try next strategy
                            } else {
                                reject(new Error(`Failed to load image after all strategies: ${src}`));
                            }
                        };

                        // Add cache-busting parameter
                        img.src = src + '?t=' + Date.now();
                    };

                    tryLoad();
                });
            };

            // Add WMSU Logo
            try {
                const logoPath = window.location.origin + '/storage/images/wmsu_logo.png';
                const logoImg = await loadImage(logoPath);

                // Add WMSU logo (smaller size)
                const logoSize = 15; // mm
                const logoX = (pageWidth - logoSize) / 2;
                pdf.addImage(logoImg, 'PNG', logoX, 15, logoSize, logoSize);
            } catch (logoError) {
                console.warn('Could not load WMSU logo:', logoError);
            }

            // Add WMSU DMTS header (with more spacing)
            pdf.setFontSize(18);
            pdf.setTextColor(220, 38, 38); // Red color
            pdf.text('WMSU DMTS', pageWidth / 2, 40, { align: 'center' });

            pdf.setFontSize(10);
            pdf.setTextColor(107, 114, 128); // Gray color
            pdf.text('Document Management & Tracking System', pageWidth / 2, 50, { align: 'center' });

            // Add barcode if available - using multiple fallback approaches
            if (barcode_path) {
                let barcodeImg: HTMLImageElement | null = null;
                const possiblePaths = [
                    `/storage/${barcode_path}`,
                    `${window.location.origin}/storage/${barcode_path}`,
                    `storage/${barcode_path}`,
                    barcode_path.startsWith('/') ? barcode_path : `/${barcode_path}`
                ];

                console.log('Attempting to load barcode from paths:', possiblePaths);

                // Try different paths until one works
                for (const path of possiblePaths) {
                    try {
                        console.log('Trying path:', path);
                        const fullPath = path.startsWith('http') ? path : window.location.origin + path;
                        barcodeImg = await loadImage(fullPath);
                        console.log('Successfully loaded barcode from:', fullPath);
                        break;
                    } catch (error) {
                        console.warn(`Failed to load from ${path}:`, error);
                        continue;
                    }
                }

                if (barcodeImg) {
                    try {
                        // Calculate image dimensions to fit nicely
                        const maxWidth = 100; // mm
                        const maxHeight = 35; // mm
                        const imgRatio = barcodeImg.width / barcodeImg.height;

                        let imgWidth = maxWidth;
                        let imgHeight = maxWidth / imgRatio;

                        if (imgHeight > maxHeight) {
                            imgHeight = maxHeight;
                            imgWidth = maxHeight * imgRatio;
                        }

                        // Center the barcode image
                        const imgX = (pageWidth - imgWidth) / 2;
                        const imgY = 60;

                        // Add a white background rectangle for the barcode
                        pdf.setFillColor(255, 255, 255);
                        pdf.rect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10, 'F');

                        // Add border around barcode
                        pdf.setDrawColor(229, 231, 235);
                        pdf.setLineWidth(0.5);
                        pdf.rect(imgX - 5, imgY - 5, imgWidth + 10, imgHeight + 10, 'S');

                        // Add the barcode image with pixelated rendering
                        pdf.addImage(barcodeImg, 'PNG', imgX, imgY, imgWidth, imgHeight);

                        console.log('Successfully added barcode to PDF');
                    } catch (addImageError) {
                        console.error('Error adding barcode to PDF:', addImageError);
                        // Fall through to error placeholder
                        barcodeImg = null;
                    }
                }

                if (!barcodeImg) {
                    console.error('All barcode loading attempts failed for path:', barcode_path);

                    // Add placeholder text if image fails to load
                    pdf.setFillColor(248, 250, 252);
                    pdf.setDrawColor(203, 213, 225);
                    pdf.setLineWidth(0.5);
                    pdf.rect(55, 60, 100, 35, 'FD');

                    pdf.setFontSize(10);
                    pdf.setTextColor(156, 163, 175);
                    pdf.text('Barcode image could not be loaded', pageWidth / 2, 80, { align: 'center' });
                }
            } else {
                // No barcode path available
                pdf.setFillColor(248, 250, 252);
                pdf.setDrawColor(203, 213, 225);
                pdf.setLineWidth(0.5);
                pdf.rect(55, 60, 100, 35, 'FD');

                pdf.setFontSize(10);
                pdf.setTextColor(156, 163, 175);
                pdf.text('No barcode available', pageWidth / 2, 80, { align: 'center' });
            }

            // Add barcode value (smaller and moved up closer to barcode)
            if (barcode_value) {
                // Background rectangle for barcode value (smaller)
                pdf.setFontSize(12);
                const textWidth = Math.max(pdf.getTextWidth(barcode_value) + 20, 60);
                const rectX = (pageWidth - textWidth) / 2;

                pdf.setFillColor(243, 244, 246);
                pdf.setDrawColor(209, 213, 219);
                pdf.setLineWidth(0.5);
                pdf.rect(rectX, 102, textWidth, 12, 'FD');

                pdf.setFontSize(12);
                pdf.setTextColor(31, 41, 55);
                pdf.setFont('courier', 'bold');
                pdf.text(barcode_value, pageWidth / 2, 111, { align: 'center' });
            } else {
                pdf.setFontSize(12);
                pdf.setTextColor(156, 163, 175);
                pdf.setFont('helvetica', 'normal');
                pdf.text('N/A', pageWidth / 2, 111, { align: 'center' });
            }

            // Add footer (smaller and moved up closer to barcode value)
            pdf.setDrawColor(229, 231, 235);
            pdf.setLineWidth(0.3);
            pdf.line(40, 125, pageWidth - 40, 125);

            pdf.setFontSize(7);
            pdf.setTextColor(156, 163, 175);
            pdf.setFont('helvetica', 'normal');
            const currentDate = format(new Date(), 'MMMM dd, yyyy \'at\' h:mm a');
            pdf.text(`Generated on ${currentDate}`, pageWidth / 2, 131, { align: 'center' });
            pdf.text('Western Mindanao State University', pageWidth / 2, 136, { align: 'center' });

            // Save the PDF
            const fileName = `WMSU-DMTS-Barcode-${format(new Date(), 'yyyyMMdd-HHmmss')}.pdf`;
            pdf.save(fileName);

            console.log('PDF generated successfully');

        } catch (error) {
            console.error('Error generating PDF:', error);

            // Show a more detailed error message
            let errorMessage = 'Failed to generate PDF. ';
            if (error instanceof Error) {
                errorMessage += error.message;
            } else {
                errorMessage += 'Please check the console for more details.';
            }

            alert(errorMessage);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className={`bg-white p-2 dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden max-w-md mx-auto ${className}`}>
            <div ref={barcodeRef} className="p-2 text-center">

                {/* Barcode Display */}
                <div className=" w-full">
                    {barcode_path ? (
                        <div className="inline-block p-6 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600">
                            <img
                                src={`/storage/${barcode_path}`}
                                alt="Document Barcode"
                                className="max-w-full h-auto max-h-32 mx-auto"
                                style={{ imageRendering: 'pixelated' }}
                                onError={(e) => {
                                    console.error('Failed to load barcode image:', e);
                                }}
                            />
                        </div>
                    ) : (
                        <div className="inline-block p-8 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                            <p className="text-sm text-gray-500 dark:text-gray-400">No barcode available</p>
                        </div>
                    )}
                </div>

                {/* Barcode Value */}
                <div className=" w-full">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 px-9 border border-gray-200 dark:border-gray-600 inline-block">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-bold text-gray-800 dark:text-gray-200">
                                {barcode_value || 'N/A'}
                            </span>
                            {barcode_value && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                                    title={copied ? 'Copied!' : 'Copy barcode value'}
                                    type="button"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            )}
                            {/* Download Button */}
                            <button
                                onClick={generatePDF}
                                disabled={downloading}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                type="button"
                            >
                                <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                                Copied!
                            </p>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default BarcodeComponent;
