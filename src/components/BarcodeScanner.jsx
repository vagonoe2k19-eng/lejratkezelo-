import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

const BarcodeScanner = ({ onClose, onScan }) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const html5QrCode = new Html5Qrcode("reader");
        const config = { fps: 10, qrbox: { width: 250, height: 150 } };

        html5QrCode.start(
            { facingMode: "environment" },
            config,
            async (decodedText) => {
                // Barcode scanned successfully
                html5QrCode.stop();

                try {
                    // Try to fetch product info from Open Food Facts
                    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${decodedText}.json`);
                    const data = await res.json();

                    if (data.status === 1) {
                        onScan({
                            name: data.product.product_name || "Ismeretlen termék",
                            category: 'Élelmiszer',
                            barcode: decodedText,
                            batches: [{ expiryDate: '', quantity: 1, id: Date.now() }]
                        });
                    } else {
                        onScan({
                            name: "Ismeretlen termék",
                            category: 'Élelmiszer',
                            barcode: decodedText,
                            batches: [{ expiryDate: '', quantity: 1, id: Date.now() }]
                        });
                    }
                } catch (err) {
                    onScan({
                        name: "Szkennelt termék",
                        category: 'Élelmiszer',
                        barcode: decodedText,
                        batches: [{ expiryDate: '', quantity: 1, id: Date.now() }]
                    });
                }
            },
            (errorMessage) => {
                // parse error, ignore
            }
        ).catch(err => {
            setError("Nem sikerült elérni a kamerát. Ellenőrizd az engedélyeket.");
        }).finally(() => {
            setLoading(false);
        });

        return () => {
            if (html5QrCode.isScanning) {
                html5QrCode.stop();
            }
        };
    }, []);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 2000
        }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '500px', padding: '1rem' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '-40px', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                    <X size={32} />
                </button>

                <div id="reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden' }}></div>

                {loading && <div style={{ textAlign: 'center', marginTop: '1rem', color: 'white' }}>Kamera indítása...</div>}
                {error && <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--status-danger)' }}>{error}</div>}

                <div style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)' }}>
                    Helyezd a termék vonalkódját a keretbe.
                </div>
            </div>
        </div>
    );
};

export default BarcodeScanner;
