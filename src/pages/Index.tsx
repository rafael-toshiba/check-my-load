import { useState } from 'react';
import { LoadSearch } from '@/components/LoadSearch';
import { BrandSelection } from '@/components/BrandSelection';
import { ProductList } from '@/components/ProductList';
import { PhotoCapture } from '@/components/PhotoCapture';
import { CompletionScreen } from '@/components/CompletionScreen';
import { useCargoProgress } from '@/hooks/useCargoProgress';
import { useActionHistory } from '@/hooks/useActionHistory';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Index = () => {
  const {
    currentCargo,
    products,
    photos,
    bags,
    currentStep,
    checkSavedProgress,
    selectedBrands,
    searchCargo,
    updateProduct,
    addPhoto,
    updatePhotoObservation,
    removePhoto,
    addBag,
    removeBag,
    getProductAvailability,
    getOrderAvailability,
    getOrdersForCargo,
    isBagCodeUsed,
    clearCargo,
    clearSavedProgress,
    saveProgress,
    proceedToPhotos,
    completeConference,
    getStats,
    getStatsForBrands,
    canProceedToPhotos,
    canFinalize,
    // Brand
    getBrandStatuses,
    toggleBrandSelection,
    getProductsForSelectedBrands,
    goToVerification,
    goToBrandSelection,
    allBrandsComplete,
  } = useCargoProgress();

  const {
    history: actionHistory,
    addEntry: addHistoryEntry,
    clearHistory,
  } = useActionHistory(currentCargo?.id ?? null);

  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [pendingCargoId, setPendingCargoId] = useState<string | null>(null);
  const [searchError, setSearchError] = useState('');

  const handleSearchSubmit = (cargoId: string) => {
    setSearchError('');
    // Check if cargo exists in mock data
    const exists = searchCargo(cargoId, false);
    if (!exists) {
      // searchCargo returns null if not found, but it also sets state.
      // We need to just test existence without side effects. Let's search fresh:
      // Actually searchCargo already returns null if not found and doesn't change state.
      setSearchError('Carga não encontrada');
      return;
    }
    // Cargo was loaded fresh. Now check if there was saved progress.
    const hasSaved = checkSavedProgress(cargoId);
    if (hasSaved) {
      setPendingCargoId(cargoId);
      setResumeDialogOpen(true);
    } else {
      addHistoryEntry('conference_started', `Conferência da carga #${cargoId} iniciada`);
    }
  };

  const handleContinueProgress = () => {
    if (pendingCargoId) {
      searchCargo(pendingCargoId, true);
      addHistoryEntry('conference_started', `Conferência da carga #${pendingCargoId} retomada`);
    }
    setResumeDialogOpen(false);
    setPendingCargoId(null);
  };

  const handleStartFresh = () => {
    if (pendingCargoId) {
      clearSavedProgress(pendingCargoId);
      searchCargo(pendingCargoId, false);
      addHistoryEntry('conference_started', `Conferência da carga #${pendingCargoId} iniciada`);
    }
    setResumeDialogOpen(false);
    setPendingCargoId(null);
  };

  const handleNewConference = () => {
    if (currentCargo) {
      clearSavedProgress(currentCargo.id);
    }
    clearCargo();
  };

  const handleAddPhoto = (imageData: string, observation?: string) => {
    addPhoto(imageData, observation);
    const currentPhotoCount = photos.length + 1;
    addHistoryEntry('photo_captured', `Foto ${currentPhotoCount}/5 capturada na carga`, {
      photoNumber: currentPhotoCount,
    });
  };

  const handleCompleteConference = () => {
    addHistoryEntry('conference_completed', `Conferência da carga #${currentCargo?.id} finalizada`);
    completeConference();
  };

  const handleSaveBrands = () => {
    saveProgress();
    toast.success('Progresso salvo!', { description: 'Você pode continuar depois.' });
  };

  // Search screen
  if (!currentCargo) {
    return (
      <>
        <LoadSearch onSearch={handleSearchSubmit} />
        <AlertDialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Progresso encontrado</AlertDialogTitle>
              <AlertDialogDescription>
                Encontramos um progresso salvo para a carga #{pendingCargoId}. Deseja continuar de onde parou ou iniciar uma nova conferência?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={handleStartFresh}>
                Iniciar do Zero
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleContinueProgress}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Completion screen
  if (currentStep === 'completed') {
    return (
      <CompletionScreen
        cargoId={currentCargo.id}
        products={products}
        photos={photos}
        onNewConference={handleNewConference}
      />
    );
  }

  // Photo capture screen
  if (currentStep === 'photos') {
    return (
      <PhotoCapture
        cargoId={currentCargo.id}
        photos={photos}
        onBack={goToBrandSelection}
        onAddPhoto={handleAddPhoto}
        onUpdateObservation={updatePhotoObservation}
        onRemovePhoto={removePhoto}
        onSave={saveProgress}
        onFinalize={handleCompleteConference}
        canFinalize={canFinalize()}
      />
    );
  }

  // Brand selection screen
  if (currentStep === 'brand-selection') {
    return (
      <BrandSelection
        cargoId={currentCargo.id}
        licensePlate={currentCargo.licensePlate}
        brandStatuses={getBrandStatuses()}
        selectedBrands={selectedBrands}
        products={products}
        onToggleBrand={toggleBrandSelection}
        onStartVerification={goToVerification}
        onProceedToPhotos={proceedToPhotos}
        onBack={clearCargo}
        onSave={handleSaveBrands}
        allComplete={allBrandsComplete()}
      />
    );
  }

  // Product verification screen (filtered by selected brands)
  const brandProducts = getProductsForSelectedBrands();
  const brandStats = getStatsForBrands(selectedBrands);

  return (
    <ProductList
      cargoId={currentCargo.id}
      products={brandProducts}
      bags={bags}
      onBack={goToBrandSelection}
      onUpdateProduct={updateProduct}
      onSave={saveProgress}
      onProceed={goToBrandSelection}
      onAddBag={addBag}
      onRemoveBag={removeBag}
      getOrderAvailability={getOrderAvailability}
      getProductAvailability={getProductAvailability}
      getOrdersForCargo={getOrdersForCargo}
      isBagCodeUsed={isBagCodeUsed}
      stats={brandStats}
      canProceed={canProceedToPhotos()}
      actionHistory={actionHistory}
      onAddHistoryEntry={addHistoryEntry}
      onClearHistory={clearHistory}
      selectedBrands={selectedBrands}
    />
  );
};

export default Index;
