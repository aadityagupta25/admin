import React, { useEffect, useRef } from 'react';

const SvgaPlayer = ({ url, width = 160, height = 160 }) => {
    const canvasRef = useRef(null);
    const playerRef = useRef(null);

    useEffect(() => {
        if (!url || !canvasRef.current) return;

        let cancelled = false;

        const load = async () => {
            try {
                const { Downloader, Parser, Player } = await import('svga.lite');

                if (cancelled) return;

                if (playerRef.current) {
                    playerRef.current.destroy();
                    playerRef.current = null;
                }

                const downloader = new Downloader();
                const parser = new Parser({ disableWorker: true });

                const fileData = await downloader.get(url);
                if (cancelled) return;

                const svgaData = await parser.do(fileData);
                if (cancelled) return;

                const player = new Player(canvasRef.current);
                playerRef.current = player;
                await player.mount(svgaData);
                player.start();
            } catch (e) {
                console.error('SVGA load error:', e);
            }
        };

        load();

        return () => {
            cancelled = true;
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [url]);

    return (
        <div style={{ width, height, borderRadius: 8, border: '1px solid #e5e7eb', background: '#f3f4f6', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <canvas ref={canvasRef} width={width} height={height} />
        </div>
    );
};

export default SvgaPlayer;
