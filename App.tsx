import React, { useState, useCallback, useEffect, useRef } from 'react';
import { generateLinkedInImages } from './services/geminiService';
import { SUGGESTED_TAGS, LOADING_MESSAGES, PREDEFINED_STYLES } from './constants';
import ImageCard from './components/ImageCard';
import TagButton from './components/TagButton';
import LoadingSkeleton from './components/LoadingSkeleton';
import StyleSelector from './components/StyleSelector';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [selectedStyle, setSelectedStyle] = useState<string>(PREDEFINED_STYLES[0].id);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>(LOADING_MESSAGES[0]);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageForVariations, setSelectedImageForVariations] = useState<string | null>(null);

    const basePromptRef = useRef<string>('');
    const baseStyleRef = useRef<string>(PREDEFINED_STYLES[0].id);
    const baseImageRef = useRef<string | null>(null);
    const resultsContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = LOADING_MESSAGES.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
                    return LOADING_MESSAGES[nextIndex];
                });
            }, 2500);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const handleGenerate = useCallback(async (basePrompt: string, styleId: string, count: number, isVariation: boolean = false, image: string | null = null) => {
        if (!basePrompt.trim()) {
            setError('Por favor, introduce una descripción para la imagen.');
            return;
        }

        const style = PREDEFINED_STYLES.find(s => s.id === styleId);
        if (!style) {
            setError('Estilo seleccionado no válido.');
            return;
        }

        setIsLoading(true);
        setError(null);
        if (!isVariation) {
            setGeneratedImages([]);
            basePromptRef.current = basePrompt;
            baseStyleRef.current = styleId;
            baseImageRef.current = image;
        }

        try {
            const newImages = await generateLinkedInImages(basePrompt, style.promptValue, count, image);
            setGeneratedImages(prev => isVariation ? [...prev, ...newImages] : newImages);
            setTimeout(() => {
                resultsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsLoading(false);
            if (isVariation) {
                setSelectedImageForVariations(null);
            }
        }
    }, []);

    const handleInitialGeneration = () => {
        handleGenerate(prompt, selectedStyle, 3, false, referenceImage);
    };

    const handleRegenerate = () => {
        if (basePromptRef.current) {
            handleGenerate(basePromptRef.current, baseStyleRef.current, 3, false, baseImageRef.current);
        }
    };

    const handleSelectImage = (imageUrl: string) => {
        if(isLoading) return;
        setSelectedImageForVariations(imageUrl);
        handleGenerate(basePromptRef.current, baseStyleRef.current, 2, true, imageUrl);
    };
    
    const handleDownload = (imageUrl: string) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `linkedin-image-${Date.now()}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleTagClick = (tag: string) => {
        setPrompt(prev => prev ? `${prev}, ${tag}` : tag);
    };
    
    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setReferenceImage(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        } else {
            setError("Por favor, sube un archivo de imagen válido (JPG o PNG).");
        }
        if (event.target) {
            event.target.value = '';
        }
    };

    const handleRemoveImage = () => {
        setReferenceImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const isInitialState = generatedImages.length === 0 && !isLoading;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Control Panel */}
                    <aside className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-8">
                        <div className="flex items-center gap-3 mb-6">
                             <div className="bg-brand-blue p-2 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900">Generador de Imágenes</h1>
                        </div>
                        <p className="text-slate-600 mb-6 text-sm">Crea imágenes profesionales para tu perfil de LinkedIn. Describe tu idea, elige un estilo y deja que la IA haga el resto.</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700 mb-2">1. Describe la imagen que necesitas</label>
                                <textarea
                                    id="prompt"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ej: un retrato profesional de una mujer líder en una oficina moderna, con tonos azules."
                                    className="w-full h-32 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 resize-none text-sm"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <h3 className="block text-sm font-semibold text-slate-700 mb-2">2. Elige un estilo</h3>
                                <StyleSelector
                                    styles={PREDEFINED_STYLES}
                                    selectedStyle={selectedStyle}
                                    onSelect={setSelectedStyle}
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label htmlFor="image-upload" className="block text-sm font-semibold text-slate-700 mb-2">3. Sube una imagen (opcional)</label>
                                {referenceImage ? (
                                    <div className="relative group">
                                        <img src={referenceImage} alt="Referencia" className="w-full h-auto rounded-lg border border-slate-300" />
                                        <button
                                            onClick={handleRemoveImage}
                                            disabled={isLoading}
                                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Eliminar imagen"
                                            aria-label="Eliminar imagen de referencia"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="image-upload" className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-center transition-colors ${isLoading ? 'cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:border-sky-500 hover:bg-sky-50'}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h10a4 4 0 014 4v6a4 4 0 01-4 4H7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 12a2 2 0 10-4 0 2 2 0 004 0z" /></svg>
                                        <span className={`font-semibold ${isLoading ? 'text-slate-500' : 'text-brand-blue'}`}>Selecciona un archivo</span>
                                        <p className="text-xs text-slate-500 mt-1">PNG o JPG</p>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            ref={fileInputRef}
                                            accept="image/png, image/jpeg"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            disabled={isLoading}
                                        />
                                    </label>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">4. Añade etiquetas (opcional)</h3>
                                <div className="flex flex-wrap gap-2">
                                    {SUGGESTED_TAGS.map(tag => (
                                        <TagButton key={tag} tag={tag} onClick={handleTagClick} disabled={isLoading} />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleInitialGeneration}
                                    disabled={isLoading || !prompt.trim()}
                                    className="w-full bg-brand-blue text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-700 transition-colors duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? 'Generando...' : 'Generar Imágenes'}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" /></svg>
                                </button>
                                {generatedImages.length > 0 && (
                                    <button
                                        onClick={handleRegenerate}
                                        disabled={isLoading}
                                        className="w-full mt-3 bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        Regenerar con el mismo prompt
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 10M20 20l-1.5-1.5A9 9 0 003.5 14" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </aside>
                    
                    {/* Results Panel */}
                    <section ref={resultsContainerRef} className="lg:col-span-8">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {isInitialState && !error && (
                            <div className="flex flex-col items-center justify-center h-full bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <h2 className="text-xl font-semibold text-slate-700">Tus imágenes aparecerán aquí</h2>
                                <p className="text-slate-500 mt-2 max-w-sm">Completa los pasos en el panel de la izquierda para comenzar a crear tu contenido visual.</p>
                            </div>
                        )}
                        
                        {isLoading && (
                            <div>
                                <div className="flex flex-col items-center justify-center mb-6">
                                    <h3 className="text-lg font-semibold text-slate-700">{loadingMessage}</h3>
                                    <p className="text-sm text-slate-500">Esto puede tardar unos segundos...</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    <LoadingSkeleton />
                                    <LoadingSkeleton />
                                    <LoadingSkeleton />
                                </div>
                            </div>
                        )}
                        
                        {!isLoading && generatedImages.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {generatedImages.map((imgUrl, index) => (
                                    <ImageCard
                                        key={index}
                                        imageUrl={imgUrl}
                                        isSelected={selectedImageForVariations === imgUrl}
                                        isLoadingVariations={isLoading && selectedImageForVariations === imgUrl}
                                        onSelect={handleSelectImage}
                                        onDownload={handleDownload}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default App;