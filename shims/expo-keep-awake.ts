import { useEffect } from 'react';

export const ExpoKeepAwakeTag = 'ExpoKeepAwakeDefaultTag';

export async function isAvailableAsync(): Promise<boolean> {
  return false;
}

export function useKeepAwake(_tag?: string): void {
  useEffect(() => {
    // Intentionally noop in this project to avoid Android activity timing
    // rejections triggered by Expo's dev-only keep-awake wrapper.
  }, []);
}

export async function activateKeepAwakeAsync(_tag?: string): Promise<void> {}

export async function activateKeepAwake(_tag?: string): Promise<void> {}

export async function deactivateKeepAwake(_tag?: string): Promise<void> {}
