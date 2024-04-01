// the eyedropper is not widely supported
// so there are no TypeScript types for it
// here, we add our own (and extend the Window interface)

//go over all and how does it use it in main because we did not have an export here for an import in main**
interface ColorSelectionOptions {
  signal?: AbortSignal;
}

interface ColorSelectionResult {
  sRGBHex: string;
}

interface EyeDropper {
  open: (options?: ColorSelectionOptions) => Promise<ColorSelectionResult>;
}

interface EyeDropperConstructor {
  new (): EyeDropper;
}

interface Window {
  EyeDropper?: EyeDropperConstructor | undefined;
}
