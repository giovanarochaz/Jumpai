// src/globals.d.ts

declare global {
  interface MediaTrackCapabilities {
    torch?: boolean;
  }

  interface MediaTrackConstraintSet {
    torch?: boolean;
  }
}

export {};