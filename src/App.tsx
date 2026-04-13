import { useState, useCallback, useEffect, useRef } from 'react';
import { useSettings } from './hooks/useSettings';
import { useZipLoader } from './hooks/useZipLoader';
import { usePageNavigation } from './hooks/usePageNavigation';
import { useZoom } from './hooks/useZoom';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useAutoPlay } from './hooks/useAutoPlay';
import { useFullscreen } from './hooks/useFullscreen';
import { useReadingPosition } from './hooks/useReadingPosition';
import { useFileSystemAccess } from './hooks/useFileSystemAccess';
import { DropZone } from './components/DropZone';
import { DirectoryBrowser } from './components/DirectoryBrowser';
import { Viewer } from './components/Viewer';
import { Toolbar } from './components/Toolbar';
import { SettingsPanel } from './components/SettingsPanel';
import { ResumePrompt } from './components/ResumePrompt';
import { ThemeToggle } from './components/ThemeToggle';
import type { ReadingPositionRecord } from './types';

export default function App() {
  const { settings, setViewMode, setReadingDirection, setAutoTurnInterval, toggleTheme } =
    useSettings();
  const { loadingState, pages, loadZip, cleanup } = useZipLoader();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentIndex,
    currentSpread,
    currentPageNumbers,
    totalSpreads,
    totalPages,
    goNext,
    goPrev,
    goTo,
    goToPage,
    canGoNext,
    isLastSpread,
    setCurrentIndex,
  } = usePageNavigation(pages, settings.viewMode, settings.readingDirection);

  const { zoom, isZoomed, zoomIn, zoomOut, resetZoom } = useZoom(containerRef);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { savePosition, getPosition } = useReadingPosition();
  const fsAccess = useFileSystemAccess();

  const [showSettings, setShowSettings] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<ReadingPositionRecord | null>(null);

  const isReading = loadingState.status === 'ready' && pages.length > 0;

  // Auto play
  const handleAutoTick = useCallback(() => {
    if (canGoNext) goNext();
  }, [canGoNext, goNext]);

  const autoPlay = useAutoPlay({
    interval: settings.autoTurnInterval,
    onTick: handleAutoTick,
    isLastSpread,
  });

  const handleNext = useCallback(() => {
    goNext();
  }, [goNext]);

  const handlePrev = useCallback(() => {
    goPrev();
  }, [goPrev]);

  const handleGoTo = useCallback(
    (index: number) => {
      goTo(index);
    },
    [goTo]
  );

  const handleGoToPage = useCallback(
    (pageIndex: number) => {
      goToPage(pageIndex);
    },
    [goToPage]
  );

  // Click navigation (direction-aware)
  const handleClickLeft = useCallback(() => {
    if (settings.readingDirection === 'rtl') {
      handleNext();
    } else {
      handlePrev();
    }
  }, [settings.readingDirection, handleNext, handlePrev]);

  const handleClickRight = useCallback(() => {
    if (settings.readingDirection === 'rtl') {
      handlePrev();
    } else {
      handleNext();
    }
  }, [settings.readingDirection, handleNext, handlePrev]);

  // Keyboard nav
  useKeyboardNav({
    onNext: handleNext,
    onPrev: handlePrev,
    onToggleAutoPlay: autoPlay.toggle,
    readingDirection: settings.readingDirection,
    enabled: isReading && !showSettings && !resumePrompt,
  });

  // Save reading position on page change
  useEffect(() => {
    if (isReading && loadingState.fileName) {
      const firstPageIndex = currentPageNumbers.length > 0 ? currentPageNumbers[0] - 1 : 0;
      savePosition(loadingState.fileName, firstPageIndex, totalPages);
    }
  }, [isReading, currentIndex, loadingState.fileName, currentPageNumbers, totalPages, savePosition]);

  // Check for resume position when file loaded
  useEffect(() => {
    if (loadingState.status === 'ready' && loadingState.fileName && pages.length > 0) {
      const saved = getPosition(loadingState.fileName);
      if (saved && saved.page > 0) {
        setResumePrompt(saved);
      }
    }
  }, [loadingState.status, loadingState.fileName, pages.length, getPosition]);

  const handleResume = useCallback(() => {
    if (resumePrompt) {
      goToPage(resumePrompt.page);
      setResumePrompt(null);
    }
  }, [resumePrompt, goToPage]);

  const handleStartOver = useCallback(() => {
    setResumePrompt(null);
    setCurrentIndex(0);
  }, [setCurrentIndex]);

  // Handle file select
  const handleFileSelect = useCallback(
    (file: File) => {
      resetZoom();
      autoPlay.stop();
      setCurrentIndex(0);
      loadZip(file);
      history.pushState({ reading: true }, '');
    },
    [resetZoom, autoPlay, setCurrentIndex, loadZip]
  );

  // Handle close viewer (go back to home)
  const handleClose = useCallback(() => {
    autoPlay.stop();
    resetZoom();
    cleanup();
  }, [autoPlay, resetZoom, cleanup]);

  // Browser back button support
  useEffect(() => {
    const handlePopState = () => {
      if (isReading) {
        handleClose();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isReading, handleClose]);

  // Handle directory file select
  const handleDirFileSelect = useCallback(
    async (entry: { name: string; handle: FileSystemFileHandle }) => {
      const file = await fsAccess.getFile(entry);
      handleFileSelect(file);
    },
    [fsAccess, handleFileSelect]
  );

  // File selection / idle state
  if (!isReading) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-cream to-linen dark:from-night-950 dark:to-night-900">
        {/* ヘッダー：右上にテーマトグル */}
        <div className="flex justify-end p-4">
          <ThemeToggle theme={settings.theme} onToggle={toggleTheme} />
        </div>

        {/* メインコンテンツ：スクロール対応 */}
        <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto px-4 pb-16 pt-4">
          <div className="w-full max-w-4xl">
            <h1 className="font-display text-3xl md:text-4xl font-semibold mb-2 tracking-tight text-center text-cocoa-900 dark:text-petal-50">
              Comic Viewer
            </h1>
            <p className="text-sm font-body text-cocoa-400 dark:text-petal-500 mb-2 text-center">
              Your cozy reading corner
            </p>
            <div className="flex justify-center mb-1">
              <span className="text-peach-300 text-lg tracking-widest">~ ~ ~</span>
            </div>
            <div className="h-8" />
            <div className="flex justify-center">
              <DropZone onFileSelect={handleFileSelect} loadingState={loadingState} />
            </div>
            <DirectoryBrowser
              zipFiles={fsAccess.zipFiles}
              isSupported={fsAccess.isSupported}
              onOpenDirectory={fsAccess.openDirectory}
              onSelectFile={handleDirFileSelect}
              thumbnails={fsAccess.thumbnails}
              thumbnailsLoading={fsAccess.thumbnailsLoading}
            />
          </div>
        </div>
      </div>
    );
  }

  // Reading state
  return (
    <div className="h-full flex flex-col bg-black">
      <div className="flex-1 min-h-0 relative">
        <Viewer
          spread={currentSpread}
          readingDirection={settings.readingDirection}
          zoom={zoom}
          isZoomed={isZoomed}
          onClickLeft={handleClickLeft}
          onClickRight={handleClickRight}
          containerRef={containerRef}
        />
      </div>

      <Toolbar
        currentIndex={currentIndex}
        totalSpreads={totalSpreads}
        totalPages={totalPages}
        currentPageNumbers={currentPageNumbers}
        readingDirection={settings.readingDirection}
        onGoTo={handleGoTo}
        onGoToPage={handleGoToPage}
        isZoomed={isZoomed}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        theme={settings.theme}
        onToggleTheme={toggleTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        isAutoPlaying={autoPlay.isPlaying}
        onToggleAutoPlay={autoPlay.toggle}
        onToggleSettings={() => setShowSettings((v) => !v)}
        onClose={handleClose}
        viewMode={settings.viewMode}
      />

      {showSettings && (
        <SettingsPanel
          settings={settings}
          isAutoPlaying={autoPlay.isPlaying}
          onSetViewMode={setViewMode}
          onSetReadingDirection={setReadingDirection}
          onSetAutoTurnInterval={setAutoTurnInterval}
          onToggleAutoPlay={autoPlay.toggle}
          onClose={() => setShowSettings(false)}
        />
      )}

      {resumePrompt && (
        <ResumePrompt
          position={resumePrompt}
          onResume={handleResume}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
}
