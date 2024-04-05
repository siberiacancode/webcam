export const RESOLUTIONS = {
  qvga: { width: { exact: 320 }, height: { exact: 240 } },
  vga: { width: { exact: 640 }, height: { exact: 480 } },
  hd: { width: { exact: 1280 }, height: { exact: 720 } },
  fullHd: { width: { exact: 1920 }, height: { exact: 1080 } },
  televisionFourK: { width: { exact: 3840 }, height: { exact: 2160 } },
  cinemaFourK: { width: { exact: 4096 }, height: { exact: 2160 } },
  eightK: { width: { exact: 7680 }, height: { exact: 4320 } }
} as const;
