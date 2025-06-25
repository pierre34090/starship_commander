// src/libs/Items/ModuleFactory.ts

import { v4 as uuidv4 } from 'uuid';
import type { ModuleState } from '../../state/Items/ModuleState';
import { createModuleState } from '../../state/Items/ModuleState';

/**
 * Create a ModuleState instance from a module template,
 * generating a unique id and applying defaults.
 */
export function createModuleInstance(template: Partial<ModuleState>): ModuleState {
  return createModuleState({
    ...template,
    id: uuidv4(),
  });
}
