// the eyedropper is not widely supported
// so there are no TypeScript types for it
// here, we add our own (and extend the Window interface)

//TS knows to use these as types automatically and it does it by convention
//and it looks for .d.ts file extension so we can automatically use this in our JS withiout using an
//import or export statement**
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
